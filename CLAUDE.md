# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server + Electron together (hot reload)
npm run build    # Build React to dist/, then package with electron-builder
npm run preview  # Preview the Vite build only (no Electron)
```

## Architecture

This is a frameless Electron desktop app using React + Vite.

**Two-process model:**
- `electron/main.js` — Main process. Creates a frameless, transparent window (420×620). Closing the window hides it instead of quitting; the app lives in the system tray. Listens for IPC events: `notify`, `window-minimize`, `window-close`.
- `electron/preload.js` — Exposes `window.electron` to the renderer via `contextBridge`: `notify(title, body)`, `minimize()`, `close()`.
- `src/` — Renderer process (React). All Electron APIs must go through `window.electron.*`.

**Dev vs production:**
- Dev: Electron loads `http://localhost:5173` (Vite dev server).
- Production: Electron loads `dist/index.html` (built by Vite).

**State lives entirely in `App.jsx`** — `settings`, `tasks`, and `view` are passed down as props. There is no global state library.

**IPC pattern:** Renderer calls `window.electron.notify(title, body)` → preload sends `ipcRenderer.send('notify', ...)` → main process handles with `ipcMain.on('notify', ...)` and shows a native `Notification`.
