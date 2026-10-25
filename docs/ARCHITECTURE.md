# Architecture

## Runtime model

rbxui is a static browser application. It has no server-side component and no build step. The HTML entry points load a shared stylesheet, a classic JavaScript file and the external Lucide icon library.

## Source map

- \`index.html\`: primary document shell and stable entry point.
- \`rbxui.html\`: alternate entry point kept for compatibility. It should remain functionally identical to \`index.html\`.
- \`assets/css/editor.css\`: theme variables, workspace layout, canvas, inspector, dialogs and responsive rules.
- \`assets/js/editor.js\`: application state, instance definitions, tree operations, rendering, editing interactions, history and Luau export.
- \`scripts/validate.mjs\`: dependency-free source checks used locally and in CI.

## State and persistence

The editor's in-memory \`state\` holds the project name, layer nodes, selection, zoom and canvas preferences. Each node represents a Roblox-style instance with an identifier, class name, parent identifier, properties and optional editor metadata.

The document is rendered from this state. Editing operations update the state, then refresh the relevant canvas, layer tree or inspector. Browser persistence uses the \`rbxui.project.v1\` local-storage key. The stored project is tied to the current browser and origin.

## Canvas rendering

The canvas is a fixed-coordinate stage scaled to fit the workspace. Node geometry is converted from Roblox-style UDim2 values to CSS geometry. The renderer maps supported GUI properties to CSS, then builds nested child elements in render order. This is a visual approximation, so Roblox Studio remains the final authority for runtime behavior.

Text scaling measures the rendered text in its actual component dimensions and refits after rendering, font loading and size changes. \`UITextSizeConstraint\` bounds are applied where available.

## Export

The exporter walks the current instance tree, creates matching Roblox instances, assigns representable properties and restores parent relationships. It supports a LocalScript target and a Studio Command Bar target. Editor-only metadata, such as preview interactions, is translated into Luau helper behavior where implemented.

When adding a property, review all relevant layers:
1. Defaults and property metadata.
2. Inspector field rendering and validation.
3. Canvas preview mapping, if the property affects appearance or layout.
4. Luau conversion and any special handling needed by that property.
5. Static validation and a manual browser/Studio check.

## Maintenance

The project intentionally has no bundler. Keep shared resources external to the HTML entry points to avoid divergent copies of styles and behavior. Update \`index.html\` and \`rbxui.html\` together when the document shell changes.
