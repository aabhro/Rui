# Contributing

Thanks for helping improve rbxui.

## Development principles

- Keep the application dependency-light. The editor is vanilla HTML, CSS and JavaScript.
- Preserve both root entry points, \`index.html\` and \`rbxui.html\`. They should load the shared files under \`assets/\`.
- Keep editor state and behavior in \`assets/js/editor.js\`, and visual rules in \`assets/css/editor.css\`.
- Avoid adding a build system or runtime dependency unless there is a clear need.
- Keep UI changes consistent with the existing low-contrast, near-black editor design.
- Do not silently change exported Luau behavior or the browser storage key.

## Before submitting a change

Run:

\`\`\`sh
npm run check
\`\`\`

For behavior changes, manually check the relevant path in a modern browser. In particular, test canvas rendering and resizing, property edits, undo/redo, saved projects and both export modes when those areas change.

## Pull requests

Describe the user-facing problem, the approach taken and the tests performed. Include screenshots for visible UI changes where practical. Keep commits focused and avoid unrelated formatting or generated files.

## Reporting an issue

Include browser and operating-system details, a short reproduction sequence, expected behavior and actual behavior. For console errors, include the full message and stack location.
