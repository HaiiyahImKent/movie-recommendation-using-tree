# CinePath - Quick Setup Guide

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies

```bash
cd C:\xampp\htdocs\CinePath
npm install
```

### Step 2: Get TMDB API Key

1. Visit: https://www.themoviedb.org/settings/api
2. Sign up for a free account
3. Copy your API key (looks like: `1a2b3c4d5e6f7g8h9i0j`)

### Step 3: Add API Key

Edit `src/services/tmdb.ts` line 74:

```typescript
const TMDB_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your key
```

### Step 4: Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Step 5: Build for Production

```bash
npm run build
```

Output will be in `dist/` folder

---

## 🎮 How to Use CinePath

### Home Page

1. Click **"Start Recommendation"** button
2. Read the documentation about how it works
3. Understand the algorithm explanation

### Recommendation Page

1. **Answer each question** with YES or NO
2. **Watch the tree visualization** update on the right
3. **Click UNDO** to go back to previous questions
4. **Answer ~5 questions** until recommendations appear

### Results Page

1. **View algorithm statistics**:

    - Nodes visited
    - Tree depth
    - Traversal time
    - DFS vs BFS comparison

2. **Browse 50+ movies**:
    - Click **"Watch on Netflix"** to search on Netflix
    - See ratings, genres, and descriptions

---

## 📁 Project Structure at a Glance

```
CinePath/
├── src/
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── data-structures/    # DSA implementations
│   ├── services/           # API services
│   ├── App.tsx             # Main app
│   ├── main.tsx            # Entry point
│   └── index.css           # Styles
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Build config
├── tailwind.config.js      # Tailwind config
├── README.md               # Full documentation
└── ARCHITECTURE.md         # Technical details
```

---

## 🔑 Key Features

| Feature             | File                              | Details                       |
| ------------------- | --------------------------------- | ----------------------------- |
| **Decision Tree**   | `data-structures/DecisionTree.ts` | Binary tree with DFS          |
| **Undo Function**   | `data-structures/Stack.ts`        | Go back to previous questions |
| **Session History** | `data-structures/Queue.ts`        | Store past recommendations    |
| **Movie Data**      | `services/tmdb.ts`                | Fetch from TMDB API           |
| **Questions**       | `pages/Recommend.tsx`             | Interactive Q&A               |
| **Results**         | `pages/Results.tsx`               | Recommendations + stats       |
| **Styling**         | `tailwind.config.js`              | Netflix dark theme            |

---

## 🐛 Troubleshooting

### Port 5173 Already in Use?

```bash
# Use different port
npm run dev -- --port 5174
```

### API Key Not Working?

```bash
# Make sure you have:
1. Signed up at themoviedb.org
2. Approved the API request
3. Copied the correct key
4. Placed it in src/services/tmdb.ts (line 74)
```

### Movies Not Loading?

```
1. Check console (F12) for errors
2. Verify API key is valid
3. Check internet connection
4. TMDB API might be rate-limited (wait a minute)
```

### Styles Look Broken?

```bash
# Rebuild Tailwind
npm run build
```

---

## 📊 Understanding the Algorithm

### Binary Decision Tree

-   **Questions asked:** 1-10
-   **Branches per node:** 2 (yes/no)
-   **Leaf nodes:** Contain movie genres
-   **Traversal:** Depth-First Search (DFS)

### How It Works

1. Start at root question: _"All ages suitable?"_
2. Answer **YES** or **NO**
3. Move to next question based on answer
4. Repeat until you reach a leaf node
5. Leaf node contains 2-3 recommended movie genres
6. Fetch movies matching those genres from TMDB

### Example Path

```
Q1: All ages? → YES
Q2: Like action? → NO
Q3: Animated? → YES
Q4: (No more questions)
→ Recommended genres: [16] (Animation)
→ Fetch 50 animated movies from TMDB
```

---

## ⚙️ Technology Stack

```
Frontend:
├── React 18          - UI framework
├── TypeScript        - Type safety
├── Tailwind CSS      - Styling
├── Framer Motion     - Animations
└── React Router      - Navigation

Backend/APIs:
├── Axios             - HTTP client
├── TMDB API          - Movie database
└── (No backend needed)

Build:
├── Vite              - Build tool
├── npm               - Package manager
└── TypeScript CLI    - Type checking
```

---

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      netflix: {
        black: '#141414',      // Change these
        red: '#E50914',        // to your colors
        // ...
      },
    },
  },
},
```

### Add More Questions

Edit `src/data-structures/DecisionTree.ts` `buildTree()` method:

```typescript
{
  question: "Your new question?",
  yes: { /* yes branch */ },
  no: { /* no branch */ }
}
```

### Change Movie Count

Edit `src/pages/Results.tsx`:

```typescript
const movies = await tmdbService.discoverMoviesByGenres(
	state.genres,
	50 // Change 50 to desired number
);
```

---

## 📚 Learn More

-   **React**: https://react.dev
-   **TypeScript**: https://www.typescriptlang.org
-   **Tailwind CSS**: https://tailwindcss.com
-   **Framer Motion**: https://www.framer.com/motion
-   **TMDB API**: https://www.themoviedb.org/settings/api

---

## ✅ Checklist Before Deployment

-   [ ] API key replaced in `src/services/tmdb.ts`
-   [ ] Tested all navigation paths
-   [ ] Tested undo functionality
-   [ ] Verified movies load correctly
-   [ ] Netflix links open properly
-   [ ] Responsive on mobile (use DevTools F12)
-   [ ] No console errors (F12 → Console)
-   [ ] Build successfully runs: `npm run build`

---

## 🚀 Deploy to Vercel (1 Click)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variable:
    ```
    VITE_TMDB_API_KEY = your_key_here
    ```
5. Click "Deploy"

Done! Your app is live.

---

## 💡 Pro Tips

1. **Dev Mode**: Use `npm run dev` for fast refresh
2. **Debug**: Open browser DevTools (F12) → Console
3. **Performance**: Check Network tab to see API calls
4. **TypeScript**: VS Code will catch errors before running

---

**Need help? Check README.md or ARCHITECTURE.md for detailed information.**
