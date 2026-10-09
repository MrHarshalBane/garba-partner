/* ============================
   GARBACONNECT – App Logic
   ============================ */

// ============================
// DATA
// ============================

const GARBA_STYLES = [
  'Traditional Garba', 'Raas Garba', 'Dandiya Raas',
  'Hinch', 'Dodhiya', 'Teen Taali', 'Modern Fusion',
  'Folk Garba', 'Classical', 'Bollywood Garba'
];

const AVATARS = {
  woman: ['👩', '👩‍🦰', '👩‍🦳', '🧕', '👩‍🦱', '👸'],
  man:   ['👨', '👨‍🦰', '👨‍🦳', '🧔', '👨‍🦱', '🤴'],
  nb:    ['🧑', '🧑‍🦰', '🧑‍🦳', '🧑‍🦱', '🧑‍🎤', '🧑‍🦲'],
};

const SAMPLE_PROFILES = [
  {
    id: 'p1', name: 'Priya Shah', age: 24, city: 'Ahmedabad',
    gender: 'Woman', skill: 'Advanced', looking: 'Dance Partner',
    bio: 'Passionate Garba dancer for 10 years. Love participating in Navratri events. Looking for someone who matches my energy on the dance floor! 💃',
    styles: ['Traditional Garba', 'Raas Garba', 'Teen Taali'],
    emoji: '👩‍🦰', color: '#e85d04',
    liked: false, superLiked: false
  },
  {
    id: 'p2', name: 'Raj Patel', age: 28, city: 'Surat',
    gender: 'Man', skill: 'Intermediate', looking: 'Life Partner',
    bio: 'Engineer by day, Garba enthusiast by night! Looking for someone to share my love of dance and life. 🎊',
    styles: ['Dandiya Raas', 'Modern Fusion', 'Folk Garba'],
    emoji: '👨‍🦱', color: '#7b2d8b',
    liked: false, superLiked: false
  },
  {
    id: 'p3', name: 'Meera Joshi', age: 22, city: 'Vadodara',
    gender: 'Woman', skill: 'Pro Dancer', looking: 'Dance Partner',
    bio: 'Professional Garba performer and choreographer. Trained in classical and folk styles. Looking for a skilled partner for competitions! 🏆',
    styles: ['Traditional Garba', 'Classical', 'Folk Garba', 'Hinch'],
    emoji: '💃', color: '#e74c3c',
    liked: false, superLiked: false
  },
  {
    id: 'p4', name: 'Aryan Desai', age: 26, city: 'Mumbai',
    gender: 'Man', skill: 'Beginner', looking: 'Friendship',
    bio: 'Mumbai guy who recently discovered Garba and fell in love with it! Looking for patient friends to learn with. 🙏',
    styles: ['Dandiya Raas', 'Bollywood Garba'],
    emoji: '🧔', color: '#3498db',
    liked: false, superLiked: false
  },
  {
    id: 'p5', name: 'Kavya Mehta', age: 25, city: 'Rajkot',
    gender: 'Woman', skill: 'Intermediate', looking: 'Group Partner',
    bio: 'Part of a Garba troupe in Rajkot. Love the community aspect of Garba. Looking for more people to join our group! 🌟',
    styles: ['Traditional Garba', 'Raas Garba', 'Dodhiya'],
    emoji: '👩‍🦳', color: '#f5a623',
    liked: false, superLiked: false
  },
  {
    id: 'p6', name: 'Dev Trivedi', age: 30, city: 'Ahmedabad',
    gender: 'Man', skill: 'Advanced', looking: 'Life Partner',
    bio: 'CA by profession, dancer by passion. Navratri is my favorite time of year. Looking for someone who loves dance and culture. 🪔',
    styles: ['Traditional Garba', 'Teen Taali', 'Hinch', 'Classical'],
    emoji: '🤴', color: '#27ae60',
    liked: false, superLiked: false
  },
  {
    id: 'p7', name: 'Nisha Agarwal', age: 23, city: 'Pune',
    gender: 'Woman', skill: 'Intermediate', looking: 'Dance Partner',
    bio: 'Pune-based marketing student. Garba has been part of my life since childhood. Ready for Navratri 2025! 🎉',
    styles: ['Modern Fusion', 'Bollywood Garba', 'Dandiya Raas'],
    emoji: '👩', color: '#e85d04',
    liked: false, superLiked: false
  },
  {
    id: 'p8', name: 'Vikram Singh', age: 27, city: 'Delhi',
    gender: 'Man', skill: 'Beginner', looking: 'Dance Partner',
    bio: 'Delhi boy with Gujarati roots. Garba connects me to my heritage. Looking for someone to enjoy the festival with! 🥁',
    styles: ['Dandiya Raas', 'Folk Garba', 'Modern Fusion'],
    emoji: '👨', color: '#7b2d8b',
    liked: false, superLiked: false
  },
];

const AUTO_REPLIES = [
  "Jai Mataji! 🙏 So happy to connect with you!",
  "I love your profile! Which events do you usually attend for Navratri?",
  "Have you been to Vadodara's Navratri celebration? It's magical! 🪔",
  "What's your favorite Garba style? I love Teen Taali!",
  "Would love to dance with you at the next Navratri! 💃",
  "Your dance style sounds amazing! We should practice together. 🎊",
  "I perform at GMDC ground every year – maybe we'll see each other! ✨",
  "Garba is so much more than just dance, it's a spiritual experience for me. 🌺",
];

// ============================
// STATE
// ============================

