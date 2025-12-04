/**
 * OMDB API Service
 * Handles all API calls to Open Movie Database
 * Fetches movies and related data
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

interface OMDBMovie {
	imdbID: string;
	Title: string;
	Poster: string;
	Plot: string;
	Genre: string;
	Released: string;
	imdbRating: string;
	Type: string;
}

interface OMDBResponse {
	Search: OMDBMovie[];
	totalResults: string;
	Response: string;
	Error?: string;
}

class OMDBService {
	private api: AxiosInstance;
	private baseURL: string = "https://www.omdbapi.com";
	private apiKey: string;

	// Genre mapping for OMDB genres (simplified)
	private genreMap: GenreMap = {
		1: "Action",
		2: "Adventure",
		3: "Animation",
		4: "Comedy",
		5: "Crime",
		6: "Documentary",
		7: "Drama",
		8: "Family",
		9: "Fantasy",
		10: "Film-Noir",
		11: "History",
		12: "Horror",
		13: "Music",
		14: "Musical",
		15: "Mystery",
		16: "Romance",
		17: "Sci-Fi",
		18: "Short",
		19: "Sport",
		20: "Superhero",
		21: "Thriller",
		22: "War",
		23: "Western",
	};

	constructor(apiKey: string) {
		this.apiKey = apiKey;
		this.api = axios.create({
			baseURL: this.baseURL,
		});
	}

	/**
	 * Fetch genres (static for OMDB)
	 * @returns Promise<GenreMap> - Map of genre IDs to names
	 * @time O(1) - returns static data
	 */
	async fetchGenres(): Promise<GenreMap> {
		return this.genreMap;
	}

	/**
	 * Search movies by genre keywords
	 * @param genres - Array of genre names
	 * @param pageSize - Number of movies to fetch
	 * @returns Promise<Movie[]> - Array of movies
	 */
	async discoverMoviesByGenres(genreIds: number[], pageSize: number = 50): Promise<Movie[]> {
		try {
			// Map genre IDs to genre names
			const genreNames = genreIds.map((id) => this.genreMap[id]).filter(Boolean);

			if (genreNames.length === 0) {
				// Fallback to popular searches
				return this.getPopularMovies(pageSize);
			}

			const allMovies: Movie[] = [];
			const searchQueries = this.buildSearchQueries(genreNames);

			// Search with multiple relevant keywords
			for (const query of searchQueries) {
				if (allMovies.length >= pageSize) break;

				const response = await this.api.get<OMDBResponse>("", {
					params: {
						apikey: this.apiKey,
						s: query,
						type: "movie",
					},
				});

				if (response.data.Response === "True" && response.data.Search) {
					const movies = response.data.Search.map((movie: OMDBMovie) =>
						this.formatOMDBMovie(movie, genreNames)
					);

					// Filter movies that actually contain the requested genres
					const filteredMovies = movies.filter((movie) =>
						movie.genre_ids.some((id) => genreIds.includes(id))
					);

					allMovies.push(...filteredMovies);
				}
			}

			// If we still don't have enough movies, search by individual genres
			if (allMovies.length < pageSize) {
				for (const genre of genreNames) {
					if (allMovies.length >= pageSize) break;

					const response = await this.api.get<OMDBResponse>("", {
						params: {
							apikey: this.apiKey,
							s: genre,
							type: "movie",
						},
					});

					if (response.data.Response === "True" && response.data.Search) {
						const movies = response.data.Search.map((movie: OMDBMovie) =>
							this.formatOMDBMovie(movie, [genre])
						);

						// Only add if we don't have duplicates
						movies.forEach((movie) => {
							if (
								!allMovies.find((m) => m.id === movie.id) &&
								allMovies.length < pageSize
							) {
								allMovies.push(movie);
							}
						});
					}
				}
			}

			// Remove duplicates and limit
			const uniqueMovies = Array.from(
				new Map(allMovies.map((m) => [m.id, m])).values()
			).slice(0, pageSize);

			return uniqueMovies.filter((movie) => movie.poster_path && movie.overview);
		} catch (error) {
			console.error("❌ Error discovering movies:", error);
			return [];
		}
	}

	/**
	 * Search movies by title
	 * @param query - Search query
	 * @returns Promise<Movie[]> - Array of movies
	 */
	async searchMovies(query: string): Promise<Movie[]> {
		try {
			const response = await this.api.get<OMDBResponse>("", {
				params: {
					apikey: this.apiKey,
					s: query,
					type: "movie",
				},
			});

			if (response.data.Response === "True" && response.data.Search) {
				return response.data.Search.map((movie: OMDBMovie) => this.formatOMDBMovie(movie));
			}

			return [];
		} catch (error) {
			console.error("❌ Error searching movies:", error);
			return [];
		}
	}

	/**
	 * Get popular movies (search for common genres)
	 * @param pageSize - Number of movies to fetch
	 * @returns Promise<Movie[]> - Array of movies
	 */
	async getPopularMovies(pageSize: number = 50): Promise<Movie[]> {
		const popularGenres = ["Action", "Drama", "Comedy", "Thriller", "Adventure"];
		const allMovies: Movie[] = [];

		for (const genre of popularGenres) {
			try {
				const response = await this.api.get<OMDBResponse>("", {
					params: {
						apikey: this.apiKey,
						s: genre,
						type: "movie",
					},
				});

				if (response.data.Response === "True" && response.data.Search) {
					const movies = response.data.Search.map((movie: OMDBMovie) =>
						this.formatOMDBMovie(movie, [genre])
					);
					allMovies.push(...movies);

					if (allMovies.length >= pageSize) {
						break;
					}
				}
			} catch (error) {
				console.error(`Error searching for ${genre}:`, error);
			}
		}

		return allMovies.filter((movie) => movie.poster_path && movie.overview).slice(0, pageSize);
	}

	/**
	 * Get image URL for a poster
	 * @param posterPath - OMDB poster path
	 * @returns string - Full image URL
	 */
	getImageUrl(posterPath: string | null): string {
		if (!posterPath || posterPath === "N/A") {
			return "https://via.placeholder.com/500x750?text=No+Image";
		}
		return posterPath;
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
	 * Format OMDB movie data to standard format
	 * @param movie - Raw OMDB movie data
	 * @param preferredGenres - Genres to prioritize matching
	 * @returns Formatted movie object
	 */
	private formatOMDBMovie(movie: OMDBMovie, preferredGenres?: string[]): Movie {
		// Parse genres from comma-separated string
		const genreNames = movie.Genre ? movie.Genre.split(", ") : [];

		let genreIds = genreNames
			.map((name) => {
				return Object.entries(this.genreMap).find(([_, value]) => value === name)?.[0];
			})
			.filter(Boolean)
			.map(Number);

		// If we have preferred genres but no matches, try to match by name
		if (preferredGenres && genreIds.length === 0) {
			genreIds = preferredGenres
				.map((name) => {
					return Object.entries(this.genreMap).find(([_, value]) => value === name)?.[0];
				})
				.filter(Boolean)
				.map(Number);
		}

		return {
			id: movie.imdbID.hashCode(), // Simple hash of imdbID for unique number
			title: movie.Title,
			poster_path: movie.Poster !== "N/A" ? movie.Poster : null,
			overview: movie.Plot || "No description available",
			genre_ids: genreIds.length > 0 ? genreIds : [1], // Default to Action
			release_date: movie.Released || "Unknown",
			vote_average: parseFloat(movie.imdbRating) || 0,
		};
	}

	/**
	 * Build relevant search queries based on genres
	 * @param genres - Genre names
	 * @returns Array of search queries
	 */
	private buildSearchQueries(genres: string[]): string[] {
		const queries: string[] = [];

		// Genre-specific search keywords
		const genreKeywords: { [key: string]: string[] } = {
			Action: ["action", "fight", "mission", "combat"],
			Adventure: ["adventure", "quest", "explorer", "journey"],
			Animation: ["animated", "animation", "cartoon", "pixar"],
			Comedy: ["comedy", "funny", "hilarious", "humorous"],
			Crime: ["crime", "detective", "murder", "investigation"],
			Drama: ["drama", "emotional", "serious", "character"],
			Family: ["family", "kids", "children", "kid"],
			Fantasy: ["fantasy", "magic", "magical", "wizard"],
			Horror: ["horror", "scary", "terror", "ghost"],
			Romance: ["romance", "love", "romantic", "couple"],
			"Sci-Fi": ["scifi", "sci-fi", "future", "space", "robot"],
			Thriller: ["thriller", "suspense", "mystery", "tension"],
			Western: ["western", "cowboy", "outlaw", "gun"],
		};

		for (const genre of genres) {
			if (genreKeywords[genre]) {
				queries.push(...genreKeywords[genre]);
			} else {
				queries.push(genre);
			}
		}

		// Remove duplicates
		return [...new Set(queries)];
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

// Add hashCode method to String prototype for ID generation
declare global {
	interface String {
		hashCode(): number;
	}
}

String.prototype.hashCode = function (this: string): number {
	let hash = 0;
	for (let i = 0; i < this.length; i++) {
		const char = this.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash);
};

// Initialize with OMDB API key
const OMDB_API_KEY = "99a2a8e3";

export default new OMDBService(OMDB_API_KEY);
