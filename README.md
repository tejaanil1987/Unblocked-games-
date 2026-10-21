# Nexus Arcade - Unblocked Games Hub

A modern, fast, responsive unblocked games portal running entirely in client-side HTML, CSS, and JavaScript.

## Features

- **JSON-Powered IFRAME Catalog**: Games are cataloged in `src/data/games.json` and rendered in sandboxed iframes.
- **Built-in HTML5 Arcade Classics**:
  - Galaxy Invaders 1984
  - 2048 Deluxe
  - Cyber Dino Runner
  - Retro Snake 97
  - Brick Breaker DX
  - Neon Pong Arena
  - Falling Tetro Blocks
  - Connect Four Master
  - Minesweeper Retro
  - Flappy Pixel Wings
  - Speed Sudoku Daily
- **Instant Search & Filters**: Search by title, tags, or category with real-time feedback and the `/` keyboard shortcut.
- **Dark Mode & Light Mode**: Seamless theme switching with local storage persistence.
- **Custom Game Importer**: Add any web game via `<iframe>` embed code or direct URL.
- **Theater & Fullscreen Mode**: Expand player viewport or enter native browser fullscreen.
- **Panic / Stealth Disguise**: Instant Google Classroom disguise overlay triggered by hotkey `[` or toolbar button.
- **About:Blank Cloaking**: Open games in an unblocked `about:blank` tab disguised as Google Drive.

## Tech Stack

- **Frontend**: React 19, JavaScript (ES2022 / JSX)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Build Tool**: Vite 6

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