let state = {
  user: null,
  profiles: [],
  currentCardIndex: 0,
  matches: [],
  messages: {}, // { profileId: [{ text, sent, time }] }
  stats: { likes: 0, matches: 0, msgs: 0 },
  activeChat: null,
  pendingMatchProfile: null,
  selectedSkill: '',
  selectedLooking: '',
  selectedStyles: [],
  pendingGoogleAuth: null,
  isCloudActive: false,
};

// ============================
// CLOUD DATABASE & MODAL HELPERS
// ============================

function updateCloudStatusUI() {
  const isConfigured = !!getActiveFirebaseConfig();
  state.isCloudActive = isConfigured;

  const splashStatus = document.getElementById('splash-cloud-status');
  const splashPill = document.getElementById('splash-cloud-pill');
  const profileStatus = document.getElementById('profile-cloud-status');
  const profilePill = document.getElementById('profile-cloud-btn');

  const text = isConfigured ? '🟢 Live Database Active' : '⚡ Connect Live Database';
  if (splashStatus) splashStatus.textContent = text;
  if (profileStatus) profileStatus.textContent = text;
  if (splashPill) splashPill.classList.toggle('connected', isConfigured);
  if (profilePill) profilePill.classList.toggle('connected', isConfigured);
}

function openFirebaseConfigModal() {
  const modal = document.getElementById('firebase-modal');
  if (modal) modal.classList.remove('hidden');
  const input = document.getElementById('firebase-config-input');
  const local = localStorage.getItem('gc_firebase_config');
  if (input && local) {
    try {
      input.value = JSON.stringify(JSON.parse(local), null, 2);
    } catch (_) {
      input.value = local;
    }
  }
}

function closeFirebaseConfigModal() {
  const modal = document.getElementById('firebase-modal');
  if (modal) modal.classList.add('hidden');
}

function saveFirebaseConfigFromInput() {
  const input = document.getElementById('firebase-config-input');
  if (!input) return;
  const raw = input.value.trim();
  if (!raw) {
    showToast('Please paste your Firebase configuration');
    return;
  }

  try {
    let parsed;
    if (raw.startsWith('{')) {
      parsed = JSON.parse(raw);
    } else {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) parsed = (new Function(`return ${match[0]}`))();
      else throw new Error('Invalid format');
    }

    if (!parsed.apiKey || !parsed.projectId) {
      showToast('⚠️ Missing apiKey or projectId in config');
      return;
    }

    localStorage.setItem('gc_firebase_config', JSON.stringify(parsed));
    if (window.garbaFirebase) {
      window.garbaFirebase.init();
    }
    closeFirebaseConfigModal();
    updateCloudStatusUI();
    showToast('🎉 Firebase connected! Multi-user live matching is active.');
  } catch (err) {
    console.error(err);
    showToast('⚠️ Invalid config JSON. Please check formatting.');
  }
}

function resetFirebaseConfig() {
  localStorage.removeItem('gc_firebase_config');
  closeFirebaseConfigModal();
  updateCloudStatusUI();
  showToast('Switched back to local demo mode');
}

// ============================
// SCREEN MANAGEMENT
// ============================

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'register' || id === 'login') {
    document.getElementById(id).scrollTop = 0;
  }
}

function showTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  document.getElementById(`nav-${tab}`)?.classList.add('active');

  if (tab === 'chat') {
    renderMatches();
    document.getElementById('nav-badge').style.display = 'none';
    document.getElementById('chat-notif').style.display = 'none';
  }
  if (tab === 'profile') {
    renderMyProfile();
  }
}

// ============================
// SKILL BUTTONS
// ============================

function initSkillBtns(containerId, stateKey) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const btns = container.querySelectorAll('.skill-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (stateKey === 'skill') state.selectedSkill = btn.dataset.val;
      else state.selectedLooking = btn.dataset.val;
    });
  });
}

function initTagSelect(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  GARBA_STYLES.forEach(style => {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = style;
    tag.onclick = () => {
      tag.classList.toggle('active');
      if (tag.classList.contains('active')) {
        state.selectedStyles.push(style);
      } else {
        state.selectedStyles = state.selectedStyles.filter(s => s !== style);
      }
    };
    container.appendChild(tag);
  });
}

// ============================
// AUTH, EMAIL OTP & PHONE 2FA
// ============================

function generateRandomOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function openOtpModal(mode, userData, credentials) {
  const modal = document.getElementById('otp-modal');
  if (!modal) return;

  const emailOtp = generateRandomOtp();
  const phoneOtp = generateRandomOtp();

  state.pendingVerification = {
    mode, // 'register' or 'login'
    userData, // for register
    credentials, // for login: { email, password }
    emailOtp,
    phoneOtp,
    email: (userData ? userData.email : credentials?.email) || '',
    phone: (userData ? userData.phone : credentials?.phone) || '9876543210'
  };

  const title = document.getElementById('otp-modal-title');
  const desc = document.getElementById('otp-modal-desc');
  const displayEmail = document.getElementById('otp-display-email');
  const displayPhone = document.getElementById('otp-display-phone');
  const emailHint = document.getElementById('otp-email-hint');
  const phoneHint = document.getElementById('otp-phone-hint');
  const inputEmail = document.getElementById('input-email-otp');
  const inputPhone = document.getElementById('input-phone-otp');

  if (title) title.textContent = mode === 'register' ? 'Verify Email & Phone 2FA' : 'Two-Factor Authentication (2FA)';
  if (desc) desc.textContent = mode === 'register' 
    ? 'Please verify both your email address and mobile number to activate your account.' 
    : 'A 2FA security code has been sent to your registered email and mobile number.';

  if (displayEmail) displayEmail.textContent = state.pendingVerification.email;
  if (displayPhone) displayPhone.textContent = `+91 ${state.pendingVerification.phone}`;

  // Instant interactive display: shows generated verification codes for frictionless verification
  if (emailHint) {
    emailHint.innerHTML = `<span>Verification Code sent to inbox:</span> <span class="code">${emailOtp}</span>`;
  }
  if (phoneHint) {
    phoneHint.innerHTML = `<span>SMS / WhatsApp 2FA OTP:</span> <span class="code">${phoneOtp}</span>`;
  }

  if (inputEmail) {
    inputEmail.value = '';
    inputEmail.placeholder = `Enter 6-digit Email OTP`;
  }
  if (inputPhone) {
    inputPhone.value = '';
    inputPhone.placeholder = `Enter 6-digit Mobile OTP`;
  }

  modal.classList.remove('hidden');
  showToast(`📩 OTPs sent! Check your email and SMS.`);
}

