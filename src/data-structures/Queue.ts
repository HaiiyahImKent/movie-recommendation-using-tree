/**
 * QUEUE Data Structure 
 * Where the Queue data structure is implemented to manage the session history in a FIFO manner.
 * Used for storing past recommendation sessions (Recent Picks), up to 10 sessions.
 * If the 11th session is added, the oldest (1st) session is removed. (FIFO)
 * Time Complexity: O(1) for enqueue/dequeue operations
 */

export interface QueueItem {
	id: string;
	timestamp: number;
	genres: number[];
	movieCount: number;
}

export class Queue<T> {
	private items: T[] = [];
	private maxSize: number;

	constructor(maxSize: number = 10) {
		this.maxSize = maxSize;
	}

	/**
	 * Add element to end of queue
	 * @param element - Element to enqueue
	 * @time O(1)
	 */
	enqueue(element: T): void {
		this.items.push(element);
		// Keep only the most recent sessions
		if (this.items.length > this.maxSize) {
			this.items.shift();
		}
	}

	/**
	 * Remove and return front element
	 * @time O(n) due to shift, but kept simple for this use case
	 */
	dequeue(): T | undefined {
		return this.items.shift();
	}

	/**
	 * View front element without removing
	 * @time O(1)
	 */
	front(): T | undefined {
		return this.items[0];
	}

	/**
	 * Check if queue is empty
	 * @time O(1)
	 */
	isEmpty(): boolean {
		return this.items.length === 0;
	}

	/**
	 * Get queue size
	 * @time O(1)
	 */
	size(): number {
		return this.items.length;
	}

	/**
	 * Clear all elements
	 * @time O(1)
	 */
	clear(): void {
		this.items = [];
	}

	/**
	 * Get array representation
	 * @time O(1)
	 */
	toArray(): T[] {
		return [...this.items];
	}
}
