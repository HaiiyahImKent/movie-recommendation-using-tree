# CinePath Final Project Presentation Guide (15 Minutes)

Goal: Showcase how Data Structures and Algorithms power accurate, pure-genre movie recommendations using TMDB.

## Timeline (15:00 total)

-   0:00–0:45 — Welcome + Team intro (names, roles)
-   0:45–2:00 — Problem + Solution overview (misaligned search → DS/Algo-powered recommendations)
-   2:00–4:00 — Architecture overview (React+TS, Decision Tree, TMDB service, genreQuery)
-   4:00–8:00 — Live demo (2 flows: Comedy-only, Thriller-only; show strict purity)
-   8:00–10:00 — Deep dive (Data Structures & Algorithms)
-   10:00–12:00 — Accuracy & UX improvements (strict queries, ranking, UI changes)
-   12:00–13:00 — Limitations & next steps
-   13:00–14:30 — Q&A (prepared answers)
-   14:30–15:00 — Closing (key takeaways, invite to repo)

## Narrative

-   Problem: Genre mismatches and noisy results.
-   Insight: Encode user intent via a binary Decision Tree; query TMDB using strict parameters; rank client-side.
-   Outcome: Pure genre results (e.g., thriller-only, comedy-only), cleaner UI, measurable performance.

## Demo Script (Live)

-   Precondition: TMDB API key set; app running.
-   Flow A: Comedy-only
    -   Answer path that yields `recommendedGenres: [35]`.
    -   Show Results page: strict Comedy query; only Comedy genre IDs; ranking favors comedy.
-   Flow B: Thriller-only
    -   Answer path that yields `recommendedGenres: [53]`.
    -   Show Results page: strict Thriller query; only Thriller; no Action leakage.
-   Showcase new stats panel: Selected Genres + Movie Count.

## Data Structures & Algorithms

-   Binary Decision Tree
    -   Purpose: Encode intent across 10–15 questions; DFS traversal `$O(h)$` space/time.
    -   Purity fixes: Thriller-first branches; removed unintended genre leakage.
-   BFS Question Listing
    -   Purpose: Build UI question list; compare theoretical BFS depth to actual tree height.
-   Stack (Undo)
    -   Purpose: Let users backtrack answers (not shown if excluded from UI).
-   genreQuery utility
    -   `buildQueryFromGenres`: primary `with_genres`, computed `without_genres` for conflicts.
    -   Strict-only helpers: Comedy, Thriller, Action, Romance.
-   Ranking function
    -   `scoreMovieGenres`: primary +3, secondaries +1 → sort descending.

## Accuracy & UX Improvements

-   Strict discover queries (Comedy-only, Thriller-only, etc.).
-   Ranking by closeness to intended genres.
-   Removed star ratings; clearer content-first cards.
-   New stats panel: Selected Genres + Movie Count instead of DFS vs BFS.

## Limitations & Next Steps

-   TMDB catalog variance; genre tagging imperfections.
-   Extend strict-only to Drama/Horror.
-   Add unit tests for ranking and query exclusions.
-   Move API key to environment variables.

## Q&A Prep

-   Why a Decision Tree? Deterministic mapping from answers to genre intent.
-   Why TMDB over OMDB? Richer discover API with genre filters; better images/metadata.
-   How do you ensure genre purity? Strict `with_genres` + `without_genres`, and client ranking.
-   Complexity: DFS traversal `$O(h)$`, BFS listing `$O(n)$`; service calls `$O(1)$` per page.

## Roles

-   Lead Presenter: Problem/Solution + Demo narration.
-   Tech Explainer: DS/Algo deep dive.
-   Demo Driver: Operates app, keeps pace.
-   QA Specialist: Field questions and constraints.

## Contingency

-   If API rate limits: switch flows; show cached screenshots.
-   If TMDB slow: reduce page size to 20; show Popular fallback.

## Closing

-   Reiterate: DS/Algo drive accurate recommendations; pure genre outputs; clean UX.
-   Thank the audience; share repo link; invite questions.