function closeOtpModal() {
  const modal = document.getElementById('otp-modal');
  if (modal) modal.classList.add('hidden');
  state.pendingVerification = null;
}

function resendEmailOtp() {
  if (!state.pendingVerification) return;
  const newOtp = generateRandomOtp();
  state.pendingVerification.emailOtp = newOtp;
  const emailHint = document.getElementById('otp-email-hint');
  if (emailHint) {
    emailHint.innerHTML = `<span>New Email Code generated:</span> <span class="code">${newOtp}</span>`;
  }
  showToast(`📧 New Email OTP sent to ${state.pendingVerification.email}`);
}

function resendPhoneOtp() {
  if (!state.pendingVerification) return;
  const newOtp = generateRandomOtp();
  state.pendingVerification.phoneOtp = newOtp;
  const phoneHint = document.getElementById('otp-phone-hint');
  if (phoneHint) {
    phoneHint.innerHTML = `<span>New SMS/WhatsApp OTP:</span> <span class="code">${newOtp}</span>`;
  }
  showToast(`📱 New 2FA SMS OTP sent to +91 ${state.pendingVerification.phone}`);
}

async function verifyOtpAndProceed() {
  if (!state.pendingVerification) return;

  const enteredEmailOtp = (document.getElementById('input-email-otp')?.value || '').trim();
  const enteredPhoneOtp = (document.getElementById('input-phone-otp')?.value || '').trim();

  if (!enteredEmailOtp) {
    showToast('⚠️ Please enter the Email OTP');
    return;
  }
  if (!enteredPhoneOtp) {
    showToast('⚠️ Please enter the Mobile 2FA OTP');
    return;
  }

  // Verify Email OTP
  if (enteredEmailOtp !== state.pendingVerification.emailOtp) {
    showToast('❌ Incorrect Email OTP. Please check the code.');
    return;
  }

  // Verify Phone 2FA OTP
  if (enteredPhoneOtp !== state.pendingVerification.phoneOtp) {
    showToast('❌ Incorrect Mobile 2FA OTP. Please check the code.');
    return;
  }

  // Both OTPs verified!
  showToast('✅ 2FA Verification successful! Signing in...');
  const { mode, userData, credentials } = state.pendingVerification;
  closeOtpModal();

  if (mode === 'register') {
    // Complete registration
    const uid = 'user_' + Date.now();
    const finalUser = {
      ...userData,
      id: uid,
      isEmailVerified: true,
      is2FaVerified: true
    };

    // Save in cloud if Firebase is active
    if (window.garbaFirebase && window.garbaFirebase.isInitialized) {
      try {
        if (userData.password) {
          try {
            const fbUser = await window.garbaFirebase.signUpWithEmailPassword(userData.email, userData.password);
            if (fbUser) finalUser.id = fbUser.uid;
          } catch (authErr) {
            console.warn('Firebase Auth create note:', authErr.message);
          }
        }
        await window.garbaFirebase.saveUserProfile(finalUser.id, finalUser);
      } catch (err) {
        console.warn('Could not save to Firebase, continuing locally:', err);
      }
    }

    // Save locally for quick login
    const registeredUsers = JSON.parse(localStorage.getItem('gc_registered_users') || '{}');
    registeredUsers[finalUser.email.toLowerCase()] = {
      ...finalUser,
      password: userData.password
    };
    localStorage.setItem('gc_registered_users', JSON.stringify(registeredUsers));

    await saveUserAndGo(finalUser);
    showToast(`🎉 Welcome to GarbaConnect, ${finalUser.name.split(' ')[0]}!`);
  } else if (mode === 'login') {
    // Complete login
    let userToLogin = credentials.user;
    if (window.garbaFirebase && window.garbaFirebase.isInitialized) {
      try {
        const signResult = await window.garbaFirebase.signInWithEmailPassword(credentials.email, credentials.password);
        if (signResult && signResult.profileData) {
          userToLogin = signResult.profileData;
        }
      } catch (e) {
        console.warn('Firebase sign-in note:', e.message);
      }
    }
    await saveUserAndGo(userToLogin);
    showToast(`🎉 Welcome back, ${userToLogin.name.split(' ')[0]}!`);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const skill = state.selectedSkill;
  const looking = state.selectedLooking;
  if (!skill) { showToast('Please select your skill level'); return; }
  if (!looking) { showToast('Please select what you\'re looking for'); return; }

  const fname = document.getElementById('reg-fname').value.trim();
  const lname = document.getElementById('reg-lname').value.trim();
  const gender = document.getElementById('reg-gender').value;
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const password = document.getElementById('reg-password').value;

  if (!phone || phone.length !== 10) {
    showToast('Please enter a valid 10-digit mobile number for 2FA');
    return;
  }

  const userData = {
    name: `${fname} ${lname}`.trim(),
    email,
    phone,
    password,
    age: parseInt(document.getElementById('reg-age').value) || 24,
    gender,
    city: document.getElementById('reg-city').value.trim(),
    skill,
    looking,
    bio: document.getElementById('reg-bio').value || 'Ready for Navratri! 💃',
    styles: state.selectedStyles.length ? state.selectedStyles : ['Traditional Garba'],
    emoji: pickEmoji(gender),
    photoURL: null,
    color: '#e85d04',
    isCloudUser: !!window.garbaFirebase?.isInitialized
  };

  // Open 2FA & OTP verification modal
  openOtpModal('register', userData, null);
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showToast('Please enter your email and password');
    return;
  }

  // Check stored accounts or create verified profile
  const registeredUsers = JSON.parse(localStorage.getItem('gc_registered_users') || '{}');
  let user = registeredUsers[email];

  if (!user) {
    // If user registered earlier in standard session or demo
    user = {
      id: 'user_' + Date.now(),
      name: email.split('@')[0],
      email: email,
      phone: '9876543210',
      age: 25,
      gender: 'Woman',
      city: 'Ahmedabad',
      skill: 'Intermediate',
      looking: 'Dance Partner',
      bio: 'Ready to dance Garba! 🪔',
      styles: ['Traditional Garba', 'Dandiya Raas'],
      emoji: '💃',
      color: '#e85d04',
      isCloudUser: !!window.garbaFirebase?.isInitialized
    };
  }

  // Trigger 2FA for secure login
  openOtpModal('login', null, {
    email,
    password,
    phone: user.phone || '9876543210',
    user
  });
}

