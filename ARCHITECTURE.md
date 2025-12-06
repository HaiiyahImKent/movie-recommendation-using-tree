# CinePath - Architecture & Algorithm Documentation

## 📊 System Architecture

### High-Level Overview

```
┌────────────────────────────────────────────────────────────┐
│                    CINEPATH APPLICATION                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │   React Router   │────────▶│   Page Routes    │        │
│  │   Navigation     │         │  Home, Recommend  │        │
│  └──────────────────┘         │     Results       │        │
│                                └──────────────────┘        │
│                                         │                  │
│                    ┌────────────────────┼──────────────────┐
│                    │                    │                  │
│        ┌───────────▼──────────┐    ┌────▼──────────────┐   │
│        │  Decision Tree (DSA) │    │  React Components │   │
│        ├──────────────────────┤    ├───────────────────┤   │
│        │ • Binary tree nodes  │    │ • QuestionCard    │   │
│        │ • 7-12 Questions     │    │ • MovieCard       │   │
│        │ • Genre leaf nodes   │    │ • MovieGrid       │   │
│        └──────────┬───────────┘    │ • TreeVisualizer  │   │
│                   │                │ • Statistics      │   │
│        ┌──────────▼───────────┐    └───────────────────┘   │
│        │   DFS Algorithm      │                            │
│        ├──────────────────────┤    ┌───────────────────┐   │
│        │ • O(h) time complex. │    │  Data Structures  │   │
│        │ • O(h) space complex.│    ├───────────────────┤   │
│        │ • Path tracking      │    │ • Stack (Undo)    │   │
│        │ • Node counting      │    │ • Queue (History) │   │
│        └──────────┬───────────┘    └───────────────────┘   │
│                   │                                        │
│        ┌──────────▼───────────┐                            │
│        │  Traversal Results   │                            │
│        ├──────────────────────┤    ┌───────────────────┐   │
│        │ • Genre IDs (2-3)    │    │  TMDB API Service │   │
│        │ • Path (questions)   │    ├───────────────────┤   │
│        │ • Metrics            │    │ • Fetch genres    │   │
│        │ • Performance data   │    │ • Discover movies │   │
│        └──────────┬───────────┘    │ • Get images      │   │
│                   │                └────────┬──────────┘   │
│                   │                         │              │
│                   └────────────────┬────────┘              │
│                                    │                       │
│                        ┌───────────▼──────────┐            │
│                        │   Movie Results      │            │
│                        ├──────────────────────┤            │
│                        │ • 50+ movies         │            │
│                        │ • Netflix links      │            │
│                        │ • Ratings & genres   │            │
│                        │ • Performance stats  │            │
│                        └──────────────────────┘            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🌳 Binary Decision Tree

### Tree Specification

**Type:** Binary Tree (each node has 0, 1, or 2 children)  
**Height:** Maximum 10 levels  
**Nodes:** Leaf nodes store genre arrays  
**Traversal:** Depth-First Search (DFS)

### Node Structure

```typescript
interface DecisionNode {
	question?: string; // Question text (undefined on leaf)
	yes?: DecisionNode; // Left branch (answer = YES)
	no?: DecisionNode; // Right branch (answer = NO)
	recommendedGenres?: number[]; // TMDB genre IDs (on leaf only)
}
```

### Tree Building Process

```typescript
private buildTree(): DecisionNode {
  return {
    question: "Root question?",
    yes: {
      question: "Sub-question 1?",
      yes: { recommendedGenres: [28, 12] },      // Leaf node
      no: { recommendedGenres: [28] }            // Leaf node
    },
    no: {
      question: "Sub-question 2?",
      yes: { recommendedGenres: [18] },          // Leaf node
      no: { recommendedGenres: [35] }            // Leaf node
    }
  };
}
```

### Tree Visualization

```
                          "All ages?"
                         /          \
                       YES            NO
                       /                \
              "Action?"              "Drama?"
              /      \               /      \
            YES      NO           YES       NO
           /          \          /          \
       "Superhero?" "Animated?" "True stories?" "Sci-Fi?"
       /   \        /   \        /   \         /    \
      YES  NO     YES   NO     YES   NO      YES   NO
      [28,12] [28]  [16]  [35]  [18,36] [18]  [878] [14,878]

