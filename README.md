# 🎛️ Producer Life

A browser-based **music producer career simulator** — start as an unknown bedroom producer, release tracks, gain streams, sign label deals, and climb to legendary status. A mix of idle game, career sim, management game, and RPG.

## Quick Start

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
```

## Tech Stack

- **TypeScript + React 19 + Vite**
- **Tailwind CSS 4** (glassmorphism dark UI)
- **Framer Motion** (level-ups, viral alerts, animated counters, chart draws)
- **LocalStorage** persistence — no backend needed

## Features

- **Career creation** — name, age, home city, favorite genre, guided tutorial
- **Music creation** — 12 genres with monthly trend multipliers, BPM/key/type choices, production time and marketing budget trade-offs
- **Song quality engine** — production/mix/master/songwriting sub-scores driven by skills, gear, energy, creativity, genre familiarity, and luck
- **Streaming simulation** — every in-game day each released song earns streams from reach, quality, trends, hype, playlists, labels, collabs, and decay curves with a superfan floor
- **Viral system** — TikTok virals, algorithm pushes, celebrity shares… with 2×–50× multipliers and dramatic alerts
- **Economy** — ~$0.003/stream royalties, opportunity gigs (beats, ghost production, festivals, sync licensing), label advances and splits
- **Studio & plugin store** — 16 equipment upgrades across 6 tiers plus 12 fictional plugins, all with real stat bonuses
- **Career systems** — random opportunities with risk/reward, label contracts (Small/Medium/Major), collaborations across 6 artist fame tiers
- **Global Top 100 chart** — weekly updates, your songs vs. procedurally generated competition
- **Spotify-style analytics** — animated graphs, top songs, top countries, monthly listeners
- **Social media** — TuneTok / SoundGram / MusicTube posting with follower growth and hype
- **Random events** — laptop crashes, beat buyout offers, producer beef, copyright disputes… many with meaningful choices
- **Progression** — 50+ producer levels with titles and unlocks, 55 achievements, trophy room awards, Gold/Platinum/Diamond certifications, daily tasks
- **Prestige mode** — at Level 50, restart with permanent stacking bonuses
- **Save system** — auto-save, manual save, export/import codes, career reset

## Architecture

```
src/
├── types.ts               # All shared TypeScript interfaces
├── data/                  # Static content + procedural generators
│   ├── levels.ts          # 50+ level titles, XP curve, unlocks
│   ├── genres.ts          # Genres, BPM ranges, keys, countries
│   ├── names.ts           # Song/artist/news name generation (no AI APIs)
│   ├── equipment.ts       # Studio gear + tiers
│   ├── plugins.ts         # Plugin store
│   ├── labels.ts          # Label offer generation
│   ├── artists.ts         # Collab artist generation
│   ├── opportunities.ts   # Career gig templates
│   ├── events.ts          # Random event templates with choices
│   ├── playlists.ts       # Playlists + viral event types
│   └── achievements.ts    # Achievements + awards
├── systems/               # Pure game logic (UI-independent)
│   ├── engine.ts          # Day simulation, XP/leveling, tasks, news
│   ├── quality.ts         # Song quality calculation + gear bonuses
│   ├── streaming.ts       # Daily stream simulation, virals, royalties
│   ├── charts.ts          # Global Top 100 generation
│   ├── save.ts            # LocalStorage save/load/export/import
│   └── format.ts          # Number/date formatting
├── state/
│   ├── reducer.ts         # All player actions (single reducer)
│   └── GameContext.tsx    # React context + auto-save
└── components/            # UI pages + overlays
```

Game logic lives entirely in `systems/` and `state/reducer.ts` as pure functions over a single `GameState` — a backend, accounts, cloud saves, or multiplayer can be layered on later without touching the simulation.