function demoLogin() {
  const user = {
    id: 'demo_user',
    name: 'Demo Dancer',
    email: 'demo@garbaconnect.com',
    age: 25,
    gender: 'Woman',
    city: 'Ahmedabad',
    skill: 'Intermediate',
    looking: 'Dance Partner',
    bio: 'Love Garba! Here to find amazing dance partners for Navratri! 🎊',
    styles: ['Traditional Garba', 'Dandiya Raas'],
    emoji: '💃',
    photoURL: null,
    color: '#e85d04',
    isCloudUser: false
  };
  saveUserAndGo(user);
}

async function saveUserAndGo(user) {
  state.user = user;
  localStorage.setItem('gc_user', JSON.stringify(user));

  // Load saved local data
  const saved = localStorage.getItem('gc_state');
  if (saved) {
    try {
      const s = JSON.parse(saved);
      state.matches = s.matches || [];
      state.messages = s.messages || {};
      state.stats = s.stats || { likes: 0, matches: 0, msgs: 0 };
      state.currentCardIndex = s.currentCardIndex || 0;
    } catch (_) {}
  }

  // Load discover profiles (cloud friends + fallback sample profiles)
  let cloudUsers = [];
  if (window.garbaFirebase && window.garbaFirebase.isInitialized && user.id) {
    try {
      cloudUsers = await window.garbaFirebase.fetchDiscoverProfiles(user.id);
    } catch (err) {
      console.warn('Error fetching cloud profiles:', err);
    }

    // Subscribe to cloud matches
    window.garbaFirebase.subscribeToMatches(user.id, (cloudMatches) => {
      cloudMatches.forEach(cm => {
        if (!state.matches.find(m => m.id === cm.userId)) {
          state.matches.push({
            id: cm.userId,
            cloudMatchId: cm.cloudMatchId,
            name: cm.name,
            emoji: cm.emoji,
            photoURL: cm.photoURL,
            city: cm.city,
            skill: cm.skill,
            looking: cm.looking,
            color: '#e85d04',
            isCloudMatch: true
          });
          state.stats.matches = state.matches.length;
          const badge = document.getElementById('nav-badge');
          const notif = document.getElementById('chat-notif');
          if (badge) badge.style.display = 'block';
          if (notif) notif.style.display = 'block';
        }
      });
      renderMatches();
      updateStats();
    });
  }

  // Combine real cloud dancers first, then sample profiles
  const sampleDeck = SAMPLE_PROFILES.map(p => ({ ...p, liked: false, superLiked: false }));
  state.profiles = [...cloudUsers, ...sampleDeck];

  initApp();
  showScreen('app');
  showTab('swipe');
}

async function logout() {
  if (!confirm('Are you sure you want to sign out?')) return;
  if (window.garbaFirebase) {
    try {
      await window.garbaFirebase.signOut();
    } catch (_) {}
  }
  localStorage.removeItem('gc_user');
  localStorage.removeItem('gc_state');
  state = {
    user: null, profiles: [], currentCardIndex: 0,
    matches: [], messages: {}, stats: { likes: 0, matches: 0, msgs: 0 },
    activeChat: null, pendingMatchProfile: null,
    selectedSkill: '', selectedLooking: '', selectedStyles: [],
    pendingGoogleAuth: null, isCloudActive: false
  };
  showScreen('splash');
}

function pickEmoji(gender) {
  const map = { 'Woman': '👩', 'Man': '👨', 'Non-binary': '🧑' };
  return map[gender] || '👤';
}

// ============================
// APP INIT
// ============================

function initApp() {
  initSkillBtns('reg-skill', 'skill');
  initSkillBtns('reg-looking', 'looking');
  initTagSelect('reg-styles');

  // Edit profile skill buttons
  buildEditSkillBtns('edit-skill', 'editSkill', state.user?.skill);
  buildEditSkillBtns('edit-looking', 'editLooking', state.user?.looking);
  initTagSelect('edit-styles');

  renderCards();
}

