/**
 * Results Page
 * Displays recommended movies and algorithm statistics
 */

import { FC, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import MovieGrid from "../components/MovieGrid";
import RecommendationStats from "../components/RecommendationStats";
import { Movie } from "../services/tmdb";
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

	const state = location.state as LocationState | undefined;

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);

				// Fetch TMDB genres
				const genres = await tmdbService.fetchGenres();

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
					onClick={() => navigate("/recommend")}
					className="text-netflix-gray hover:text-netflix-red transition-colors mb-6 flex items-center gap-2"
				>
					← New Recommendation
				</button>
				<h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
					Your Personalized Recommendations
				</h1>
				<p className="text-netflix-gray text-lg">
					{movies.length} movies matching your preferences
				</p>
			</motion.div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto">
				{/* Stats Section */}
				{state?.stats && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="mb-12"
					>
						<h2 className="text-2xl font-bold text-white mb-6">
							📊 Algorithm Performance
						</h2>
						<RecommendationStats {...state.stats} />
					</motion.div>
				)}

				{/* Movies Grid */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<h2 className="text-2xl font-bold text-white mb-6">🎬 Movies</h2>

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
