# TMDB API Setup Guide

## Getting Started with TMDB API

### What is TMDB?

TMDB (The Movie Database) is a free, community-built database of movies and TV shows. It provides:

-   500,000+ movies and TV shows
-   Movie metadata (title, overview, genres, ratings, etc.)
-   Poster images and promotional content
-   Real-time updated information

### Why TMDB for CinePath?

-   ✅ Free API with generous rate limits
-   ✅ No credit card required
-   ✅ High-quality movie data
-   ✅ Regularly updated
-   ✅ Community-driven

---

## Step-by-Step API Setup

### Step 1: Create TMDB Account

1. Go to: https://www.themoviedb.org/signup
2. Create an account with:
    - Email address
    - Username (any name)
    - Password
3. Verify your email

### Step 2: Request API Key

1. Login to your account
2. Go to: https://www.themoviedb.org/settings/api
3. Click **"Create"** under the API section
4. Accept the terms and conditions
5. Select **"Developer"** type

### Step 3: Copy Your API Key

1. You'll see your API key displayed (looks like this):
    ```
    a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
    ```
2. **Copy the entire key** (it's your unique identifier)

### Step 4: Add to CinePath

1. Open this file: `src/services/tmdb.ts`
2. Find line 74:
    ```typescript
    const TMDB_API_KEY = "1234567890abcdef1234567890abcdef";
    ```
3. Replace the placeholder with your key:
    ```typescript
    const TMDB_API_KEY = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6";
    ```
4. Save the file

---

## How CinePath Uses the API

### API Endpoints Used

1. **Genre List**

    ```
    GET /genre/movie/list
    Returns: { 28: "Action", 12: "Adventure", ... }
    Called once per session
    ```

2. **Discover Movies**

    ```
    GET /discover/movie
    Params: with_genres=28,35&sort_by=popularity.desc
    Returns: Array of 50+ movies
    Called once per recommendation
    ```

3. **Search (Optional)**
    ```
    GET /search/movie
    Params: query=movie_title
    For searching specific movies
    ```

### Request Flow

```
CinePath App
    │
    ├─ User answers questions
    │
    ├─ Decision Tree returns genres [28, 35]
    │
    ├─ TMDB Service fetches movies
    │
    ├─ API Request: "Give me action & comedy movies"
    │
    └─ TMDB Returns: 50+ popular action/comedy films

Results: Display movies + metrics
```

---

## API Rate Limits

### Free Tier Limits

-   **Requests per second:** 4
-   **Requests per 10 seconds:** 40
-   **No monthly limit**

### CinePath Usage

-   **Per session:** 3-4 API calls
    -   1 genre list (1st time only)
    -   1-2 movie discovery (may paginate)
-   **Rate:** 1 session every 2-3 seconds = Safe ✓

**You won't hit rate limits with normal usage!**

---

## Troubleshooting API Issues

### Problem: "401 Unauthorized"

**Cause:** Invalid API key
**Solution:**

1. Copy your key again from https://www.themoviedb.org/settings/api
2. Make sure it's the full key (32 characters)
3. Paste it exactly in `src/services/tmdb.ts`
4. Restart dev server: `npm run dev`

### Problem: "404 Not Found"

**Cause:** Wrong endpoint or typo
**Solution:**

-   Verify endpoint URL in `src/services/tmdb.ts`
-   Check that parameters are correct

### Problem: Movies Not Loading

**Cause:** API request failed
**Solution:**

1. Check console (F12 → Console tab)
2. Look for error messages
3. Verify internet connection
4. Try refreshing the page

### Problem: Rate Limited (429 Error)

**Cause:** Too many requests in short time
**Solution:**

-   Wait 30 seconds
-   Reload the page
-   This rarely happens with normal usage

---

## API Response Examples

### Genre List Response

```json
{
	"genres": [
		{
			"id": 28,
			"name": "Action"
		},
		{
			"id": 12,
			"name": "Adventure"
		},
		{
			"id": 16,
			"name": "Animation"
		}
	]
}
```

### Movie Discovery Response

```json
{
	"page": 1,
	"results": [
		{
			"id": 550,
			"title": "Fight Club",
			"poster_path": "/poster.jpg",
			"overview": "An insomniac office worker...",
			"genre_ids": [28, 18],
			"release_date": "1999-10-15",
			"vote_average": 8.8
		},
		{
			"id": 278,
			"title": "The Shawshank Redemption",
			"poster_path": "/poster2.jpg",
			"overview": "Two imprisoned men...",
			"genre_ids": [18],
			"release_date": "1994-10-14",
			"vote_average": 9.3
		}
	],
	"total_pages": 500,
	"total_results": 10000
}
```

---

## Advanced API Usage

### Custom Filters

You can modify `discoverMoviesByGenres()` to add:

```typescript
// By year
.params.primary_release_year = 2023

// By rating
.params.vote_average.gte = 7.5

// By language
.params.with_original_language = "en"

// Exclude adult content
.params.include_adult = false  // ✓ Already enabled
```

### Pagination

Currently fetches in batches of 20:

```typescript
const pages = Math.ceil(50 / 20); // 3 pages
for (let page = 1; page <= pages; page++) {
	// Fetch page
}
```

### Image URLs

TMDB returns relative paths like `/poster.jpg`

-   **Small:** `https://image.tmdb.org/t/p/w200{path}`
-   **Medium:** `https://image.tmdb.org/t/p/w500{path}` ✓ Used in CinePath
-   **Large:** `https://image.tmdb.org/t/p/w1280{path}`

---

## Production Best Practices

### ✅ What CinePath Does Right

-   API key in separate file
-   Error handling for API failures
-   Caching logic (genre list)
-   User-friendly error messages
-   Rate-limit safe usage

### 🔐 For Production Deployment

1. **Move API Key to Environment Variables**

    ```env
    VITE_TMDB_API_KEY=your_key
    ```

2. **Use Backend Proxy** (Optional)

    - Your backend makes API calls
    - CinePath calls your backend
    - Hide API key from frontend

3. **Add Caching**

    - Cache genre list in localStorage
    - Cache movie results temporarily

4. **Monitor Usage**
    - Log API calls
    - Track error rates
    - Alert on rate limits

---

## Testing the API

### Test in Console

```javascript
// In browser console (F12)
fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=YOUR_KEY")
	.then((r) => r.json())
	.then((d) => console.log(d));
```

### Test with Postman

1. Download: https://www.postman.com/downloads/
2. Create request:
    - Method: GET
    - URL: `https://api.themoviedb.org/3/genre/movie/list`
    - Params: `api_key=YOUR_KEY`
3. Send and view response

---

## Additional Resources

-   **TMDB API Docs:** https://developer.themoviedb.org/docs/getting-started
-   **API Reference:** https://developer.themoviedb.org/docs/movie-discover
-   **Community Forum:** https://www.themoviedb.org/discuss
-   **Status Page:** https://status.themoviedb.org

---

## FAQ

**Q: Do I need a credit card?**
A: No, TMDB is completely free.

**Q: Can I use this in production?**
A: Yes, with proper API key management (use environment variables).

**Q: How long does the API key last?**
A: Indefinitely, unless you deactivate it.

**Q: Can I have multiple API keys?**
A: Yes, you can create up to 5 keys per account.

**Q: What if I lose my API key?**
A: You can regenerate it in your TMDB settings (old one will stop working).

**Q: Is the data real-time?**
A: TMDB updates data regularly, usually within 24 hours of release.

---

**Now you're ready to use TMDB API with CinePath! 🎬**

For any issues, refer to the troubleshooting section or check the browser console for error messages.
