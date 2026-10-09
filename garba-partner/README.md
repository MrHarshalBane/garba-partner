# GarbaConnect 🪔

> Find Your Garba Partner – A Tinder-style app for Navratri dance partners!

## ✨ Features

- 🔥 **Swipe to match** – Left/right swipe, button clicks, or keyboard arrows
- ⭐ **Super Like** – Show extra interest
- 💬 **Real-time chat** – Message your matches (with auto-replies for demo)
- 👤 **Profile creation** – Skill level, looking-for, dance styles
- 🎊 **Match popup** – Animated confetti when you match
- 📱 **Mobile-first** – Responsive design for all screen sizes
- 💾 **Persistent state** – Uses localStorage, no backend needed
- 🌙 **Dark theme** – Beautiful dark UI with orange/purple accents

## 🚀 Deploy

### Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import this folder (or push to GitHub first)
3. Deploy! (No build step needed)

### Netlify
1. Go to [netlify.com](https://netlify.com) → Add new site → Deploy manually
2. Drag & drop the `garba-partner` folder
3. Done!

### GitHub Pages
1. Push all files to a GitHub repo
2. Go to Settings → Pages → Source: Deploy from branch (main, root)
3. Your site will be live at `https://username.github.io/repo-name`

## 🎮 Controls

| Action | Mouse/Touch | Keyboard |
|--------|-------------|----------|
| Like ❤️ | Swipe right | → Arrow Right |
| Pass ✕ | Swipe left | ← Arrow Left |
| Super Like ⭐ | Button | ↑ Arrow Up |

## 📁 File Structure

```
garba-partner/
├── index.html      # Main app (all screens)
├── style.css       # All styles
├── app.js          # App logic
├── favicon.svg     # Diya icon
├── vercel.json     # Vercel deployment config
├── _redirects      # Netlify config
└── README.md
```

## 🛠 Tech Stack

- Vanilla HTML, CSS, JavaScript – No frameworks!
- Google Fonts (Poppins)
- localStorage for persistence
- Touch & Mouse event handling for swipes

---
Made with ❤️ for Navratri 🪔