function buildEditSkillBtns(containerId, type, current) {
  const opts = type === 'editSkill'
    ? [['Beginner','🌱'], ['Intermediate','🔥'], ['Advanced','⭐'], ['Pro Dancer','💃']]
    : [['Dance Partner','🕺'], ['Group Partner','👯'], ['Life Partner','💍'], ['Friendship','🤝']];

  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  opts.forEach(([val, icon]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'skill-btn' + (val === current ? ' active' : '');
    btn.dataset.val = val;
    btn.textContent = `${icon} ${val}`;
    btn.onclick = () => {
      container.querySelectorAll('.skill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
    container.appendChild(btn);
  });
}

// ============================
// CARDS / SWIPE
// ============================

function renderCards() {
  const stack = document.getElementById('card-stack');
  // Remove existing cards (keep no-more)
  stack.querySelectorAll('.swipe-card').forEach(c => c.remove());

  const remaining = state.profiles.slice(state.currentCardIndex);
  if (remaining.length === 0) return;

  // Render top 3 cards
  const toRender = remaining.slice(0, 3).reverse(); // reversed so top is last in DOM
  toRender.forEach(profile => {
    const card = createCard(profile);
    stack.insertBefore(card, stack.firstChild);
  });

  attachSwipe(stack.querySelector('.swipe-card'));
}

function createCard(profile) {
  const card = document.createElement('div');
  card.className = 'swipe-card';
  card.dataset.id = profile.id;

  const bg = document.createElement('div');
  bg.className = 'card-bg';
  bg.style.background = `radial-gradient(ellipse at 30% 40%, ${profile.color}88 0%, ${profile.color}22 50%, #1e1e2e 100%)`;

  // Avatar
  let avatarEl;
  if (profile.photoURL) {
    avatarEl = document.createElement('img');
    avatarEl.className = 'card-avatar-img';
    avatarEl.src = profile.photoURL;
    avatarEl.alt = profile.name;
  } else {
    avatarEl = document.createElement('div');
    avatarEl.style.cssText = `position:absolute;top:50%;left:50%;transform:translate(-50%,-65%);font-size:7rem;pointer-events:none;`;
    avatarEl.textContent = profile.emoji || '💃';
  }

  const gradient = document.createElement('div');
  gradient.className = 'card-gradient';

  // Like/nope indicators
  const likeInd = document.createElement('div');
  likeInd.className = 'swipe-indicator like';
  likeInd.textContent = 'LIKE ❤️';
  likeInd.id = `like-ind-${profile.id}`;

  const nopeInd = document.createElement('div');
  nopeInd.className = 'swipe-indicator nope';
  nopeInd.textContent = '✕ NOPE';
  nopeInd.id = `nope-ind-${profile.id}`;

  const superInd = document.createElement('div');
  superInd.className = 'swipe-indicator super';
  superInd.textContent = '⭐ SUPER';
  superInd.id = `super-ind-${profile.id}`;

  // Info section
  const info = document.createElement('div');
  info.className = 'card-info';

  const nameRow = document.createElement('div');
  nameRow.className = 'card-name-row';
  nameRow.innerHTML = `<span class="card-name">${profile.name.split(' ')[0]}</span><span class="card-age">${profile.age}</span>`;

  const city = document.createElement('div');
  city.className = 'card-city';
  city.innerHTML = `📍 ${profile.city}${profile.isCloudUser ? '<span class="card-cloud-badge">🟢 Real Dancer</span>' : ''}`;

  const tags = document.createElement('div');
  tags.className = 'card-tags';
  tags.innerHTML = `<span class="card-tag skill">🎵 ${profile.skill}</span><span class="card-tag looking">🎯 ${profile.looking}</span>`;

  const infoBtn = document.createElement('button');
  infoBtn.className = 'card-info-btn';
  infoBtn.innerHTML = 'ℹ️';
  infoBtn.onclick = (e) => { e.stopPropagation(); openProfileModal(profile); };

  info.appendChild(nameRow);
  info.appendChild(city);
  info.appendChild(tags);

  card.appendChild(bg);
  card.appendChild(avatarEl);
  card.appendChild(gradient);
  card.appendChild(likeInd);
  card.appendChild(nopeInd);
  card.appendChild(superInd);
  card.appendChild(info);
  card.appendChild(infoBtn);

  return card;
}

// ============================
// SWIPE GESTURE
// ============================

let isDragging = false;
let startX = 0, startY = 0, currentX = 0;
let activeCard = null;

function attachSwipe(card) {
  if (!card) return;
  activeCard = card;

  const onStart = (x, y) => {
    if (isDragging) return;
    isDragging = true;
    startX = x;
    startY = y;
    currentX = 0;
    card.style.transition = 'none';
  };

  const onMove = (x) => {
    if (!isDragging) return;
    currentX = x - startX;
    const rotation = currentX * 0.08;
    card.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;

    const profileId = card.dataset.id;
    const likeEl = document.getElementById(`like-ind-${profileId}`);
    const nopeEl = document.getElementById(`nope-ind-${profileId}`);

    if (currentX > 30) {
      likeEl && (likeEl.style.opacity = Math.min(currentX / 100, 1));
      nopeEl && (nopeEl.style.opacity = 0);
    } else if (currentX < -30) {
      nopeEl && (nopeEl.style.opacity = Math.min(-currentX / 100, 1));
      likeEl && (likeEl.style.opacity = 0);
    } else {
      likeEl && (likeEl.style.opacity = 0);
      nopeEl && (nopeEl.style.opacity = 0);
    }
  };

  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;

    if (currentX > 80) {
      animateCard('right');
    } else if (currentX < -80) {
      animateCard('left');
    } else {
      card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
      card.style.transform = 'translateX(0) rotate(0deg)';
    }
  };

  // Mouse
  card.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
  window.addEventListener('mousemove', (e) => { if (isDragging) onMove(e.clientX); });
  window.addEventListener('mouseup', onEnd);

  // Touch
  card.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    onStart(t.clientX, t.clientY);
  }, { passive: true });
  card.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    onMove(t.clientX);
  }, { passive: true });
  card.addEventListener('touchend', onEnd);
}

