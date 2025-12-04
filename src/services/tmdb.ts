/**
 * TMDB API Service
 * Handles all API calls to The Movie Database
 * Fetches movies, genres, and related data
 */

import axios, { AxiosInstance } from "axios";

export interface Movie {
	id: number;
	title: string;
	poster_path: string | null;
	overview: string;
	genre_ids: number[];
	release_date: string;
	vote_average: number;
}

export interface Genre {
	id: number;
	name: string;
}

export interface GenreMap {
	[key: number]: string;
}

class TMDBService {
	private api: AxiosInstance;
	private baseURL: string = "https://api.themoviedb.org/3";
	private imageBaseURL: string = "https://image.tmdb.org/t/p/w500";

	constructor(apiKey: string) {
		// Using the free TMDB API key - in production, use environment variables
		this.api = axios.create({
			baseURL: this.baseURL,
			params: {
				api_key: apiKey,
			},
		});
	}

	/**
	 * Fetch genres from TMDB
	 * @returns Promise<GenreMap> - Map of genre IDs to names
	 * @time O(1) - single API call
	 */
	async fetchGenres(): Promise<GenreMap> {
		const genreMap: GenreMap = {};
		try {
			const response = await this.api.get<{ genres: Genre[] }>("/genre/movie/list");
			response.data.genres.forEach((genre) => {
				genreMap[genre.id] = genre.name;
			});
		} catch (error) {
			console.error("Error fetching genres:", error);
		}
		return genreMap;
	}

	/**
	 * Discover movies by genre IDs
	 * @param genreIds - Array of TMDB genre IDs
	 * @param pageSize - Number of movies to fetch
	 * @returns Promise<Movie[]> - Array of movies
	 * @time O(1) - single API call
	 */
	async discoverMoviesByGenres(genreIds: number[], pageSize: number = 50): Promise<Movie[]> {
		try {
			// Check if API key is set
			if (
				!this.api.defaults.params?.api_key ||
				this.api.defaults.params.api_key === "1234567890abcdef1234567890abcdef"
			) {
				console.warn(
					"⚠️ TMDB API Key not configured! Please add your API key to src/services/tmdb.ts line 193"
				);
				return [];
			}

			// TMDB limits requests, so we paginate intelligently
			const genreString = genreIds.join(",");
			const moviesPerPage = 20;
			const pages = Math.ceil(pageSize / moviesPerPage);
			const allMovies: Movie[] = [];

			for (let page = 1; page <= pages && allMovies.length < pageSize; page++) {
				const response = await this.api.get<{
					results: Movie[];
					total_pages: number;
				}>("/discover/movie", {
					params: {
						with_genres: genreString,
						sort_by: "popularity.desc",
						page,
						include_adult: false,
						language: "en-US",
					},
				});

				allMovies.push(...response.data.results.slice(0, pageSize - allMovies.length));
			}

			return allMovies.filter((movie) => movie.poster_path && movie.overview);
		} catch (error) {
			console.error("❌ Error discovering movies:", error);
			return [];
		}
	}

	/**
	 * Discover movies using raw TMDB discover params (supports with_genres/without_genres)
	 * @param params - TMDB discover parameters
	 * @param pageSize - Number of movies to fetch
	 */
	async discoverMovies(params: Record<string, string>, pageSize: number = 50): Promise<Movie[]> {
		try {
			if (
				!this.api.defaults.params?.api_key ||
				this.api.defaults.params.api_key === "1234567890abcdef1234567890abcdef"
			) {
				console.warn(
					"⚠️ TMDB API Key not configured! Please add your API key to src/services/tmdb.ts line 193"
				);
				return [];
			}

			const moviesPerPage = 20;
			const pages = Math.ceil(pageSize / moviesPerPage);
			const allMovies: Movie[] = [];

			for (let page = 1; page <= pages && allMovies.length < pageSize; page++) {
				const response = await this.api.get<{ results: Movie[]; total_pages: number }>(
					"/discover/movie",
					{
						params: {
							...params,
							sort_by: params.sort_by || "popularity.desc",
							page,
							include_adult: false,
							language: "en-US",
						},
					}
				);

				allMovies.push(...response.data.results.slice(0, pageSize - allMovies.length));
			}

			return allMovies.filter((movie) => movie.poster_path && movie.overview);
		} catch (error) {
			console.error("❌ Error discovering movies:", error);
			return [];
		}
	}

	/**
	 * Search movies by title
	 * @param query - Search query string
	 * @returns Promise<Movie[]> - Array of matching movies
	 * @time O(1) - single API call
	 */
	async searchMovies(query: string): Promise<Movie[]> {
		try {
			const response = await this.api.get<{ results: Movie[] }>("/search/movie", {
				params: {
					query,
					include_adult: false,
					language: "en-US",
				},
			});

			return response.data.results.filter((movie) => movie.poster_path && movie.overview);
		} catch (error) {
			console.error("Error searching movies:", error);
			return [];
		}
	}

	/**
	 * Get popular movies
	 * @param pageSize - Number of movies to fetch
	 * @returns Promise<Movie[]> - Array of popular movies
	 * @time O(1) - single API call
	 */
	async getPopularMovies(pageSize: number = 50): Promise<Movie[]> {
		try {
			const moviesPerPage = 20;
			const pages = Math.ceil(pageSize / moviesPerPage);
			const allMovies: Movie[] = [];

			for (let page = 1; page <= pages && allMovies.length < pageSize; page++) {
				const response = await this.api.get<{ results: Movie[] }>("/movie/popular", {
					params: {
						language: "en-US",
						page,
					},
				});

				allMovies.push(...response.data.results.slice(0, pageSize - allMovies.length));
			}

			return allMovies.filter((movie) => movie.poster_path && movie.overview);
		} catch (error) {
			console.error("Error fetching popular movies:", error);
			return [];
		}
	}

	/**
	 * Get image URL for a poster path
	 * @param posterPath - TMDB poster path
	 * @returns string - Full image URL
	 */
	getImageUrl(posterPath: string | null): string {
		if (!posterPath) {
			return "https://via.placeholder.com/500x750?text=No+Image";
		}
		return `${this.imageBaseURL}${posterPath}`;
	}

	/**
	 * Get Netflix search URL for a movie
	 * @param title - Movie title
	 * @returns string - Netflix search URL
	 */
	getNetflixSearchUrl(title: string): string {
		const encodedTitle = encodeURIComponent(title);
		return `https://www.netflix.com/search?q=${encodedTitle}`;
	}

	/**
	 * Format movie data for display
	 * @param movie - Raw movie data
	 * @param genreMap - Genre ID to name mapping
	 * @returns Formatted movie object
	 */
	formatMovie(movie: Movie, genreMap: GenreMap): object {
		return {
			...movie,
			image: this.getImageUrl(movie.poster_path),
			genreNames: movie.genre_ids.map((id) => genreMap[id]).filter(Boolean),
			netflixUrl: this.getNetflixSearchUrl(movie.title),
			displayYear: movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A",
		};
	}
}

// Initialize with your TMDB API key (get one free at https://www.themoviedb.org/settings/api)
// In production, move this to environment variables
const TMDB_API_KEY = "26735307eb2d16b886372a6078d13594"; // Inserted user-provided TMDB API key

export default new TMDBService(TMDB_API_KEY);
