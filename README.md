# Draft Room — fantasy draft board (PWA)

Self-contained draft board for two leagues (redraft + dynasty). No build step,
works offline once installed, installs to your phone home screen.

## Files
- `index.html` ....... the whole app (HTML + CSS + JS)
- `data/redraft.json` . redraft rankings + league settings   <- edit to refresh
- `data/dynasty.json` . dynasty rankings + league settings   <- edit to refresh
- `manifest.webmanifest`, `sw.js`, `icons/` ... PWA plumbing

## Deploy to GitHub Pages
1. Create a new PUBLIC repo (e.g. `draft-board`).
2. Put these files in the repo ROOT (keep the `data/` and `icons/` folders).
3. Commit + push.
4. Repo → Settings → Pages → Build and deployment → Source: "Deploy from a
   branch" → Branch: `main` / `/ (root)` → Save.
5. Wait ~1 min. Site is live at  https://<your-username>.github.io/draft-board/
6. iPhone: open that URL in Safari → Share → "Add to Home Screen".
   It launches full-screen and keeps working with no signal.

## Refresh the rankings later
The app reads rankings from the two JSON files and always pulls the newest copy
when you're online (offline it uses the last cached copy). So:

1. Replace `data/redraft.json` and/or `data/dynasty.json` with updated files.
2. Commit + push.
3. Open the app while online — new rankings load automatically. (If a home-screen
   copy looks stale, delete and re-add it, or open the URL in Safari once online.)

You do NOT need to touch `sw.js` for a rankings refresh. Only bump
`SHELL_VERSION` in `sw.js` if you change `index.html` or the icons.

### JSON shape (if editing by hand)
```
{ "meta": { "label","tag","scoring","source","bench","starters":[...] },
  "players": [ { "rank":1, "name":"...", "pos":"RB", "team":"DET", "tier":1 }, ... ] }
```
`pos` must be QB / RB / WR / TE / DEF. Player IDs are derived from pos+name, so
in-progress draft marks survive a refresh for any player still on the list.
