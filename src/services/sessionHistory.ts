/**
 * SESSION HISTORY SERVICE
 * Manages recommendation sessions using Queue data structure
 * Stores last 10 sessions in localStorage and provides history management
 */

import { Queue, QueueItem } from "../data-structures/Queue";

interface SessionHistoryItem extends QueueItem {
	genreNames: string[];
	dateFormatted: string;
}

const GENRE_MAP: { [key: number]: string } = {
	12: "Adventure",
	28: "Action",
	35: "Comedy",
	36: "History",
	53: "Thriller",
	80: "Crime",
	14: "Fantasy",
	16: "Animation",
	18: "Drama",
	27: "Horror",
	99: "Documentary",
	10402: "Music",
	878: "Sci-Fi",
	10749: "Romance",
	9648: "Mystery",
	10751: "Family",
	10752: "War",
};

class SessionHistoryService {
	private sessionQueue: Queue<QueueItem>;
	private readonly STORAGE_KEY = "cinepath_sessions";
	private readonly MAX_SESSIONS = 10;

	constructor() {
		this.sessionQueue = new Queue<QueueItem>(this.MAX_SESSIONS);
		this.loadFromStorage();
	}

	/**
	 * Save a new recommendation session to history
	 * Uses Queue's enqueue method to add to front
	 * @param genres - Array of TMDB genre IDs
	 * @param movieCount - Number of movies found
	 */
	saveSession(genres: number[], movieCount: number): void {
		const sessionItem: QueueItem = {
			id: `session_${Date.now()}`,
			timestamp: Date.now(),
			genres,
			movieCount,
		};

		this.sessionQueue.enqueue(sessionItem);
		this.persistToStorage();
	}

	/**
	 * Get all sessions from history
	 * Returns most recent first
	 */
	getAllSessions(): SessionHistoryItem[] {
		return this.sessionQueue.toArray().map((item) => this.enrichSessionItem(item));
	}

	/**
	 * Get most recent session
	 * Uses Queue's front() method for O(1) operation
	 */
	getMostRecentSession(): SessionHistoryItem | undefined {
		const front = this.sessionQueue.front();
		return front ? this.enrichSessionItem(front) : undefined;
	}

	/**
	 * Clear a specific session from history
	 * @param sessionId - ID of session to remove
	 */
	clearSession(sessionId: string): void {
		// Since Queue doesn't have remove-by-id, we rebuild it
		const current = this.sessionQueue.toArray();
		this.sessionQueue.clear();

		current.forEach((item) => {
			if (item.id !== sessionId) {
				this.sessionQueue.enqueue(item);
			}
		});

		this.persistToStorage();
	}

	/**
	 * Clear all sessions
	 * Uses Queue's clear() method for O(1) operation
	 */
	clearAllSessions(): void {
		this.sessionQueue.clear();
		localStorage.removeItem(this.STORAGE_KEY);
	}

	/**
	 * Get session count
	 * Uses Queue's size() method for O(1) operation
	 */
	getSessionCount(): number {
		return this.sessionQueue.size();
	}

	/**
	 * Check if history is empty
	 * Uses Queue's isEmpty() method for O(1) operation
	 */
	isHistoryEmpty(): boolean {
		return this.sessionQueue.isEmpty();
	}

	/**
	 * Get sessions by genre filter
	 * Useful for seeing all action movie recommendations, etc.
	 */
	getSessionsByGenre(genreId: number): SessionHistoryItem[] {
		return this.getAllSessions().filter((session) => session.genres.includes(genreId));
	}

	/**
	 * Get session statistics
	 */
	getStatistics() {
		const sessions = this.getAllSessions();
		const totalMovies = sessions.reduce((sum, s) => sum + s.movieCount, 0);
		const genreCounts: { [key: string]: number } = {};

		sessions.forEach((session) => {
			session.genreNames.forEach((genre) => {
				genreCounts[genre] = (genreCounts[genre] || 0) + 1;
			});
		});

		return {
			totalSessions: sessions.length,
			totalMoviesViewed: totalMovies,
			averageMoviesPerSession: Math.round(totalMovies / sessions.length) || 0,
			mostUsedGenres: Object.entries(genreCounts)
				.sort(([, a], [, b]) => b - a)
				.slice(0, 5)
				.map(([genre, count]) => ({ genre, count })),
		};
	}

	/**
	 * Export session history as JSON
	 * Useful for backup or analysis
	 */
	exportHistory(): string {
		const sessions = this.getAllSessions();
		const stats = this.getStatistics();
		return JSON.stringify(
			{
				exportDate: new Date().toISOString(),
				sessionCount: sessions.length,
				statistics: stats,
				sessions,
			},
			null,
			2
		);
	}

	/**
	 * Private helper: Enrich session item with formatted data
	 */
	private enrichSessionItem(item: QueueItem): SessionHistoryItem {
		return {
			...item,
			genreNames: item.genres.map((id) => GENRE_MAP[id] || "Unknown"),
			dateFormatted: new Date(item.timestamp).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			}),
		};
	}

	/**
	 * Load sessions from localStorage
	 * Time Complexity: O(n) where n = stored sessions
	 */
	private loadFromStorage(): void {
		try {
			const stored = localStorage.getItem(this.STORAGE_KEY);
			if (stored) {
				const items: QueueItem[] = JSON.parse(stored);
				this.sessionQueue.clear();
				items.forEach((item) => this.sessionQueue.enqueue(item));
			}
		} catch (error) {
			console.error("Error loading session history from storage:", error);
			this.sessionQueue.clear();
		}
	}

	/**
	 * Persist sessions to localStorage
	 * Time Complexity: O(n) where n = sessions
	 */
	private persistToStorage(): void {
		try {
			const items = this.sessionQueue.toArray();
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
		} catch (error) {
			console.error("Error saving session history to storage:", error);
		}
	}
}

// Export singleton instance
export const sessionHistoryService = new SessionHistoryService();

export type { SessionHistoryItem };
