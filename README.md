# GarbaConnect 🪔

> Find Your Garba Partner – A Tinder-style app for Navratri dance partners!

🌐 **Live Website**: [https://mrharshalbane.github.io/garba-partner/](https://mrharshalbane.github.io/garba-partner/)

---

## ✨ Features

- 🔥 **Swipe to match** – Left/right swipe, button clicks, or keyboard arrows
- ⭐ **Super Like** – Show extra interest
- 🌐 **Multi-User Cloud Mode** – Connect free Firebase for real user matching with friends!
- 🔐 **Secure Email & Password** – Simplified registration without third-party OAuth popup friction
- 🛡️ **2FA & OTP Verification** – Mandatory Email OTP verification + SMS/WhatsApp Mobile 2FA confirmation
- 💬 **Live Real-time Chat** – Chat with matches instantly via Cloud Firestore
- 👤 **Custom Profiles** – City, age, skill level, looking-for, and favorite Garba styles
- 🎊 **Match Celebration** – Animated confetti when two dancers like each other
- 📱 **Mobile-First Glassmorphism** – Gorgeous dark theme with festive accents
- ⚡ **Offline / Demo Mode** – Graceful fallback with simulated profiles when offline

---

## 🔥 Connecting the Live Database & 2FA Auth

To enable multi-user matching and live chat with friends:

1. Go to [Firebase Console](https://console.firebase.google.com) and create or open your project.
2. In the sidebar: **Build** → **Authentication** → **Sign-in method** → Enable **Email/Password**.
3. In the sidebar: **Build** → **Firestore Database** → **Rules**:
   - Copy the rules from [`firestore.rules`](file:///C:/Users/harsh/.gemini/antigravity-ide/scratch/garba-partner/firestore.rules) and publish them. This ensures attackers cannot access, tamper with, or escalate privileges on your user data, chats, or matches.
4. In **Project Settings** (⚙️) → **General** → Under *Your apps*, copy the `firebaseConfig` object.
5. Either:
   - Paste the config directly inside the app by clicking the **Database Settings** button on the splash/profile page, OR
   - Edit [`firebase-config.js`](file:///C:/Users/harsh/.gemini/antigravity-ide/scratch/garba-partner/firebase-config.js) and paste the values.

---

## 🚀 Deploy

### GitHub Pages (Active)
1. Push all files to the `main` branch.
2. In repo **Settings** → **Pages** → Source: Deploy from branch (`main`, root `/`).
3. Live URL: `https://mrharshalbane.github.io/garba-partner/`

### Vercel / Netlify
Static site configuration files (`vercel.json` and `_redirects`) are included for one-click deployment.

---

## 📁 File Structure

```
garba-partner/
├── index.html           # Main application structure & screens
├── style.css            # Styles, dark theme, animations & responsive layout
├── app.js               # Application state, UI transitions, swiping & chat logic
├── firebase-config.js   # Firebase configuration template & loader
├── firebase-service.js  # Google Auth & Firestore real-time sync service
├── favicon.svg          # Diya icon
├── vercel.json          # Vercel deployment configuration
├── _redirects           # Netlify SPA redirect rules
└── README.md            # Documentation
```

---

## 🛠 Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend / DB**: Google Firebase (Authentication & Cloud Firestore)
- **Design**: Poppins typography, CSS glassmorphism, responsive touch gestures

---
Made with ❤️ for Navratri 🪔