Legend:
- [28, 12] = Action, Adventure genres
- [28] = Action only
- [16] = Animation
- [35] = Comedy
- [18] = Drama
- [36] = History
- [878] = Sci-Fi
- [14] = Fantasy
```

---

## 🔍 Depth-First Search Algorithm

### Implementation

```typescript
traverseDFS(answers: boolean[]): TraversalResult {
  const startTime = performance.now();
  const path: string[] = [];
  let visitedCount = 0;
  let currentNode = this.root;
  let depth = 0;

  // DFS: Follow yes/no branches based on answers
  for (let i = 0; i < answers.length && currentNode.question; i++) {
    path.push(currentNode.question);
    visitedCount++;
    depth++;

    // Branch: true = yes (left), false = no (right)
    currentNode = answers[i]
      ? currentNode.yes!      // Go left
      : currentNode.no!;      // Go right

    if (!currentNode) break;
  }

  const traversalTimeMs = performance.now() - startTime;

  return {
    recommendedGenres: currentNode.recommendedGenres || [],
    path,
    visitedNodes: visitedCount,
    traversalTimeMs,
    depth,
  };
}
```

### Time Complexity Analysis

```
Best Case:   O(1)   - Found at root (not applicable here)
Average Case: O(h)  - h = 5 (visits ~5 nodes)
Worst Case:  O(h)   - h = 10 (visits ~10 nodes)

Where h = tree height
```

**Why O(h) and not O(n)?**

-   We only follow ONE path through the tree
-   Each answer eliminates half the remaining possibilities
-   With 5 questions, we visit exactly 5 nodes (not all 31)

### Space Complexity Analysis

```
Recursion Stack: O(h) = O(10) = O(1) effectively
Array Storage:   O(k) where k = number of questions asked
Total:          O(h) = O(10)
```

### Example Traversal

```
Input: answers = [true, false, true, false, true]

Step 1: Start at root
        current = "All ages?" ✓
        path = ["All ages?"]

Step 2: answers[0] = true (YES)
        current = "Action?" ✓
        path = ["All ages?", "Action?"]

Step 3: answers[1] = false (NO)
        current = "Animated?" ✓
        path = ["All ages?", "Action?", "Animated?"]

Step 4: answers[2] = true (YES)
        current = {recommendedGenres: [16]} (LEAF)
        path = ["All ages?", "Action?", "Animated?", (no more branches)]

Step 5: answers[3] = false, answers[4] = true
        (Not evaluated, already at leaf node)

Output: {
  recommendedGenres: [16],
  path: ["All ages?", "Action?", "Animated?"],
  visitedNodes: 3,
  traversalTimeMs: 0.15,
  depth: 3
}
```

---

## 📚 Stack Implementation (Undo Feature)

### Structure

```typescript
class Stack<T> {
	private items: T[] = [];

	push(element: T): void {
		this.items.push(element); // O(1)
	}

	pop(): T | undefined {
		return this.items.pop(); // O(1)
	}

	peek(): T | undefined {
		return this.items[this.items.length - 1]; // O(1)
	}

	isEmpty(): boolean {
		return this.items.length === 0; // O(1)
	}

	size(): number {
		return this.items.length; // O(1)
	}
}
```

### Usage in Undo Feature

```
User Flow:
┌─────────────────────┐
│ Start at Root       │
│ stack = []          │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Answer Q1: YES      │
│ stack.push(root)    │
│ stack = [root]      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Answer Q2: NO       │
│ stack.push(Q1_yes)  │
│ stack = [root,      │
│          Q1_yes]    │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────┐
│ Click UNDO Button    │
│ prev = stack.pop()   │
│ stack = [root]       │
│ Go back to root      │
└──────────────────────┘
```

### Time Complexity

-   Push: O(1)
-   Pop: O(1)
-   Peek: O(1)

### Space Complexity

-   O(k) where k = number of questions answered (≤ 10)

---

## 📋 Queue Implementation (Session History)

### Structure

```typescript
interface QueueItem {
	id: string;
	timestamp: number;
	genres: number[];
	movieCount: number;
}

class Queue<T> {
	private items: T[] = [];
	private maxSize: number = 10;

	enqueue(element: T): void {
		this.items.push(element);
		if (this.items.length > this.maxSize) {
			this.items.shift(); // Remove oldest
		}
	}

	dequeue(): T | undefined {
		return this.items.shift();
	}

	front(): T | undefined {
		return this.items[0];
	}
}
```

### Usage Pattern

```
Session 1: enqueue → queue = [Session1]
Session 2: enqueue → queue = [Session1, Session2]
...
Session 10: enqueue → queue = [Session1-10]
Session 11: enqueue → shift + push → queue = [Session2-11]
           (oldest session removed)
```

### Time Complexity

-   Enqueue: O(1) amortized
-   Dequeue: O(1)
-   Front: O(1)

### Space Complexity

-   O(min(n, maxSize)) = O(10) = O(1)

---

## 🎬 TMDB API Integration

### Genre Mapping

```typescript
const genreMap: GenreMap = {
	28: "Action",
	12: "Adventure",
	16: "Animation",
	35: "Comedy",
	18: "Drama",
	27: "Horror",
	36: "History",
	10749: "Romance",
	878: "Science Fiction",
	53: "Thriller",
	14: "Fantasy",
	// ... more genres
};
```

### Movie Discovery Flow

```typescript
// 1. Tree recommends genres [28, 35]
const recommendedGenres = [28, 35];

// 2. API call with genre filter
const movies = await tmdbService.discoverMoviesByGenres(
	recommendedGenres,
	50 // Get up to 50 movies
);

