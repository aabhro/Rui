# rbxui

A browser-based editor for building Roblox user interfaces. Design layouts visually, edit Roblox GUI instances and their properties, then export the result as Luau for Roblox Studio.

## Overview

rbxui is built with vanilla HTML, CSS and JavaScript. It has no bundler, framework or runtime backend.

### Features

- Visual canvas with drag, resize, zoom, canvas presets, alignment, grid and snap controls.
- Layer explorer for navigating, nesting, renaming, duplicating, deleting and reordering instances.
- Property inspector for Roblox GUI objects, text, colors, layout instances and constraints.
- Custom HSV color picker with HEX and RGB editing.
- Editable starter templates for common UI patterns.
- Undo and redo, browser-local project persistence, and keyboard shortcuts.
- Luau export as either a **LocalScript** or **Studio Command Bar** script.
- Text scaling preview and `UITextSizeConstraint` support.

## Get started

### Open the editor

Open [`index.html`](./index.html) in a modern browser, or serve the repository directory locally. A local server is usually the most reliable option for development:

```sh
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

The editor loads Geist from Google Fonts and Lucide icons from a CDN, so those visual assets require an internet connection. The editor itself does not require a build step or package installation.

### Check the project

Node.js is only needed for the repository's static validation script.

```sh
npm run check
```

This checks the JavaScript syntax, stylesheet delimiters, asset references and core document structure.

## Typical workflow

1. Add components from the layer panel or insert a starter template.
2. Select an item to edit its properties and appearance.
3. Arrange items on the canvas. Use the grid, snap and alignment tools to keep layouts consistent.
4. Open **Export** and choose **LocalScript** or **Studio Command Bar**.
5. Copy the generated Luau into Roblox Studio and verify it in the target experience.

The browser preview approximates Roblox UI behavior using web layout and styles. Always verify exported UI in Roblox Studio, especially where Roblox runtime behavior or device insets matter.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` or `Ctrl/Cmd + Y` | Redo |
| `Ctrl/Cmd + S` | Save the current project to browser storage |
| `Ctrl/Cmd + D` | Duplicate the selected layer |
| Arrow keys | Move the selected visual object |
| `Shift + Arrow` | Move by a larger step |
| `Delete` / `Backspace` | Delete the selected layer |
| `Escape` | Dismiss a menu or exit preview |

Arrow-key movement follows the current snap setting. Shortcuts that change the selected object are suppressed while editing a text field.

## Project structure

```text
rbxui/
├── index.html                  Main editor entry point
├── rbxui.html                  Alternate entry point for compatibility
├── assets/
│   ├── css/
│   │   └── editor.css          Editor styling and responsive layout
│   └── js/
│       └── editor.js           State, rendering, interactions and export
├── docs/
│   └── ARCHITECTURE.md         Implementation overview
├── scripts/
│   └── validate.mjs            Dependency-free static checks
├── .github/
│   └── workflows/
│       └── validate.yml        GitHub Actions validation
├── CONTRIBUTING.md
├── package.json
└── README.md
```

Both HTML entry points use the same stylesheet and JavaScript source. Make application changes in `assets/css/editor.css` and `assets/js/editor.js`, not in one entry point.

## Project storage and privacy

Project data is saved in the browser's `localStorage` under `rbxui.project.v1`. It is local to the browser profile and origin. It does not sync between browsers or devices. Export a Luau script and keep separate project backups when you need a portable copy of your work.

## Current scope

rbxui is an actively developed editor, not a replacement for Roblox Studio's runtime. Some Roblox properties, layouts and behaviors have no exact browser equivalent. Unsupported export properties may be skipped or differ from Studio behavior.

## License

This repository currently has no `LICENSE` file. Add an explicit license before granting others permission to reuse or redistribute the project.