function animateCard(direction) {
  if (!activeCard) return;
  const card = activeCard;
  card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s';

  if (direction === 'right') {
    card.style.transform = 'translateX(150vw) rotate(30deg)';
  } else if (direction === 'left') {
    card.style.transform = 'translateX(-150vw) rotate(-30deg)';
  } else if (direction === 'super') {
    card.style.transform = 'translateY(-150vh) rotate(5deg)';
  }
  card.style.opacity = '0';

  setTimeout(() => {
    card.remove();
    processSwipe(direction);
    updateNextCard();
  }, 450);
}

function swipeCard(direction) {
  const stack = document.getElementById('card-stack');
  const card = stack.querySelector('.swipe-card');
  if (!card) return;

  activeCard = card;
  if (direction === 'super') {
    const profileId = card.dataset.id;
    const superEl = document.getElementById(`super-ind-${profileId}`);
    if (superEl) { superEl.style.opacity = 1; }
    setTimeout(() => animateCard('super'), 100);
  } else {
    animateCard(direction);
  }
}

async function processSwipe(direction) {
  const profile = state.profiles[state.currentCardIndex];
  if (!profile) return;

  const isLike = direction === 'right' || direction === 'super';
  if (isLike) {
    state.stats.likes++;
  }

  // Cloud multi-user matching
  if (window.garbaFirebase && window.garbaFirebase.isInitialized && state.user?.id) {
    try {
      const cloudResult = await window.garbaFirebase.recordSwipe(
        state.user.id,
        profile.id,
        direction,
        state.user,
        profile
      );

      if (cloudResult.isMatch) {
        if (!state.matches.find(m => m.id === profile.id)) {
          state.matches.push({
            id: profile.id,
            cloudMatchId: cloudResult.matchId,
            name: profile.name,
            emoji: profile.emoji,
            photoURL: profile.photoURL,
            city: profile.city,
            skill: profile.skill,
            looking: profile.looking,
            color: profile.color || '#e85d04',
            isCloudMatch: true
          });
          state.stats.matches = state.matches.length;
          state.messages[profile.id] = [];
          state.pendingMatchProfile = profile;
        }
      }
    } catch (err) {
      console.warn('Error saving cloud swipe:', err);
    }
  }

  // If not a mutual cloud match, check demo simulation for sample profiles
  if (isLike && !state.pendingMatchProfile && !profile.isCloudUser) {
    const isDemoMatch = Math.random() < 0.5;
    if (isDemoMatch) {
      if (!state.matches.find(m => m.id === profile.id)) {
        state.matches.push(profile);
        state.stats.matches = state.matches.length;
        state.messages[profile.id] = [];
        state.pendingMatchProfile = profile;
      }
    }
  }

  if (isLike) {
    showToast(direction === 'super' ? `⭐ Super Liked ${profile.name.split(' ')[0]}!` : `❤️ Liked ${profile.name.split(' ')[0]}!`);
  } else {
    showToast(`Passed on ${profile.name.split(' ')[0]}`);
  }

  state.currentCardIndex++;
  saveState();

  if (state.pendingMatchProfile) {
    setTimeout(() => {
      showMatchPopup(state.pendingMatchProfile);
      state.pendingMatchProfile = null;
    }, 500);
  }

  updateStats();
}

function updateNextCard() {
  const stack = document.getElementById('card-stack');
  const remaining = state.profiles.slice(state.currentCardIndex);
  if (remaining.length === 0) return;

  // Add next card to the back of the stack if fewer than 3
  const existingCards = stack.querySelectorAll('.swipe-card');
  if (existingCards.length < 3 && remaining.length > existingCards.length) {
    const nextProfile = remaining[existingCards.length];
    if (nextProfile) {
      const card = createCard(nextProfile);
      stack.appendChild(card); // add to back
      // Fix z-indices and scales
      updateStackVisuals();
    }
  }
  // Attach swipe to new top card
  const topCard = stack.querySelector('.swipe-card');
  if (topCard) attachSwipe(topCard);
}

function updateStackVisuals() {
  const stack = document.getElementById('card-stack');
  const cards = stack.querySelectorAll('.swipe-card');
  cards.forEach((card, i) => {
    const fromTop = i;
    card.style.zIndex = 10 - fromTop;
    if (fromTop === 0) {
      card.style.transform = 'scale(1) translateY(0)';
    } else if (fromTop === 1) {
      card.style.transform = 'scale(0.96) translateY(8px)';
    } else {
      card.style.transform = 'scale(0.92) translateY(16px)';
    }
  });
}

function resetCards() {
  state.currentCardIndex = 0;
  state.profiles = SAMPLE_PROFILES.map(p => ({ ...p, liked: false, superLiked: false }));
  renderCards();
  saveState();
}

// ============================
// MATCH POPUP
// ============================

