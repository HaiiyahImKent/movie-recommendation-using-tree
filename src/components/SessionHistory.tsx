/**
 * 5. Components: Session History
 *    - Stores session data (selected genres, movie count, timestamp) in localStorage
 *    - Displays a list of past sessions with details and allows clearing individual or all sessions
 */

import React, { useState, useEffect } from "react";
import { MdDelete, MdHistory, MdCalendarToday, MdMovie } from "react-icons/md";

interface SessionItem {
	id: string;
	timestamp: number;
	genres: number[];
	movieCount: number;
	genreNames: string[];
	movies?: any[]; // It stores full movie list for replay
	stats?: {
		visitedNodes: number;
		traversalTimeMs: number;
		depth: number;
		bfsDepth: number;
		totalTreeNodes: number;
		treeHeight: number;
	};
}

interface SessionHistoryProps {
	onSelectSession?: (sessionId: string) => void;
}

// Mapping of genre IDs to names (The ID is converted into names)
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

// The main SessionHistory component (Where the session code exists)
export const SessionHistory: React.FC<SessionHistoryProps> = ({
	onSelectSession: _onSelectSession,
}) => {
	const [sessions, setSessions] = useState<SessionItem[]>([]);
	const [isVisible, setIsVisible] = useState(false);

	// Where you load sessions from localStorage on component mount and when sessions are saved
	// If you refresh the session, it the API key will reset, the results will be lost, so that the session will not be doubled
	useEffect(() => {
		loadSessions();

		// Listen for session save events from other components
		const handleSessionSaved = () => {
			console.log("📢 Session saved event detected, reloading...");
			loadSessions();
		};

		window.addEventListener("cinepath-session-saved", handleSessionSaved);

		return () => {
			window.removeEventListener("cinepath-session-saved", handleSessionSaved);
		};
	}, []);

	const loadSessions = () => {
		try {
			const stored = localStorage.getItem("cinepath_sessions");
			if (stored) {
				const parsed = JSON.parse(stored);
				setSessions(parsed);
			}
		} catch (error) {
			console.error("Error loading sessions:", error);
		}
	};

	const saveSession = (genres: number[], movieCount: number) => {
		const newSession: SessionItem = {
			id: `session_${Date.now()}`,
			timestamp: Date.now(),
			genres,
			movieCount,
			genreNames: genres.map((id) => GENRE_MAP[id] || "Unknown"),
		};

		const updated = [newSession, ...sessions].slice(0, 10); // Keep last 10
		setSessions(updated);
		localStorage.setItem("cinepath_sessions", JSON.stringify(updated));
	};

	const clearSession = (sessionId: string) => {
		const updated = sessions.filter((s) => s.id !== sessionId);
		setSessions(updated);
		localStorage.setItem("cinepath_sessions", JSON.stringify(updated));
	};

	const clearAllSessions = () => {
		if (window.confirm("Are you sure you want to clear all session history?")) {
			setSessions([]);
			localStorage.removeItem("cinepath_sessions");
		}
	};

	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="relative">
			{/* Toggle Button */}
			<button
				onClick={() => setIsVisible(!isVisible)}
				className="fixed bottom-6 right-6 bg-netflix-red hover:bg-red-700 text-white rounded-full p-3 shadow-lg flex items-center gap-2 transition-all duration-300 z-40"
			>
				<MdHistory size={24} />
				{sessions.length > 0 && (
					<span className="bg-green-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
						{sessions.length}
					</span>
				)}
			</button>

			{/* Session History Panel */}
			{isVisible && (
				<div className="fixed bottom-24 right-6 w-96 max-h-96 bg-dark rounded-lg shadow-2xl border border-gray-700 flex flex-col z-40 animate-slideUp">
					{/* Header */}
					<div className="bg-netflix-red p-4 rounded-t-lg flex items-center justify-between">
						<div className="flex items-center gap-2">
							<MdHistory size={20} className="text-white" />
							<h3 className="text-white font-bold text-lg">Recent Sessions</h3>
						</div>
						<button
							onClick={() => setIsVisible(false)}
							className="text-white hover:bg-red-700 p-1 rounded transition"
						>
							✕
						</button>
					</div>

					{/* The Session List */}
					<div className="flex-1 overflow-y-auto">
						{sessions.length === 0 ? (
							<div className="p-8 text-center text-gray-400">
								<MdMovie size={48} className="mx-auto mb-3 opacity-50" />
								<p>No session history yet</p>
								<p className="text-sm">Get recommendations to see them here</p>
							</div>
						) : (
							<div className="p-4 space-y-3">
								{sessions.map((session, index) => (
									<div
										key={session.id}
										className="bg-card-dark hover:bg-gray-800 p-3 rounded border border-gray-700 transition-all cursor-pointer group"
										onClick={() => {
											// Pass the entire session for replay
											window.dispatchEvent(
												new CustomEvent("cinepath-replay-session", {
													detail: session,
												})
											);
											setIsVisible(false);
										}}
									>
										{/* Session Number & Date for better readability */}
										<div className="flex items-center justify-between mb-2">
											<span className="text-netflix-red font-bold text-sm">
												#{sessions.length - index}
											</span>
											<div className="flex items-center gap-1 text-gray-400 text-xs">
												<MdCalendarToday size={12} />
												{formatDate(session.timestamp)}
											</div>
										</div>

										{/* Where Genres are displayed */}
										<div className="flex flex-wrap gap-1 mb-2">
											{session.genreNames.map((genre) => (
												<span
													key={genre}
													className="bg-netflix-red text-white text-xs px-2 py-1 rounded"
												>
													{genre}
												</span>
											))}
										</div>

										{/* Where Movie Count is displayed */}
										<div className="flex items-center justify-between">
											<span className="text-gray-400 text-sm">
												{session.movieCount} movies found
											</span>
											<button
												onClick={(e) => {
													e.stopPropagation();
													clearSession(session.id);
												}}
												className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<MdDelete size={16} />
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* The Footer */}
					{sessions.length > 0 && (
						<div className="border-t border-gray-700 p-3 rounded-b-lg bg-dark">
							<button
								onClick={clearAllSessions}
								className="w-full bg-red-900 hover:bg-red-800 text-white py-2 rounded text-sm font-semibold transition"
							>
								Clear All History
							</button>
						</div>
					)}
				</div>
			)}

			{/* The Overlay */}
			{isVisible && (
				<div
					className="fixed inset-0 bg-black bg-opacity-30 z-30"
					onClick={() => setIsVisible(false)}
				/>
			)}

			{/* Export for use in other components */}
			<div style={{ display: "none" }}>
				<div id="session-history-exporter" data-save-session={saveSession} />
			</div>
		</div>
	);
};

// Export function to save sessions from other components
export const saveSessionToHistory = (
	genres: number[],
	movieCount: number,
	movies?: any[],
	stats?: any
) => {
	try {
		console.log("🎬 Saving session to history:", {
			genres,
			movieCount,
			hasMovies: !!movies,
			hasStats: !!stats,
		});
		const sessions: SessionItem[] = JSON.parse(
			localStorage.getItem("cinepath_sessions") || "[]"
		);
		const newSession: SessionItem = {
			id: `session_${Date.now()}`,
			timestamp: Date.now(),
			genres,
			movieCount,
			genreNames: genres.map((id) => GENRE_MAP[id] || "Unknown"),
			movies: movies || [], // Store the full movie list
			stats: stats, // Store the algorithm stats
		};
		const updated = [newSession, ...sessions].slice(0, 10);
		localStorage.setItem("cinepath_sessions", JSON.stringify(updated));
		console.log("✅ Session saved. Total sessions:", updated.length);

		// Force a storage event to trigger refresh in other components
		window.dispatchEvent(new Event("cinepath-session-saved"));
	} catch (error) {
		console.error("Error saving session:", error);
	}
};

// Export function to get a session by ID (for replay)
export const getSessionById = (sessionId: string): SessionItem | undefined => {
	try {
		const sessions: SessionItem[] = JSON.parse(
			localStorage.getItem("cinepath_sessions") || "[]"
		);
		return sessions.find((s) => s.id === sessionId);
	} catch (error) {
		console.error("Error getting session:", error);
		return undefined;
	}
};
