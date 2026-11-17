[![make.fun · makefun-frontend-01](https://make.fun/badge/makefun-frontend-01.svg)](https://make.fun/bounty/makefun-frontend-01?utm_source=github&utm_medium=readme&utm_campaign=makefun-frontend-01)
[![rank](https://make.fun/badge/makefun-frontend-01/Ardian9712/frontend-01/rank.svg)](https://make.fun/bounty/makefun-frontend-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=makefun-frontend-01)
[![reward](https://make.fun/badge/makefun-frontend-01/Ardian9712/frontend-01/reward.svg)](https://make.fun/bounty/makefun-frontend-01?utm_source=github&utm_medium=readme&utm_campaign=makefun-frontend-01)

# make.fun Frontend

Built for the [make.fun "Build the best make.fun frontend" bounty](https://make.fun/bounty/makefun-frontend-01) — referral code `p8atzycs`.

A fully working web client for make.fun, made of static files with no build step. It reads make.fun's public API and shows the live bounty board with each bounty's reward and live pot, a bounty's page with its rules and rewards, its leaderboard, and an account's public profile — each reachable by a link and by its own URL.

## Features

- Dense split-view bounty board with search, deadline filters, sort, selected challenge, and top-five leaderboard
- Bounty page with rules and rewards
- Leaderboard with instant builder/solution filtering and pagination (25 per page)
- Account public profile
- In-memory + sessionStorage cache with 15-second freshness, ETag revalidation, in-flight dedup, and stale-data fallback
- Actual API request counter, update age, manual refresh, and 60-second refresh while visible
- First load: 2 files / 7,515 bytes gzip-9 (21,060 bytes raw); secondary views and their styles load on demand

## Run

```sh
node serve.ts
```

Then open http://localhost:8080. (`node serve.ts --port <n>` for another port.)

## Build the dossier

```sh
node main.ts
```

This copies `app/` and `screenshots/` to the output directory and writes `dossier.json` via the vendored `vendor/makefun-frontend.ts`.

## Rebuild verification (17 November 2026)

The dossier builds with `MAKEFUN_OUTPUT_DIR=./out node main.ts` and contains exactly three JPEGs. Syntax checks and fixture-based Node VM checks passed for caching, ETag/304, deduplication, request counting, stale fallback/recovery, deadline states, the split view, all four route renderers, empty search, failed refresh, and hidden/visible polling. These are not browser or live-data checks. The first-load minimum of below 10 KB is met; the 3 KB target is not met.

The screenshots were recaptured on 17 November 2026 (15:52 WIB) from live API data and the dossier was regenerated at the same time: 1-board.jpg (111,187 bytes), 2-bounty.jpg (117,461 bytes), 3-leaderboard.jpg (87,274 bytes). `shots.json` now targets `#/`, `#/bounty/makefun-frontend-01`, and `#/bounty/makefun-frontend-01/leaderboard`. The third target uses the permitted leaderboard fallback because no real profile could be verified in this environment.

The build sandbox rejects localhost listening (`listen EPERM`) and Chromium launch (`Operation not permitted`), so the recapture ran with full local access and seeded live API data. The client requests `/competitions?activity=times` without a status filter and classifies returned competitions by deadline; search and sorting operate on the selected subset.