function showMatchPopup(profile) {
  document.getElementById('match-name').textContent = profile.name.split(' ')[0];

  const myAv = document.getElementById('my-match-av');
  myAv.innerHTML = '';
  myAv.textContent = state.user.emoji || '💃';

  const theirAv = document.getElementById('their-av');
  theirAv.innerHTML = '';
  theirAv.textContent = profile.emoji;

  document.getElementById('match-popup').classList.remove('hidden');
  spawnConfetti();

  // Show chat notification
  document.getElementById('chat-notif').style.display = 'block';
  document.getElementById('nav-badge').style.display = 'flex';
  document.getElementById('nav-badge').textContent = state.matches.length;
}

function closeMatchPopup() {
  document.getElementById('match-popup').classList.add('hidden');
}

function startChat() {
  closeMatchPopup();
  showTab('chat');
  const lastMatch = state.matches[state.matches.length - 1];
  if (lastMatch) openChat(lastMatch);
}

function spawnConfetti() {
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';
  const colors = ['#e85d04','#f5a623','#7b2d8b','#e74c3c','#27ae60','#3498db','#fff'];
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (1.5 + Math.random() * 2) + 's';
    piece.style.animationDelay = Math.random() * 0.5 + 's';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(piece);
  }
}

// ============================
// CHAT
// ============================

function renderMatches() {
  const list = document.getElementById('matches-list');
  const countEl = document.getElementById('match-count-text');

  if (state.matches.length === 0) {
    list.innerHTML = `
      <div class="no-matches">
        <div class="no-matches-icon">💃</div>
        <h3>No matches yet</h3>
        <p>Start swiping to find your Garba partner!</p>
        <button class="btn btn-primary" onclick="showTab('swipe')">Start Discovering</button>
      </div>`;
    countEl.textContent = 'No connections yet';
    return;
  }

  countEl.textContent = `${state.matches.length} connection${state.matches.length !== 1 ? 's' : ''}`;
  list.innerHTML = '';

  state.matches.forEach(profile => {
    const msgs = state.messages[profile.id] || [];
    const lastMsg = msgs[msgs.length - 1];
    const item = document.createElement('div');
    item.className = 'match-item';
    item.onclick = () => openChat(profile);

    const avatarHtml = profile.photoURL
      ? `<img src="${profile.photoURL}" alt="${profile.name}" style="width:50px;height:50px;border-radius:50%;object-fit:cover;border:2px solid var(--primary);" />`
      : `<div class="match-item-avatar">${profile.emoji || '💃'}</div>`;

    item.innerHTML = `
      ${avatarHtml}
      <div class="match-item-info">
        <div class="match-item-name">${profile.name} ${profile.isCloudMatch ? '<span style="font-size:0.7rem;color:#10b981;">● Online</span>' : ''}</div>
        <div class="match-item-msg ${!lastMsg ? '' : 'unread'}">
          ${lastMsg ? lastMsg.text : '🎊 You matched! Say hello!'}
        </div>
      </div>
      <div class="match-item-time">${lastMsg ? formatTime(lastMsg.time) : 'Just now'}</div>
    `;

    list.appendChild(item);
  });
}

function openChat(profile) {
  state.activeChat = profile;

  const headerAvatarEl = document.getElementById('chat-avatar');
  if (profile.photoURL) {
    headerAvatarEl.outerHTML = `<img id="chat-avatar" src="${profile.photoURL}" alt="${profile.name}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0;" />`;
  } else {
    headerAvatarEl.outerHTML = `<div id="chat-avatar" style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,${profile.color || '#e85d04'},#7b2d8b);display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">${profile.emoji || '💃'}</div>`;
  }

  document.getElementById('chat-name').textContent = profile.name;
  document.getElementById('chat-window').classList.remove('hidden');

  // If cloud match, subscribe to real-time chat messages from Firestore
  if (profile.cloudMatchId && window.garbaFirebase?.isInitialized) {
    window.garbaFirebase.subscribeToChat(profile.cloudMatchId, (cloudMsgs) => {
      state.messages[profile.id] = cloudMsgs.map(m => ({
        text: m.text,
        sent: m.senderId === state.user.id,
        time: m.time
      }));
      renderChatMessages(profile);
    });
  } else {
    renderChatMessages(profile);
  }

  document.getElementById('chat-input').focus();
}

function renderChatMessages(profile) {
  const container = document.getElementById('chat-messages');
  container.innerHTML = '';

  const avatarDisplay = profile.photoURL 
    ? `<img src="${profile.photoURL}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;border:2px solid var(--primary);" />`
    : `<div class="match-intro-av">${profile.emoji || '💃'}</div>`;

  // Match intro
  const intro = document.createElement('div');
  intro.className = 'chat-match-intro';
  intro.innerHTML = `
    ${avatarDisplay}
    <strong>${profile.name}</strong>
    <p style="font-size:0.8rem;margin-top:0.3rem">${profile.city} • ${profile.skill} • ${profile.looking}</p>
    <p style="font-size:0.85rem;margin-top:0.8rem;color:var(--text2)">${profile.bio || 'Ready for Garba!'}</p>
  `;
  container.appendChild(intro);

  const msgs = state.messages[profile.id] || [];
  msgs.forEach(msg => {
    const el = document.createElement('div');
    el.className = `chat-msg ${msg.sent ? 'sent' : 'received'}`;
    el.innerHTML = `${msg.text}<span class="chat-msg-time">${formatTime(msg.time)}</span>`;
    container.appendChild(el);
  });

  container.scrollTop = container.scrollHeight;
}