// 3. TMDB API endpoint
// GET /discover/movie?with_genres=28,35&sort_by=popularity.desc

// 4. Return formatted movies with Netflix links
[
	{
		id: 550,
		title: "Fight Club",
		poster_path: "/example.jpg",
		overview: "...",
		genre_ids: [28, 18],
		vote_average: 8.8,
		netflixUrl: "https://www.netflix.com/search?q=Fight+Club",
	},
	// ... more movies
];
```

### API Rate Limiting

-   Free tier: 40 requests/10 seconds
-   CinePath usage: ~3-4 requests per session
    -   1 for genres list
    -   1-3 for movie discovery (pagination)

---

## ⚡ Performance Optimization

### Query Optimization

```typescript
// ❌ Bad: 50+ separate API calls
for (let i = 0; i < genreIds.length; i++) {
	const movies = await tmdbService.discoverMoviesByGenres([genreIds[i]]);
}

// ✅ Good: Single API call with multiple genres
const movies = await tmdbService.discoverMoviesByGenres(genreIds, 50);
```

### Image Loading

```typescript
// ✅ Lazy loading + placeholder
<img
	src={posterUrl}
	alt={title}
	loading="lazy"
	onError={(e) => {
		e.currentTarget.src = placeholderImage;
	}}
/>
```

### Memoization

```typescript
// ✅ Prevent unnecessary re-renders
export default memo(MovieCard, (prev, next) => {
	return prev.id === next.id && prev.title === next.title;
});
```

---

## 🔐 Data Flow & State Management

### Global State

```
App (Root)
├── Home Page (Static)
├── Recommend Page
│   └── Local State:
│       ├── currentQuestion: DecisionNode
│       ├── answers: boolean[]
│       ├── history: DecisionNode[]
│       └── traversalResult: TraversalResult
│
└── Results Page
    └── Location State (from navigate):
        ├── genres: number[]
        └── stats: RecommendationStats
```

### State Updates

```typescript
// Question → Answer → Branch
setState((prev) => ({
	...prev,
	currentQuestion: nextQuestion,
	answers: [...prev.answers, answer],
	history: [...prev.history, nextQuestion],
}));

// Undo → Previous State
// Pop from stack, recalculate from root with fewer answers

// Reach Leaf → Traversal Result
const result = tree.traverseDFS(answers);
setState((prev) => ({
	...prev,
	traversalResult: result,
	isFinished: true,
}));
```

---

## 🎯 Algorithm Complexity Comparison

### DFS vs BFS

```
Decision Tree Height = 10
Complete Binary Tree = 2^10 = 1024 total nodes

DFS (Our Implementation):
├─ Path: 1 branch only
├─ Nodes visited: 10 (max)
├─ Time: O(10) = O(1) effectively
├─ Space: O(10) recursion stack
└─ Queue: N/A

BFS (Alternative):
├─ Path: All branches at each level
├─ Nodes visited: 2^0 + 2^1 + ... + 2^10 = 2047
├─ Time: O(2^h)
├─ Space: O(2^h) queue
└─ Advantage: Finds shortest path (not applicable here)
```

### Winner: DFS ✓

-   **More efficient** for sequential questioning
-   **Less memory** required
-   **Faster traversal** (0.1-0.5ms typically)

---

## 📝 Code Quality Standards

### Type Safety

✅ **100% TypeScript Coverage**

-   No `any` types
-   All function parameters typed
-   All return types specified
-   Strict mode enabled in tsconfig.json

```typescript
// ✅ Type-safe
function traverseDFS(answers: boolean[]): TraversalResult {
	// Implementation
}

// ❌ Not allowed
function traverseDFS(answers: any): any {
	// Not acceptable in CinePath
}
```

### Documentation

✅ **JSDoc Comments**

```typescript
/**
 * Traverse tree using Depth-First Search (DFS)
 * @param answers - Array of boolean answers (true = yes, false = no)
 * @returns TraversalResult with recommendations and metrics
 * @time O(h) where h is tree height
 * @space O(h) for recursion stack
 */
traverseDFS(answers: boolean[]): TraversalResult {
  // ...
}
```

---

## 🚀 Future Enhancements

1. **Persistent Storage**

    - Save session history to localStorage
    - Remember user preferences

2. **Machine Learning**

    - Learn from user ratings
    - Adjust tree weights dynamically

3. **Social Sharing**

    - Share recommendations with friends
    - Compare preference paths

4. **Advanced Analytics**

    - Track popular paths
    - Identify common user preferences
    - Visualize tree usage patterns

5. **Multi-Language Support**

    - Translate questions
    - Localized movie titles

6. **Expanded Movie Sources**
    - Integrate with other APIs (IMDb, Rotten Tomatoes)
    - Add user ratings

---

**This documentation provides deep insights into CinePath's architecture, algorithms, and implementation details.**
