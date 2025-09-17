# Portfolio OS

Desktop‑style portfolio inspired by Dustin Brett’s [daedalOS]. Built as a static site (no build step) for quick deploys to Vercel. The environment now ships with a persistent filesystem, animated wallpapers, multi-theme support, and a growing catalog of security-focused mini apps.

## Getting started

- Open `index.html` in a browser (or serve the folder with any static server) to try it locally.
- Deploy to Vercel: import this repo in Vercel, keep defaults. It will detect a static site and serve `index.html`.

## Structure

- `index.html` — desktop, taskbar, start menu containers
- `src/styles.css` — theme, layout, windows, taskbar, start menu
- `src/main.js` — window manager, bootstrapping, app wiring
- `src/apps/*.js` — individual app modules (About, Projects Hub, Terminal, EDR Viewer, Notes, Explorer, Settings, Wallpapers)
- `vercel.json` — static config and basic security headers

## Productivity & showcase apps

- IndexedDB-backed filesystem in `src/fs.js` powers the File Explorer and Notes apps
- File Explorer (`src/apps/explorer.js`) supports navigation, drag-and-drop, desktop integration, and soft-deletes
- Notes (`src/apps/notes.js`) handles quick capture via <kbd>Ctrl</kbd>+<kbd>N</kbd>, open-file events, and safe persistence
- Projects Hub (`src/apps/projects.js`) curates flagship demos and launches internal apps like the EDR Viewer and Security Terminal
- Security Terminal (`src/apps/terminal.js`) offers canned commands for help/about/scan/risks/contact scenarios
- EDR Viewer (`src/apps/edrViewer.js`) renders mock detection metrics with charts, coverage meters, and category summaries
- Wallpapers (`src/apps/wallpapers.js`) provides static and animated wallpaper presets with quick randomization controls

## Filesystem & productivity apps

- IndexedDB-backed filesystem in `src/fs.js` powers the File Explorer and Notes apps
- File Explorer (`src/apps/explorer.js`) supports navigation, drag-and-drop, and desktop integration
- Notes (`src/apps/notes.js`) loads `.txt/.md` files, auto-saves changes, and lists saved notes
- Desktop icons combine pinned apps with files stored in the `/Desktop` directory of the filesystem


## Roadmap (Phases)

1) MVP UI and window manager (done)
2) Content polish: real copy, project data (done)
3) Apps: Resume viewer, Settings with wallpapers (done)
4) Theming: wallpapers, color schemes, persistence (done)
5) Performance: lazy app loading, preloading assets (done)
6) Accessibility: keyboard interactions, focus traps, reduced motion
7) Integrations: contact form via serverless function, analytics

## Customization

- Update copy in `src/apps/about.js` and `src/apps/contact.js`.
- Replace project entries or links in `src/apps/projects.js`.
- Extend canned commands in `src/apps/terminal.js` or swap in your own data in `src/apps/edrViewer.js`.
- Tweak theme variables in `src/styles.css` (dark, light, and terminal green supported) or add new wallpaper presets in `src/apps/wallpapers.js`.

## License

This project is for your personal portfolio; it intentionally avoids copying code/assets from daedalOS and instead implements an original, inspired design.

[daedalOS]: https://github.com/DustinBrett/daedalOS
