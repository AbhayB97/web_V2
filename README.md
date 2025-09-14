# Portfolio OS

Desktop‑style portfolio inspired by Dustin Brett’s [daedalOS]. Built as a static site (no build step) for quick deploys to Vercel. This is Phase 1: the scaffold, window manager, and three core apps (About, Projects, Contact).

## Getting started

- Open `index.html` in a browser (or serve the folder with any static server) to try it locally.
- Deploy to Vercel: import this repo in Vercel, keep defaults. It will detect a static site and serve `index.html`.

## Structure

- `index.html` — desktop, taskbar, start menu containers
- `src/styles.css` — theme, layout, windows, taskbar, start menu
- `src/main.js` — window manager, bootstrapping, app wiring
- `src/apps/*.js` — individual app modules (About, Projects, Contact)
- `vercel.json` — static config and basic security headers

## Roadmap (Phases)

1) MVP UI and window manager (done)
2) Content polish: real copy, project data (done)
3) Apps: Resume viewer, Settings with wallpapers (done)
4) Theming: wallpapers, color schemes, persistence (done)
5) Performance: lazy app loading, preloading assets
6) Accessibility: keyboard interactions, focus traps, reduced motion
7) Integrations: contact form via serverless function, analytics

## Customization

- Update copy in `src/apps/about.js` and `src/apps/contact.js`.
- Replace placeholder project items in `src/apps/projects.js`.
- Tweak theme variables in `src/styles.css` (dark/light supported).

## License

This project is for your personal portfolio; it intentionally avoids copying code/assets from daedalOS and instead implements an original, inspired design.

[daedalOS]: https://github.com/DustinBrett/daedalOS
