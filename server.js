"use strict";

const express = require("express");
const path = require("path");
const fs = require("fs");
const { minify } = require("terser");

const PORT = process.env.PORT || 5173;

const app = express();

// ─── Security headers ────────────────────────────────────────────────────────
app.use((_req, res, next) => {
  // Prevent browsers from sniffing MIME types
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Basic clickjacking protection
  res.setHeader("X-Frame-Options", "DENY");
  // XSS protection for older browsers
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// ─── Static public assets (CSS, fonts, images — nothing sensitive) ───────────
// Express will only serve files inside /public. The /private directory is
// never mounted, so GET /private/app.js and GET /app.js both return 404.
app.use(
  express.static(path.join(__dirname, "public"), {
    index: false,         // disable automatic index.html serving
    dotfiles: "deny",     // block any dotfiles
  })
);

// ─── Cached minified script (built once on startup) ──────────────────────────
let minifiedScript = null;

async function buildMinifiedScript() {
  const source = fs.readFileSync(
    path.join(__dirname, "private", "app.js"),
    "utf8"
  );

  const result = await minify(source, {
    compress: {
      drop_console: false,   // keep console output (may be part of bug behaviour)
      passes: 2,
    },
    mangle: {
      toplevel: true,        // rename top-level identifiers
    },
    format: {
      comments: false,
      semicolons: true,
    },
  });

  return result.code;
}

// ─── HTML template cache ─────────────────────────────────────────────────────
let htmlTemplate = null;

function getHtmlTemplate() {
  if (!htmlTemplate) {
    htmlTemplate = fs.readFileSync(
      path.join(__dirname, "index.html"),
      "utf8"
    );
  }
  return htmlTemplate;
}

// ─── Main page route ──────────────────────────────────────────────────────────
app.get("/", async (req, res) => {
  try {
    if (!minifiedScript) {
      minifiedScript = await buildMinifiedScript();
    }

    let html = getHtmlTemplate();

    // Replace the HTML comment placeholder with an inline minified blob.
    // The source file is never sent to the browser — only the minified output.
    html = html.replace(
      /<!--\s*app\.js is inlined by the server at request time\s*-->/i,
      `<script>${minifiedScript}</script>`
    );

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store"); // prevent caching of the assembled page
    res.send(html);
  } catch (err) {
    console.error("Error assembling page:", err);
    res.status(500).send("Internal server error");
  }
});

// ─── Explicit block: reject any attempt to fetch the raw JS files ─────────────
app.get(["/app.js", "/private/*", "/private/app.js"], (_req, res) => {
  res.status(404).send("Not found");
});

// ─── 404 fallback ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).send("Not found");
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  // Pre-build the minified script at startup so the first request is fast
  try {
    if (!minifiedScript) {
      process.stdout.write("Minifying script… ");
      minifiedScript = await buildMinifiedScript();
      console.log("done.");
    }
  } catch (err) {
    console.error("Failed to minify script on startup:", err);
    process.exit(1);
  }

  console.log(`\n  ✓  BugHunt Pro server running`);
  console.log(`  →  http://localhost:${PORT}\n`);
  console.log(`  Private files (app.js) are NEVER exposed as URLs.`);
});
