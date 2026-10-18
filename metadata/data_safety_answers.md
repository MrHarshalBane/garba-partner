# Google Play Console Data Safety Questionnaire Answers

Use this guide when filling out the mandatory **Data Safety** section in Google Play Console for **GarbaConnect** (`com.harshalbane.garbaconnect`).

---

## 1. Data Collection & Sharing Overview
- **Does your app collect or share any of the required user data types?**  
  👉 **Yes**
- **Is all of the user data collected by your app encrypted in transit?**  
  👉 **Yes** (All requests use HTTPS / TLS 1.3 encryption)
- **Do you provide a way for users to request that their data is deleted?**  
  👉 **Yes**
- **Delete URL / In-app mechanism:**  
  👉 Direct self-serve deletion mechanism in app under *Profile -> Delete Account & Data* and via web policy at: `https://mrharshalbane.github.io/garba-partner/assets/privacy-policy.html`

---

## 2. Specific Data Types Collected

### Category: Personal Info
1. **Name:**
   - **Collected?** Yes
   - **Shared?** No
   - **Processed ephemerally?** No
   - **Is this data required or optional?** Required (for profile creation and identification to dance partners)
   - **Purposes:** App functionality, Account management
2. **Email Address:**
   - **Collected?** Yes
   - **Shared?** No
   - **Processed ephemerally?** No
   - **Is this data required or optional?** Required (for Firebase Authentication & 2FA security)
   - **Purposes:** App functionality, Account management, Fraud prevention & security
3. **User IDs (Firebase Auth UID):**
   - **Collected?** Yes
   - **Shared?** No
   - **Purposes:** App functionality, Account management

### Category: Photos and Videos
1. **Photos (Profile pictures):**
   - **Collected?** Yes (optional profile picture upload)
   - **Shared?** No
   - **Purposes:** App functionality (Displaying avatar/photo to potential dance matches)
   - **Is this data required or optional?** Optional (defaults to festive avatar emojis)

### Category: Messages
1. **In-app messages:**
   - **Collected?** Yes
   - **Shared?** No
   - **Purposes:** App functionality (Allowing matched users to communicate and coordinate dance events)
   - **Is this data required or optional?** Required for chat feature

### Category: App Activity
1. **App interactions (Swipes/Likes):**
   - **Collected?** Yes
   - **Shared?** No
   - **Purposes:** App functionality, Analytics / matching algorithm

### Category: App info and performance
1. **Crash logs & Diagnostics:**
   - **Collected?** Yes
   - **Shared?** No
   - **Purposes:** Analytics, Developer diagnostics (Firebase/Play Console)

---

## 3. Data Transfer & Sharing
- **Do you share user data with third parties?**  
  👉 **No** (Firebase is a service provider / data processor acting on our behalf; data is not sold or shared with third-party advertising networks).

---

## 4. Privacy Policy URL
Submit the hosted URL:
👉 `https://mrharshalbane.github.io/garba-partner/assets/privacy-policy.html`