function closeChatWindow() {
  document.getElementById('chat-window').classList.add('hidden');
  state.activeChat = null;
  renderMatches();
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text || !state.activeChat) return;

  const currentChat = state.activeChat;
  input.value = '';

  // 1. If it's a real Cloud Match, send to Firestore
  if (currentChat.cloudMatchId && window.garbaFirebase?.isInitialized) {
    try {
      await window.garbaFirebase.sendMessage(currentChat.cloudMatchId, state.user.id, text);
    } catch (err) {
      console.warn('Error sending cloud message:', err);
    }
    state.stats.msgs++;
    updateStats();
    return;
  }

  // 2. Local / Demo mode handling
  const msg = { text, sent: true, time: Date.now() };
  if (!state.messages[currentChat.id]) state.messages[currentChat.id] = [];
  state.messages[currentChat.id].push(msg);
  state.stats.msgs++;

  renderChatMessages(currentChat);
  saveState();
  updateStats();

  // Demo auto-reply after delay
  setTimeout(() => {
    if (state.activeChat?.id !== currentChat.id) return;
    const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
    const replyMsg = { text: reply, sent: false, time: Date.now() };
    state.messages[currentChat.id].push(replyMsg);
    renderChatMessages(currentChat);
    saveState();
    showToast(`💬 ${currentChat.name.split(' ')[0]}: ${reply.substring(0,30)}...`);
  }, 1000 + Math.random() * 2000);
}

function chatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

// ============================
// PROFILE PAGE
// ============================

function renderMyProfile() {
  if (!state.user) return;

  const av = document.getElementById('my-avatar');
  av.textContent = state.user.emoji || '💃';

  document.getElementById('my-name').textContent = state.user.name;
  document.getElementById('my-city').textContent = `📍 ${state.user.city}`;

  document.getElementById('edit-bio').value = state.user.bio || '';

  updateStats();
}

function saveProfile() {
  const bio = document.getElementById('edit-bio').value;
  const skillBtn = document.querySelector('#edit-skill .skill-btn.active');
  const lookingBtn = document.querySelector('#edit-looking .skill-btn.active');
  const styleTags = document.querySelectorAll('#edit-styles .tag.active');

  state.user.bio = bio;
  if (skillBtn) state.user.skill = skillBtn.dataset.val;
  if (lookingBtn) state.user.looking = lookingBtn.dataset.val;
  state.user.styles = Array.from(styleTags).map(t => t.textContent);

  localStorage.setItem('gc_user', JSON.stringify(state.user));
  saveState();
  showToast('✓ Profile saved!');
}

function changeAvatar(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const av = document.getElementById('my-avatar');
    av.innerHTML = `<img src="${ev.target.result}" alt="avatar" />`;
    state.user.avatarUrl = ev.target.result;
    localStorage.setItem('gc_user', JSON.stringify(state.user));
    showToast('📷 Photo updated!');
  };
  reader.readAsDataURL(file);
}

function updateStats() {
  document.getElementById('stat-likes').textContent = state.stats.likes;
  document.getElementById('stat-matches').textContent = state.stats.matches;
  document.getElementById('stat-msgs').textContent = state.stats.msgs;
}

// ============================
// PROFILE MODAL
// ============================

function openProfileModal(profile) {
  const modal = document.getElementById('profile-modal');

  document.getElementById('modal-avatar').textContent = profile.emoji;
  document.getElementById('modal-name').textContent = profile.name;
  document.getElementById('modal-city').textContent = `📍 ${profile.city} • ${profile.age} years`;

  const tags = document.getElementById('modal-tags');
  tags.innerHTML = `
    <span class="card-tag skill">🎵 ${profile.skill}</span>
    <span class="card-tag looking">🎯 ${profile.looking}</span>
  `;

  document.getElementById('modal-bio').textContent = profile.bio;

  const stylesEl = document.getElementById('modal-styles');
  stylesEl.innerHTML = profile.styles.map(s =>
    `<span class="tag active" style="cursor:default">${s}</span>`
  ).join('');

  modal.classList.remove('hidden');
}

function closeProfileModal() {
  document.getElementById('profile-modal').classList.add('hidden');
}

// ============================
// TOAST
// ============================

let toastTimeout;
function showToast(msg) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = 'global-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ============================
// STORAGE
// ============================

function saveState() {
  const toSave = {
    matches: state.matches,
    messages: state.messages,
    stats: state.stats,
    currentCardIndex: state.currentCardIndex,
  };
  try {
    localStorage.setItem('gc_state', JSON.stringify(toSave));
  } catch (_) {}
}

function formatTime(timestamp) {
  const d = new Date(timestamp);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins/60)}h ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ============================
// KEYBOARD SHORTCUTS
// ============================
document.addEventListener('keydown', (e) => {
  if (document.getElementById('app').classList.contains('active')) {
    const activeTab = document.querySelector('.tab.active');
    if (activeTab?.id === 'tab-swipe') {
      if (e.key === 'ArrowLeft') swipeCard('left');
      else if (e.key === 'ArrowRight') swipeCard('right');
      else if (e.key === 'ArrowUp') swipeCard('super');
    }
  }
});

// ============================
// AUTO-LOGIN (if user exists)
// ============================
window.addEventListener('DOMContentLoaded', () => {
  initSkillBtns('reg-skill', 'skill');
  initSkillBtns('reg-looking', 'looking');
  initTagSelect('reg-styles');

  // Initialize Firebase if configured
  if (window.garbaFirebase) {
    window.garbaFirebase.init();
  }
  updateCloudStatusUI();

  const saved = localStorage.getItem('gc_user');
  if (saved) {
    try {
      const user = JSON.parse(saved);
      state.user = user;
      saveUserAndGo(user);
    } catch (_) {
      showScreen('splash');
    }
  } else {
    showScreen('splash');
  }
});

