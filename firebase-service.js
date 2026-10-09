/**
 * Firebase Real-time Service for GarbaConnect
 * Connects Google Authentication and Cloud Firestore for live multi-user matching and chat.
 */

class GarbaFirebaseService {
  constructor() {
    this.auth = null;
    this.db = null;
    this.isInitialized = false;
    this.activeMatchesUnsub = null;
    this.activeChatUnsub = null;
  }

  /**
   * Initializes Firebase using either localStorage or firebase-config.js
   */
  init() {
    const config = getActiveFirebaseConfig();
    if (!config) {
      console.log('GarbaConnect: Firebase credentials not configured. Running in local demo mode.');
      return false;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(config);
      }
      this.auth = firebase.auth();
      this.db = firebase.firestore();
      this.isInitialized = true;
      console.log('GarbaConnect: Firebase successfully connected!');
      return true;
    } catch (err) {
      console.error('GarbaConnect: Failed to initialize Firebase', err);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Triggers Google Sign-In popup
   */
  async signInWithGoogle() {
    if (!this.isInitialized && !this.init()) {
      throw new Error('Firebase is not configured. Please enter your Firebase config keys.');
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    const result = await this.auth.signInWithPopup(provider);
    const user = result.user;

    // Check if user profile already exists in Firestore
    const userDoc = await this.db.collection('users').doc(user.uid).get();
    
    return {
      firebaseUser: user,
      profileExists: userDoc.exists,
      profileData: userDoc.exists ? userDoc.data() : null
    };
  }

  /**
   * Signs the user out of Firebase
   */
  async signOut() {
    if (this.activeMatchesUnsub) {
      this.activeMatchesUnsub();
      this.activeMatchesUnsub = null;
    }
    if (this.activeChatUnsub) {
      this.activeChatUnsub();
      this.activeChatUnsub = null;
    }
    if (this.auth && this.auth.currentUser) {
      await this.auth.signOut();
    }
  }

  /**
   * Saves or updates a user's profile in Firestore
   */
  async saveUserProfile(uid, profileData) {
    if (!this.isInitialized) return;
    
    const payload = {
      ...profileData,
      uid,
      updatedAt: Date.now()
    };

    await this.db.collection('users').doc(uid).set(payload, { merge: true });
    return payload;
  }

  /**
   * Fetches real user profiles for the swipe deck (excluding current user & already swiped users)
   */
  async fetchDiscoverProfiles(currentUid) {
    if (!this.isInitialized) return [];

    try {
      // 1. Get already swiped target user IDs
      const swipesSnapshot = await this.db.collection('swipes')
        .where('from', '==', currentUid)
        .get();

      const swipedUserIds = new Set();
      swipesSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.to) swipedUserIds.add(data.to);
      });

      // 2. Fetch all registered users
      const usersSnapshot = await this.db.collection('users')
        .limit(100)
        .get();

      const cloudProfiles = [];
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        if (doc.id !== currentUid && !swipedUserIds.has(doc.id)) {
          cloudProfiles.push({
            id: doc.id,
            name: data.name || 'Garba Dancer',
            age: data.age || 24,
            city: data.city || 'Gujarat',
            gender: data.gender || 'Dancer',
            skill: data.skill || 'Intermediate',
            looking: data.looking || 'Dance Partner',
            bio: data.bio || 'Ready for Navratri! 🪔',
            styles: data.styles && data.styles.length ? data.styles : ['Traditional Garba'],
            emoji: data.emoji || '💃',
            photoURL: data.photoURL || null,
            color: data.color || '#e85d04',
            isCloudUser: true
          });
        }
      });

      return cloudProfiles;
    } catch (err) {
      console.error('Error fetching cloud profiles:', err);
      return [];
    }
  }

  /**
   * Records a swipe and checks for mutual match
   */
  async recordSwipe(fromUid, toUid, action, currentUserProfile, targetProfile) {
    if (!this.isInitialized) return { isMatch: false };

    try {
      // Record our swipe
      const swipeId = `${fromUid}_${toUid}`;
      await this.db.collection('swipes').doc(swipeId).set({
        from: fromUid,
        to: toUid,
        action, // 'like', 'super', 'pass'
        timestamp: Date.now()
      });

      // If we didn't like or superlike, no match possible
      if (action !== 'right' && action !== 'super') {
        return { isMatch: false };
      }

      // Check if other user already liked us!
      const reciprocalSwipeId = `${toUid}_${fromUid}`;
      const reciprocalDoc = await this.db.collection('swipes').doc(reciprocalSwipeId).get();

      if (reciprocalDoc.exists) {
        const otherSwipe = reciprocalDoc.data();
        if (otherSwipe.action === 'right' || otherSwipe.action === 'super' || otherSwipe.action === 'like') {
          // MUTUAL MATCH! Create match document
          const matchId = [fromUid, toUid].sort().join('_');
          const matchDoc = {
            id: matchId,
            users: [fromUid, toUid],
            participants: {
              [fromUid]: {
                id: fromUid,
                name: currentUserProfile.name,
                emoji: currentUserProfile.emoji || '💃',
                photoURL: currentUserProfile.photoURL || null,
                city: currentUserProfile.city || '',
                skill: currentUserProfile.skill || '',
                looking: currentUserProfile.looking || ''
              },
              [toUid]: {
                id: toUid,
                name: targetProfile.name,
                emoji: targetProfile.emoji || '🕺',
                photoURL: targetProfile.photoURL || null,
                city: targetProfile.city || '',
                skill: targetProfile.skill || '',
                looking: targetProfile.looking || ''
              }
            },
            createdAt: Date.now(),
            lastMessage: "You matched! Start dancing 🪔",
            lastMessageTime: Date.now(),
            lastSenderId: null
          };

          await this.db.collection('matches').doc(matchId).set(matchDoc, { merge: true });

          return {
            isMatch: true,
            matchId,
            matchDoc
          };
        }
      }

      return { isMatch: false };
    } catch (err) {
      console.error('Error recording swipe:', err);
      return { isMatch: false };
    }
  }

  /**
   * Real-time listener for current user's matches
   */
  subscribeToMatches(currentUid, onMatchesUpdate) {
    if (!this.isInitialized) return () => {};

    if (this.activeMatchesUnsub) {
      this.activeMatchesUnsub();
    }

    this.activeMatchesUnsub = this.db.collection('matches')
      .where('users', 'array-contains', currentUid)
      .orderBy('lastMessageTime', 'desc')
      .onSnapshot(snapshot => {
        const matches = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          const otherUid = data.users.find(u => u !== currentUid);
          const otherProfile = data.participants ? data.participants[otherUid] : null;

          if (otherProfile) {
            matches.push({
              id: doc.id,
              cloudMatchId: doc.id,
              userId: otherUid,
              name: otherProfile.name,
              emoji: otherProfile.emoji || '💃',
              photoURL: otherProfile.photoURL || null,
              city: otherProfile.city || '',
              skill: otherProfile.skill || '',
              looking: otherProfile.looking || '',
              lastMessage: data.lastMessage || 'Connected!',
              lastMessageTime: data.lastMessageTime || data.createdAt || Date.now(),
              isCloudMatch: true
            });
          }
        });

        onMatchesUpdate(matches);
      }, err => {
        console.warn('Matches subscription error:', err);
      });

    return this.activeMatchesUnsub;
  }

  /**
   * Real-time listener for chat messages in a specific match
   */
  subscribeToChat(matchId, onMessagesUpdate) {
    if (!this.isInitialized) return () => {};

    if (this.activeChatUnsub) {
      this.activeChatUnsub();
    }

    this.activeChatUnsub = this.db.collection('matches')
      .doc(matchId)
      .collection('messages')
      .orderBy('time', 'asc')
      .onSnapshot(snapshot => {
        const messages = [];
        snapshot.forEach(doc => {
          messages.push({
            id: doc.id,
            ...doc.data()
          });
        });
        onMessagesUpdate(messages);
      }, err => {
        console.warn('Chat subscription error:', err);
      });

    return this.activeChatUnsub;
  }

  /**
   * Sends a message to a cloud match
   */
  async sendMessage(matchId, senderId, text) {
    if (!this.isInitialized) return;

    const timestamp = Date.now();
    const msgData = {
      senderId,
      text,
      time: timestamp
    };

    // Add to messages sub-collection
    await this.db.collection('matches')
      .doc(matchId)
      .collection('messages')
      .add(msgData);

    // Update parent match record
    await this.db.collection('matches')
      .doc(matchId)
      .set({
        lastMessage: text,
        lastMessageTime: timestamp,
        lastSenderId: senderId
      }, { merge: true });
  }
}

// Global instance
window.garbaFirebase = new GarbaFirebaseService();
