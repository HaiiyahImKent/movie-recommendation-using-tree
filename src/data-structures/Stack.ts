/**
 * STACK Data Structure
 * Used for storing previous decision nodes to implement UNDO functionality
 * Time Complexity: O(1) for push/pop operations
 */

export class Stack<T> {
	private items: T[] = [];

	/**
	 * Add element to top of stack
	 * @param element - Element to push
	 * @time O(1)
	 */
	push(element: T): void {
		this.items.push(element);
	}

	/**
	 * Remove and return top element
	 * @time O(1)
	 */
	pop(): T | undefined {
		return this.items.pop();
	}

	/**
	 * View top element without removing
	 * @time O(1)
	 */
	peek(): T | undefined {
		return this.items[this.items.length - 1];
	}

	/**
	 * Check if stack is empty
	 * @time O(1)
	 */
	isEmpty(): boolean {
		return this.items.length === 0;
	}

	/**
	 * Get stack size
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
