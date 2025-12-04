// Utility to build accurate TMDB query params from DecisionTree results
// Focus: treat first genre as MUST match, optionally exclude opposite moods

export type GenreId = number;

interface QueryOptions {
	sortBy?: string; // e.g., "popularity.desc"
	page?: number;
}

export function buildQueryFromGenres(recommendedGenres: GenreId[], opts: QueryOptions = {}) {
	const [primary, ...secondary] = recommendedGenres;
	const params: Record<string, string> = {};

	// Always require the primary genre
	params.with_genres = String(primary);

	// Exclusions for clearer intent
	const exclude: GenreId[] = [];

	const isThrillerOnly = primary === 53;
	const isActionOnly =
		primary === 28 &&
		!secondary.includes(35) &&
		!secondary.includes(12) &&
		!secondary.includes(80);
	const isComedyOnly =
		primary === 35 &&
		!secondary.includes(10749) &&
		!secondary.includes(10751) &&
		!secondary.includes(16);

	if (isThrillerOnly) {
		// Remove light genres when tension is the goal
		exclude.push(35, 10751, 16);
	}

	if (isActionOnly) {
		// Keep action serious; avoid family/animation by default
		exclude.push(10751, 16);
	}

	if (isComedyOnly) {
		// Pure comedy: avoid heavy drama/romance by default
		exclude.push(18, 10749);
	}

	if (exclude.length) {
		params.without_genres = exclude.join(",");
	}

	// Optional sorting and paging
	if (opts.sortBy) params.sort_by = opts.sortBy;
	if (opts.page) params.page = String(opts.page);

	return params;
}

// Local ranking helper: prioritize movies matching primary + more secondary genres
export function scoreMovieGenres(movieGenres: GenreId[], recommended: GenreId[]): number {
	const [primary, ...secondary] = recommended;
	let score = 0;
	if (movieGenres.includes(primary)) score += 3;
	for (const g of secondary) if (movieGenres.includes(g)) score += 1;
	return score;
}

// Strong helper specifically for comedy-only intent
// Ensures with_genres=35 and excludes a broad set of non-comedy genres
export function buildComedyOnlyQuery(opts: QueryOptions = {}) {
	const params: Record<string, string> = {};
	params.with_genres = "35"; // Comedy
	// Exclude heavy/serious/opposite-tone genres to keep results purely comedic
	const exclude = [
		18, // Drama
		10749, // Romance
		53, // Thriller
		27, // Horror
		80, // Crime
		28, // Action
		14, // Fantasy
		12, // Adventure
		878, // Sci-Fi
		10402, // Music
		99, // Documentary
		36, // History
		9648, // Mystery
		10752, // War
	];
	params.without_genres = exclude.join(",");
	if (opts.sortBy) params.sort_by = opts.sortBy;
	if (opts.page) params.page = String(opts.page);
	return params;
}

// Strong helper for thriller-only intent
// Ensures with_genres=53 and excludes light/comedic/family-oriented genres
export function buildThrillerOnlyQuery(opts: QueryOptions = {}) {
	const params: Record<string, string> = {};
	params.with_genres = "53"; // Thriller
	const exclude = [
		35, // Comedy
		10751, // Family
		16, // Animation
		10402, // Music
		12, // Adventure (often light)
		14, // Fantasy
		36, // History (non-thriller tone)
		99, // Documentary
		10749, // Romance
	];
	params.without_genres = exclude.join(",");
	if (opts.sortBy) params.sort_by = opts.sortBy;
	if (opts.page) params.page = String(opts.page);
	return params;
}

// Strong helper for action-only intent
// Ensures with_genres=28 and excludes family/animation and heavy non-action dramatic mixes
export function buildActionOnlyQuery(opts: QueryOptions = {}) {
	const params: Record<string, string> = {};
	params.with_genres = "28"; // Action
	const exclude = [
		10751, // Family
		16, // Animation
		35, // Comedy (unless explicitly asked elsewhere)
		18, // Drama
		10749, // Romance
		10402, // Music
	];
	params.without_genres = exclude.join(",");
	if (opts.sortBy) params.sort_by = opts.sortBy;
	if (opts.page) params.page = String(opts.page);
	return params;
}

// Strong helper for romance-only intent
// Ensures with_genres=10749 and excludes heavy thriller/horror/action/crime
export function buildRomanceOnlyQuery(opts: QueryOptions = {}) {
	const params: Record<string, string> = {};
	params.with_genres = "10749"; // Romance
	const exclude = [
		53, // Thriller
		27, // Horror
		28, // Action
		80, // Crime
		878, // Sci-Fi
		9648, // Mystery
		10752, // War
	];
	params.without_genres = exclude.join(",");
	if (opts.sortBy) params.sort_by = opts.sortBy;
	if (opts.page) params.page = String(opts.page);
	return params;
}
