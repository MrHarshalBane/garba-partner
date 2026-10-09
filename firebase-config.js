/**
 * Firebase Configuration for GarbaConnect
 * 
 * To connect your live database so you and your friends can swipe, match, and chat:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a free project (e.g., "garba-partner")
 * 3. In the sidebar: Build -> Authentication -> Get Started -> Enable "Google" provider
 * 4. In the sidebar: Build -> Firestore Database -> Create Database -> Start in test mode
 * 5. In Project Settings (gear icon) -> General -> Under "Your apps" click Web (</>)
 * 6. Copy your firebaseConfig object and paste its values below:
 */

window.FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

/**
 * Returns true if valid Firebase credentials have been provided either in code
 * or saved into localStorage via the in-app configuration modal.
 */
function getActiveFirebaseConfig() {
  const localSaved = localStorage.getItem('gc_firebase_config');
  if (localSaved) {
    try {
      const parsed = JSON.parse(localSaved);
      if (parsed && parsed.apiKey && parsed.apiKey !== 'YOUR_API_KEY') {
        return parsed;
      }
    } catch (_) {}
  }

  if (window.FIREBASE_CONFIG && 
      window.FIREBASE_CONFIG.apiKey && 
      window.FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY' &&
      window.FIREBASE_CONFIG.projectId !== 'YOUR_PROJECT_ID') {
    return window.FIREBASE_CONFIG;
  }

  return null;
}
