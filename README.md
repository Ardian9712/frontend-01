[![make.fun · makefun-frontend-01](https://make.fun/badge/makefun-frontend-01.svg)](https://make.fun/bounty/makefun-frontend-01?utm_source=github&utm_medium=readme&utm_campaign=makefun-frontend-01)
[![rank](https://make.fun/badge/makefun-frontend-01/Ardian9712/frontend-01/rank.svg)](https://make.fun/bounty/makefun-frontend-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=makefun-frontend-01)
[![reward](https://make.fun/badge/makefun-frontend-01/Ardian9712/frontend-01/reward.svg)](https://make.fun/bounty/makefun-frontend-01?utm_source=github&utm_medium=readme&utm_campaign=makefun-frontend-01)

# make.fun Frontend

Built for the [make.fun "Build the best make.fun frontend" bounty](https://make.fun/bounty/makefun-frontend-01) — referral code `p8atzycs`.

A fully working web client for make.fun, made of static files with no build step. It reads make.fun's public API and shows the live bounty board with each bounty's reward and live pot, a bounty's page with its rules and rewards, its leaderboard, and an account's public profile — each reachable by a link and by its own URL.

## Features

- Bounty board with search, filter, and sort
- Bounty page with rules and rewards
- Leaderboard with pagination (25 per page)
- Account public profile
- In-memory + sessionStorage cache with ETag revalidation and in-flight dedup
- First load: 6 files / 11,285 bytes gzip

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
