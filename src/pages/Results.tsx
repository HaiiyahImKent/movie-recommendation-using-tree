/**
 * Results Page
 * Displays recommended movies and algorithm statistics
 */

import { FC, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import MovieGrid from "../components/MovieGrid";
import RecommendationStats from "../components/RecommendationStats";
import { saveSessionToHistory } from "../components/SessionHistory";
import { Movie, GenreMap } from "../services/tmdb";
import tmdbService from "../services/tmdb";
import {
	buildQueryFromGenres,
	buildComedyOnlyQuery,
	buildThrillerOnlyQuery,
	buildActionOnlyQuery,
	buildRomanceOnlyQuery,
	scoreMovieGenres,
} from "../utils/genreQuery";
import { MovieCardProps } from "../components/MovieCard";

interface LocationState {
	genres: number[];
	stats: {
		visitedNodes: number;
		traversalTimeMs: number;
		depth: number;
		bfsDepth: number;
		totalTreeNodes: number;
		treeHeight: number;
	};
}

const Results: FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [movies, setMovies] = useState<MovieCardProps[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [genreMap, setGenreMap] = useState<GenreMap>({});
	const [stats, setStats] = useState<LocationState["stats"] | null>(null);
	const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
	const [currentSessionIndex, setCurrentSessionIndex] = useState<number | null>(null);
	const [totalSessions, setTotalSessions] = useState<number>(0);
	const [currentSessionTimestamp, setCurrentSessionTimestamp] = useState<number | null>(null);
	const [currentSessionGenres, setCurrentSessionGenres] = useState<number[]>([]);
	const currentSessionIdRef = useRef<string>("");
	const isReplayingRef = useRef<boolean>(false); // Track if we're replaying a session
	const hasSessionSavedRef = useRef<boolean>(false); // Track if we've already saved this session

	const state = location.state as LocationState | undefined;

	useEffect(() => {
		// Create a unique session ID based on the current navigation
		// This prevents saving duplicates on page refresh
		const newSessionId = `session_${Date.now()}_${Math.random()}`;
		currentSessionIdRef.current = newSessionId;

		// Store in sessionStorage to persist across refresh for THIS session
		sessionStorage.setItem("cinepath_currentSessionId", newSessionId);
		sessionStorage.removeItem("cinepath_sessionSaved"); // Clear saved flag on new navigation

		isReplayingRef.current = false; // Reset replay flag on new page load
		hasSessionSavedRef.current = false; // Reset save flag on new navigation

		// Store stats from the decision tree
		if (state?.stats) {
			setStats(state.stats);
		}

		// Store current session genres
		if (state?.genres) {
			setCurrentSessionGenres(state.genres);
		}

		// Clear session indicators for new recommendations
		setCurrentSessionId(null);
		setCurrentSessionIndex(null);
		setCurrentSessionTimestamp(null);

		const fetchData = async () => {
			try {
				setIsLoading(true);

				// Fetch TMDB genres
				const genres = await tmdbService.fetchGenres();
				setGenreMap(genres);

				// Fetch movies by genres using TMDB + genreQuery
				if (state?.genres && state.genres.length > 0) {
					// If pure comedy intent (TMDB Comedy ID = 35), use strict comedy-only params
					const isComedyOnly = state.genres.length === 1 && state.genres[0] === 35;
					const isThrillerOnly = state.genres.length === 1 && state.genres[0] === 53;
					const isActionOnly = state.genres.length === 1 && state.genres[0] === 28;
					const isRomanceOnly = state.genres.length === 1 && state.genres[0] === 10749;
					const params = isComedyOnly
						? buildComedyOnlyQuery({ sortBy: "popularity.desc" })
						: isThrillerOnly
						? buildThrillerOnlyQuery({ sortBy: "popularity.desc" })
						: isActionOnly
						? buildActionOnlyQuery({ sortBy: "popularity.desc" })
						: isRomanceOnly
						? buildRomanceOnlyQuery({ sortBy: "popularity.desc" })
						: buildQueryFromGenres(state.genres, { sortBy: "popularity.desc" });

					const recommendedMovies = await tmdbService.discoverMovies(params, 50);

					// Rank for closeness to intended genres
					const ranked = recommendedMovies
						.map((m) => ({
							movie: m,
							score: scoreMovieGenres(m.genre_ids, state.genres),
						}))
						.sort((a, b) => b.score - a.score)
						.map((x) => x.movie);

					const formattedMovies: MovieCardProps[] = ranked.map((movie: Movie) => ({
						id: movie.id,
						title: movie.title,
						image: tmdbService.getImageUrl(movie.poster_path),
						overview: movie.overview,
						genreNames: movie.genre_ids.map((id) => genres[id]).filter(Boolean),
						netflixUrl: tmdbService.getNetflixSearchUrl(movie.title),
						displayYear: movie.release_date
							? new Date(movie.release_date).getFullYear()
							: "N/A",
						voteAverage: movie.vote_average,
					}));

					setMovies(formattedMovies);
				} else {
					// Fallback to popular movies if no genres specified (TMDB)
					const popularMovies = await tmdbService.getPopularMovies(50);
					const formattedMovies: MovieCardProps[] = popularMovies.map((movie: Movie) => ({
						id: movie.id,
						title: movie.title,
						image: tmdbService.getImageUrl(movie.poster_path),
						overview: movie.overview,
						genreNames: movie.genre_ids.map((id) => genres[id]).filter(Boolean),
						netflixUrl: tmdbService.getNetflixSearchUrl(movie.title),
						displayYear: movie.release_date
							? new Date(movie.release_date).getFullYear()
							: "N/A",
						voteAverage: movie.vote_average,
					}));
					setMovies(formattedMovies);
				}
			} catch (error) {
				console.error("Error fetching movies:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [state]);

	// Save session to history when movies are loaded (only once per session)
	useEffect(() => {
		if (
			movies.length > 0 &&
			state?.genres &&
			state.genres.length > 0 &&
			!isReplayingRef.current
		) {
			// Check if we've already saved this exact session by comparing with the last saved session
			try {
				const savedSessions = JSON.parse(localStorage.getItem("cinepath_sessions") || "[]");

				if (savedSessions.length > 0) {
					const lastSavedSession = savedSessions[0]; // Most recent is at index 0

					// Check if the last saved session has the same genres and was saved very recently (within last 5 seconds)
					const isSameGenres =
						JSON.stringify(lastSavedSession.genres.sort()) ===
						JSON.stringify(state.genres.sort());
					const isRecent = Date.now() - lastSavedSession.timestamp < 5000;

					// If this matches our current session, don't save again
					if (isSameGenres && isRecent) {
						console.log("⏭️ Session already saved recently, skipping duplicate");
						return;
					}
				}

				// If we get here, save the session
				saveSessionToHistory(state.genres, movies.length, movies, stats);
				console.log("✅ New session saved");
			} catch (error) {
				console.error("Error checking for duplicates:", error);
				// If there's an error, save anyway
				saveSessionToHistory(state.genres, movies.length, movies, stats);
			}
		}
	}, [movies, stats]);

	// Handle session replay from history
	useEffect(() => {
		const handleReplaySession = (event: any) => {
			const session = event.detail;
			console.log("🔄 Replaying session:", session);

			// Mark as replaying to prevent saving as new session
			isReplayingRef.current = true;
			hasSessionSavedRef.current = true;

			// Mark as saved in sessionStorage to prevent duplicate on replay
			sessionStorage.setItem("cinepath_sessionSaved", "true");

			// Track which session is being viewed
			setCurrentSessionId(session.id);
			setCurrentSessionTimestamp(session.timestamp);
			setCurrentSessionGenres(session.genres); // Update genres to match session

			// Get all sessions to find the index
			try {
				const sessions = JSON.parse(localStorage.getItem("cinepath_sessions") || "[]");
				const index = sessions.findIndex((s: any) => s.id === session.id);
				setCurrentSessionIndex(index >= 0 ? index + 1 : null);
				setTotalSessions(sessions.length);
			} catch (error) {
				console.error("Error getting session index:", error);
			}

			if (session.movies && session.movies.length > 0) {
				setMovies(session.movies);
			}

			// Restore the original stats from this session
			if (session.stats) {
				setStats(session.stats);
			}
		};

		window.addEventListener("cinepath-replay-session", handleReplaySession);
		return () => {
			window.removeEventListener("cinepath-replay-session", handleReplaySession);
		};
	}, []);

	return (
		<div className="min-h-screen bg-netflix-black py-12 px-4">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="max-w-7xl mx-auto mb-12"
			>
				<button
					onClick={() => {
						// Clear session tracking when going back
						setCurrentSessionId(null);
						setCurrentSessionIndex(null);
						setCurrentSessionTimestamp(null);
						navigate("/recommend");
					}}
					className="text-netflix-gray hover:text-netflix-red transition-colors mb-6 flex items-center gap-2"
				>
					← New Recommendation
				</button>

				{/* Session Indicator Badge */}
				{currentSessionId && currentSessionIndex && (
					<div className="mb-6 inline-block bg-netflix-red/20 border border-netflix-red rounded-lg px-4 py-2">
						<p className="text-netflix-red font-semibold text-sm">
							From History • Session {currentSessionIndex} / {totalSessions}
							{currentSessionTimestamp && (
								<span className="text-gray-400 ml-2">
									({new Date(currentSessionTimestamp).toLocaleDateString()}{" "}
									{new Date(currentSessionTimestamp).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
									)
								</span>
							)}
						</p>
					</div>
				)}
				<h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
					Your Personalized Recommendations
				</h1>
				<p className="text-netflix-gray text-lg">
					{movies.length} {movies.length === 1 ? "movie" : "movies"} matching your
					preferences
				</p>
			</motion.div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto">
				{/* Stats Section */}
				{(stats || state?.stats) && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="mb-12"
					>
						<h2 className="text-2xl font-bold text-white mb-6">
							Algorithm Performance
						</h2>
						<RecommendationStats
							{...(stats || state?.stats)!}
							selectedGenreNames={(currentSessionGenres || state?.genres || [])
								.map((id) => genreMap[id])
								.filter(Boolean)}
							movieCount={movies.length}
						/>
					</motion.div>
				)}{" "}
				{/* Movies Grid */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<h2 className="text-2xl font-bold text-white mb-6">Movies</h2>

					{/* Check for API Key Issue */}
					{!isLoading && movies.length === 0 && (
						<div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-6 mb-6">
							<p className="text-yellow-400 text-lg font-semibold">
								⚠️ No movies found
							</p>
							<p className="text-yellow-200 mt-2">
								This usually means the TMDB API key is not configured.
							</p>
							<p className="text-yellow-200 mt-2">
								<strong>Fix:</strong> Add your free API key to{" "}
								<code className="bg-black px-2 py-1 rounded">
									src/services/tmdb.ts
								</code>{" "}
								line 193
							</p>
							<ol className="text-yellow-200 mt-4 ml-4 list-decimal space-y-1">
								<li>
									Get free key:{" "}
									<a
										href="https://www.themoviedb.org/settings/api"
										className="underline hover:text-white"
									>
										https://www.themoviedb.org/settings/api
									</a>
								</li>
								<li>Copy your 32-character API key</li>
								<li>Replace the placeholder in the file</li>
								<li>Refresh the page</li>
							</ol>
						</div>
					)}

					<MovieGrid movies={movies} isLoading={isLoading} />
				</motion.div>
			</div>

			{/* Footer CTA */}
			<motion.div
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
				viewport={{ once: true }}
				className="max-w-7xl mx-auto mt-16 text-center"
			>
				<button
					onClick={() => navigate("/recommend")}
					className="inline-block px-8 py-4 bg-netflix-red hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
				>
					Get Different Recommendations
				</button>
			</motion.div>
		</div>
	);
};

export default Results;
