# BridgeBeat

The Spotify cleanup & management tool for everything the official app won't show you.

Spotify doesn't tell you which artists you follow but never actually listen to, doesn't flag
duplicate or dead tracks in your playlists, doesn't warn you when a playlist quietly changes,
and gives you no bulk actions at all. BridgeBeat is a focused, Spotify-only tool for exactly
that kind of library cleanup.

## Status

Alpha / rework in progress. This is a from-scratch rebuild of an earlier version of the app -
see [Architecture](#architecture) for what changed and why.

## Feature roadmap

**v1**
- **Backups** - snapshot your playlists locally, diff against the last snapshot, restore what changed
- **Ghost Follows** - artists you follow but haven't shown up in your recent listening history
- **Duplicates** - repeated tracks (including different versions) and dead/region-locked tracks
- **Overlap Finder** - near-duplicate playlists worth merging
- **Bulk Actions** - multi-select unfollow / unlike / remove
- **Timeline** - a unified feed of everything added across all your playlists
- **Playlists** - a working playlist browser/editor (search, add, reorder, delete)

**Later**
- Smart sort by audio features (energy, tempo, danceability)
- Genre / decade breakdowns of your library
- Server-backed scheduled snapshots (catch changes even when you're not in the app)
- Cross-platform sync (Apple Music, YouTube Music, etc.)

## Architecture

BridgeBeat is a single static site - there is no backend server.

- **Client:** React + Vite, Tailwind CSS
- **Auth:** Spotify's [Authorization Code with PKCE](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow) flow, entirely in the browser - no client secret to hold or leak
- **Data:** read and written directly against the Spotify Web API from the browser, live - no caching layer
- **Storage:** playlist snapshots (for the Backups feature) are stored locally per-browser via IndexedDB - nothing is ever sent to a server, and history doesn't sync across devices/browsers

An earlier version of this project used an Express server purely to proxy the OAuth token
exchange. PKCE removes the need for that entirely, which is why it's gone.

## Live deployment

Hosted on Vercel at [noterebirth.vercel.app](https://noterebirth.vercel.app), building straight
from `trunk`.

## Setup (local dev)

1. Create an app at the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard),
   or use the existing one for this project.
2. Add `http://127.0.0.1:5173/callback` as a Redirect URI in the app settings.
3. Copy `.env.example` to `.env` and fill in your values:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
   ```
4. Install and run:
   ```
   npm install
   npm run dev
   ```

## Deploying

`npm run build` produces a static `dist/` folder deployable anywhere (Netlify, Vercel, GitHub
Pages, etc.). Because this is a client-side-routed single-page app, your host needs to rewrite
all paths to `index.html`:
- Netlify: handled by the included `public/_redirects`
- Vercel: handled by the included `vercel.json`
- Other hosts: check their docs for an SPA/history-mode fallback

The Spotify Client ID is baked in as a build-time fallback (it's not a secret for a PKCE public
client - it's visible in the login redirect regardless), so no environment variables are
strictly required on the host. Set `VITE_SPOTIFY_CLIENT_ID` on the host instead if you want to
point a deployment at a different Spotify app.

The redirect URI is derived automatically from the deployed origin (`https://your-domain/callback`),
so it doesn't need to be configured either - just make sure that exact `/callback` URL for your
production domain is added as a Redirect URI in the Spotify Dashboard.

## License

See [LICENSE](./LICENSE).
