# CinePath - Data Structures and Algorithms Documentation

> **Submitted by: Group 7**  
> This document explains all the data structures and algorithms na ginamit namin sa CinePath project, including why we chose them, how we implemented them, and paano namin sila na-utilize sa actual application.

---

## Table of Contents

1. [Binary Decision Tree](#1-binary-decision-tree)
2. [Depth-First Search (DFS) Algorithm](#2-depth-first-search-dfs-algorithm)
3. [Breadth-First Search (BFS) Algorithm](#3-breadth-first-search-bfs-algorithm)
4. [Stack Data Structure](#4-stack-data-structure)
5. [Queue Data Structure](#5-queue-data-structure)
6. [Time and Space Complexity Summary](#6-time-and-space-complexity-summary)

---

## 1. Binary Decision Tree

### What is it?

A Binary Decision Tree is a tree data structure where each node has at most two children (kaya binary). Sa aming case, each node contains a **question** and two branches: **yes** and **no**. The leaf nodes contain the **recommended genres** based sa mga answers ng user.

### Why did we use it?

We chose a Binary Decision Tree for the following reasons:

1. **Perfect for Yes/No Questions** - Since our recommendation system asks yes or no questions lang, a binary tree is the most natural fit. Each answer leads to exactly one path.

2. **Efficient Traversal** - Instead of checking all possible combinations, we only follow one path down the tree. This gives us O(h) time complexity where h is the height of the tree.

3. **Easy to Understand and Visualize** - Users can see their decision path clearly, and we can show a tree visualization para ma-understand nila kung paano nag-work yung recommendation.

4. **Scalable** - We can easily add more questions or modify the tree without affecting the overall structure.

### How did we implement it?

```typescript
export interface DecisionNode {
	question?: string; // The question to ask
	yes?: DecisionNode; // Branch if user answers "yes"
	no?: DecisionNode; // Branch if user answers "no"
	recommendedGenres?: number[]; // Genre IDs at leaf nodes
}

export class DecisionTree {
	private root: DecisionNode;

	constructor() {
		this.root = this.buildTree();
	}

	private buildTree(): DecisionNode {
		return {
			question: "Are you in the mood for something energized and exciting?",
			yes: {
				/* more nodes */
			},
			no: {
				/* more nodes */
			},
		};
	}
}
```

### How did we utilize it?

Sa `Recommend.tsx` page, we instantiate the Decision Tree and traverse it based sa user's answers:

```typescript
const [tree] = useState(() => new DecisionTree());

// When user answers a question
const handleAnswer = (answer: boolean) => {
	const nextQuestion = answer ? state.currentQuestion.yes : state.currentQuestion.no;
	// Move to the next node...
};
```

Our tree has **10-15 levels deep** para ma-ensure na the users answer enough questions before getting their personalized recommendations.

---

## 2. Depth-First Search (DFS) Algorithm

### What is it?

DFS is a tree/graph traversal algorithm that explores as far as possible along each branch before backtracking. Sa aming case, we go straight down from the root to a leaf node based sa user's answers.

### Why did we use it?

1. **Follows Natural Decision Flow** - When a user answers questions, they naturally go deeper into the tree. DFS matches this behavior perfectly.

2. **Memory Efficient** - DFS only needs to store the current path (O(h) space), not all nodes at each level like BFS would.

3. **Fast for Our Use Case** - Since we're looking for ONE specific path (the user's choices), DFS is optimal. We don't need to explore multiple branches.

4. **Easy to Implement with Recursion** - The recursive nature of DFS makes the code clean and easy to understand.

### How did we implement it?

```typescript
traverseDFS(answers: boolean[]): TraversalResult {
    const startTime = performance.now();
    const path: string[] = [];
    let visitedCount = 0;
    let currentNode = this.root;
    let depth = 0;

    // DFS traversal: follow yes/no branches based on answers
    for (let i = 0; i < answers.length && currentNode.question; i++) {
        path.push(currentNode.question);
        visitedCount++;
        depth++;

        // Go to yes or no branch based on answer
        currentNode = answers[i] ? currentNode.yes! : currentNode.no!;

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

### How did we utilize it?

When the user finishes answering all questions (reaches a leaf node), we use DFS to compute the final result and gather statistics:

```typescript
// In Recommend.tsx
if (nextQuestion.recommendedGenres && !nextQuestion.question) {
	const result = tree.traverseDFS(newAnswers);
	// Use result.recommendedGenres to fetch movies
}
```

The `TraversalResult` includes metrics like:

-   `visitedNodes` - How many questions were answered
-   `traversalTimeMs` - How fast the traversal was (usually <1ms!)
-   `depth` - How deep in the tree the user went

---

## 3. Breadth-First Search (BFS) Algorithm

### What is it?

BFS is another tree/graph traversal algorithm that visits all nodes at the current depth before moving to nodes at the next depth level. It uses a **Queue** to keep track of nodes to visit.

### Why did we use it?

1. **Getting All Questions** - We needed a way to collect ALL questions in the tree for analysis and display purposes. BFS visits every node systematically.

2. **Level-Order Traversal** - BFS gives us questions in order of depth, which is useful for understanding the tree structure.

3. **Finding Tree Statistics** - We use BFS to calculate metrics like total nodes and theoretical depth.

### How did we implement it?

```typescript
getAllQuestions(): string[] {
    const questions: string[] = [];
    const queue: DecisionNode[] = [this.root];  // Start with root
    const visited = new Set<DecisionNode>();     // Avoid duplicates

    while (queue.length > 0) {
        const node = queue.shift()!;  // Dequeue front element

        if (visited.has(node)) continue;
        visited.add(node);

        if (node.question) {
            questions.push(node.question);
        }

        // Enqueue children
        if (node.yes) queue.push(node.yes);
        if (node.no) queue.push(node.no);
    }

    return questions;
}
```

### How did we utilize it?

We use BFS to calculate the theoretical depth for comparison with actual DFS traversal:

```typescript
getTheoreticalBFSDepth(): number {
    const totalNodes = this.getTotalNodes();
    // For a complete binary tree: depth ≈ log2(n)
    return Math.ceil(Math.log2(totalNodes + 1));
}
```

This helps us show users how efficient DFS is compared to other approaches!

---

## 4. Stack Data Structure

### What is it?

A Stack is a LIFO (Last-In-First-Out) data structure. Think of it like a stack of plates - you can only add or remove from the top.

### Why did we use it?

1. **Undo Functionality** - Stacks are perfect for implementing "undo" because the last action should be the first one to be undone.

2. **Tracking Decision History** - We store previous decision nodes so users can go back to any previous question.

3. **Simple and Efficient** - Push and pop operations are O(1), making it very fast.

### How did we implement it?

```typescript
export class Stack<T> {
	private items: T[] = [];

	push(element: T): void {
		this.items.push(element);
	}

	pop(): T | undefined {
		return this.items.pop();
	}

	peek(): T | undefined {
		return this.items[this.items.length - 1];
	}

	isEmpty(): boolean {
		return this.items.length === 0;
	}

	size(): number {
		return this.items.length;
	}
}
```

### How did we utilize it?

Sa `Recommend.tsx`, we use the Stack para sa undo feature:

```typescript
const [undoStack] = useState(() => new Stack<DecisionNode>());

// When user answers, push current node to stack
const handleAnswer = (answer: boolean) => {
	if (state.currentQuestion) {
		undoStack.push(state.currentQuestion);
	}
	// Move to next question...
};

// When user clicks "undo", pop from stack
const handleUndo = () => {
	undoStack.pop();
	// Go back to previous state...
};
```

This allows users to change their mind and go back sa previous questions without restarting the whole questionnaire!

---

## 5. Queue Data Structure

### What is it?

A Queue is a FIFO (First-In-First-Out) data structure. Like a line sa cashier - first person in line gets served first.

### Why did we use it?

1. **BFS Implementation** - Queues are essential for BFS traversal. We enqueue children and dequeue nodes to visit in level order.

2. **Recent Picks History** - We can use queues to store recent recommendation sessions, keeping only the most recent ones.

3. **Fair Ordering** - Queues maintain the order of insertion, which is important for displaying history chronologically.

### How did we implement it?

```typescript
export class Queue<T> {
	private items: T[] = [];
	private maxSize: number;

	constructor(maxSize: number = 10) {
		this.maxSize = maxSize;
	}

	enqueue(element: T): void {
		this.items.push(element);
		// Keep only the most recent sessions
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

	isEmpty(): boolean {
		return this.items.length === 0;
	}
}
```

### How did we utilize it?

1. **In BFS Algorithm** - The `getAllQuestions()` method uses an internal queue:

    ```typescript
    const queue: DecisionNode[] = [this.root];
    while (queue.length > 0) {
    	const node = queue.shift()!; // Dequeue
    	// Process node...
    	if (node.yes) queue.push(node.yes); // Enqueue children
    	if (node.no) queue.push(node.no);
    }
    ```

2. **For Session History** - We can store past recommendation sessions and display them as "Recent Picks":
    ```typescript
    interface QueueItem {
    	id: string;
    	timestamp: number;
    	genres: number[];
    	movieCount: number;
    }
    ```

---

## 6. Time and Space Complexity Summary

| Data Structure/Algorithm | Operation         | Time Complexity | Space Complexity |
| ------------------------ | ----------------- | --------------- | ---------------- |
| **Decision Tree**        | Build             | O(1)\*          | O(n)             |
| **Decision Tree**        | Get Root          | O(1)            | O(1)             |
| **Decision Tree**        | Get Height        | O(n)            | O(h)             |
| **Decision Tree**        | Get Total Nodes   | O(n)            | O(h)             |
| **DFS Traversal**        | Traverse          | O(h)            | O(h)             |
| **BFS Traversal**        | Get All Questions | O(n)            | O(n)             |
| **Stack**                | Push              | O(1)            | O(1)             |
| **Stack**                | Pop               | O(1)            | O(1)             |
| **Stack**                | Peek              | O(1)            | O(1)             |
| **Queue**                | Enqueue           | O(1)            | O(1)             |
| **Queue**                | Dequeue           | O(n)\*\*        | O(1)             |
| **Queue**                | Front             | O(1)            | O(1)             |

> **Notes:**
>
> -   \*O(1) because tree structure is predefined, not dynamically built
> -   \*\*O(n) because of array shift operation, but acceptable for our small queue sizes
> -   **n** = total number of nodes in tree
> -   **h** = height of tree (10-15 in our case)

---

## Conclusion

By combining these data structures and algorithms, we created an efficient and user-friendly movie recommendation system:

1. **Binary Decision Tree** - Structures our questions and recommendations logically
2. **DFS** - Efficiently traverses the tree based on user answers (O(h) time!)
3. **BFS** - Helps us analyze and display tree information
4. **Stack** - Enables undo functionality para ma-change ng user yung decisions nila
5. **Queue** - Used in BFS and for storing session history

The best part? All of these work together seamlessly to give users personalized movie recommendations in **less than 1 millisecond** of traversal time! 🎬

---

_Group 7 - CinePath Project_
