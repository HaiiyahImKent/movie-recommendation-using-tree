# Team Roles, Responsibilities, and Presentation Plan

This document clarifies who does what (development, docs, PPT), who owns each data structure/algorithm, and the exact presentation order. Goal: keep focus on the whole system while ensuring depth on assigned sections.

## Team Assignments

-   Kent — Developer (Lead Engineering)
-   Resty — Documentation (Lead Docs)
-   Dwayne — PPT (Lead Slides/Design)
-   Kurt — QA & Demo Driver (Lead Demo & Contingency)

## Workstreams & Ownership

### 1) Application & Architecture (Kent + Kurt)

-   Kent: Owns codebase changes, ensures TMDB integration, strict genre queries, ranking, and DecisionTree correctness.
-   Kurt: Verifies flows end-to-end, prepares demo states, monitors timing and fallbacks.

### 2) Documentation (Resty)

-   Produces `README.md`, `ALGORITHMS.md`, `PRESENTATION_GUIDE.md`, `RATING_SHEET.md`, `TEAM_ROLES.md`.
-   Ensures formatting consistency and professional tone; aligns slides with doc content.

### 3) Slides (Dwayne)

-   Builds Canva deck following docs; highlights architecture, DS/Algo, demo script, and rubric coverage.
-   Keeps typography readable, visuals aligned; exports backup PDF.

## Algorithms & Components Ownership

-   Decision Tree (Binary, DFS traversal): Kent
    -   Intent mapping, thriller/comedy purity, deeper paths, bug fixes
-   BFS Question Listing: Kent
    -   `getAllQuestions()`, theoretical BFS depth comparison
-   Stack (Undo navigation): Kent (optional in UI)
-   TMDB Service + Utilities: Kent
    -   `tmdb.ts`, strict-only query builders (Comedy, Thriller, Action, Romance), `scoreMovieGenres`
-   QA & Demo Scenarios: Kurt
    -   Comedy-only, Thriller-only flows, fallback popular, contingency screenshots
-   Documentation & Visual Story: Resty & Dwayne
    -   DS/Algo narrative, complexity notes, architecture visuals

## Presentation Roles & Sequence (15 Minutes)

0:00–0:45 — Opening (Lead Presenter: Kent)

-   Welcome, team intro; set the problem statement (genre mismatch).

0:45–2:00 — Solution Overview (Kent)

-   System summary: Decision Tree → genre intent → strict TMDB queries → ranking.

2:00–4:00 — Architecture (Kent, support: Dwayne)

-   Components: React+TS, `DecisionTree.ts`, `genreQuery.ts`, `tmdb.ts`, `Results.tsx`.
-   Data flow diagram on slide.

4:00–8:00 — Live Demo (Demo Driver: Kurt; Narration: Kent)

-   Flow A: Comedy-only path; show pure results.
-   Flow B: Thriller-only path; show purity and ranking.
-   New stats panel: Selected Genres + Movie Count.
-   Contingency: screenshots if API slows.

8:00–10:00 — Data Structures & Algorithms Deep Dive (Tech Explainer: Kent)

-   Decision Tree: DFS `$O(h)$` traversal; intent purity fixes.
-   BFS listing: UI question list; theoretical vs. actual depth.
-   genreQuery strict-only builders and ranking function.

10:00–12:00 — Documentation + Slides Quality (Resty + Dwayne)

-   Show alignment between docs and slides, formatting choices, visuals, professionalism.

12:00–13:00 — Limitations & Next Steps (Kent)

-   Extend strict-only to Drama/Horror, add tests, env keys.

13:00–14:30 — Q&A (All)

-   Kent: technical DS/Algo and integrations.
-   Kurt: demo/constraints and resilience.
-   Resty: documentation scope and sources.
-   Dwayne: slide design choices and clarity.

14:30–15:00 — Closing (Kent)

-   Key takeaways; thank you; share repo link.

## Preparation Checklist per Role

-   Kent: Validate answer paths; confirm TMDB key; run `npm run build` & `npm run dev`.
-   Resty: Proofread docs; ensure references; align headings.
-   Dwayne: Finalize slides; export PDF; visuals match doc.
-   Kurt: Demo rehearsal; prepare screenshots; time signals.

## Contingencies

-   API rate limit → Use screenshots; reduce page size to 20.
-   No movies found → Highlight in-app guidance; confirm API key.
-   Time overrun → Skip secondary demo; jump to Q&A.
