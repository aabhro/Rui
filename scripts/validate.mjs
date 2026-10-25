import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function read(relativePath) {
  const absolutePath = resolve(root, relativePath);
  if (!existsSync(absolutePath)) {
    failures.push("Missing required file: " + relativePath);
    return "";
  }
  return readFileSync(absolutePath, "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function checkBalanced(source, label) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  let quote = "";
  let escaped = false;
  let comment = false;

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];

    if (comment) {
      if (ch === "*" && next === "/") {
        i++;
        comment = false;
      }
      continue;
    }

    if (quote) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) quote = "";
      continue;
    }

    if (ch === "/" && next === "*") {
      i++;
      comment = true;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      continue;
    }
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push({ ch, index: i });
      continue;
    }
    if (ch in pairs) {
      const opened = stack.pop();
      if (!opened || opened.ch !== pairs[ch]) {
        failures.push(label + ": unexpected closing delimiter " + ch + " at offset " + i);
        return;
      }
    }
  }

  if (quote || comment || stack.length) {
    failures.push(label + ": unclosed string, comment or delimiter");
  }
}

const html = read("index.html");
const compatibilityHtml = read("rbxui.html");
const css = read("assets/css/editor.css");
const appJs = read("assets/js/editor.js");
const packageSource = read("package.json");

assert(html.includes('href="./assets/css/editor.css"'), "index.html must reference the shared stylesheet");
assert(html.includes('src="./assets/js/editor.js"'), "index.html must reference the shared application script");
assert(compatibilityHtml.includes('href="./assets/css/editor.css"'), "rbxui.html must reference the shared stylesheet");
assert(compatibilityHtml.includes('src="./assets/js/editor.js"'), "rbxui.html must reference the shared application script");
assert(html === compatibilityHtml, "index.html and rbxui.html should remain identical entry points");
assert(!/<style\b/i.test(html), "Keep CSS external to the HTML entry point");
assert(!/<script(?![^>]*\bsrc=)[^>]*>/i.test(html), "Keep application JavaScript external to the HTML entry point");

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
assert(duplicates.length === 0, "Duplicate HTML IDs: " + [...new Set(duplicates)].join(", "));
for (const id of ["stage", "layerTree", "inspector", "projectName", "exportBtn"]) {
  assert(ids.includes(id), "Missing core editor element: #" + id);
}

try {
  new Function(appJs);
} catch (error) {
  failures.push("JavaScript syntax error: " + error.message);
}

checkBalanced(css, "CSS");
try {
  JSON.parse(packageSource);
} catch (error) {
  failures.push("package.json is invalid JSON: " + error.message);
}

assert(appJs.includes("rbxui.project.v1"), "The project storage key should remain defined");
assert(appJs.includes("TextScaled"), "TextScaled support should remain in the editor source");
assert(appJs.includes("function luaCode"), "Luau export should remain in the editor source");

if (failures.length) {
  console.error("rbxui checks failed:");
  for (const failure of failures) console.error("  - " + failure);
  process.exitCode = 1;
} else {
  console.log("rbxui checks passed");
  console.log("  HTML entry points: index.html, rbxui.html");
  console.log("  Stylesheet: assets/css/editor.css");
  console.log("  Application script: assets/js/editor.js");
}
