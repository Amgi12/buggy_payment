# BugHunt Payment Portal

A static, single-page **payment checkout UI** built for **technical bug-hunt / CTF-style events**. The interface is intentionally designed to look polished while embedding **subtle, frontend-only flaws** that reward careful inspection, DevTools use, and methodical UX testing.

## Stack

- Plain **HTML**, **CSS**, and **JavaScript** (no build step)
- Local development uses [`serve`](https://github.com/vercel/serve) via `npx`

## Quick start

```bash
cd "/path/to/payment"
npm run dev
```

Open **http://localhost:5173** in your browser.

Equivalent:

```bash
npm start
```

### Alternative (no npm)

Any static file server works, for example:

```bash
python3 -m http.server 5173 --bind 127.0.0.1
```

Then open **http://127.0.0.1:5173/**.

## Project layout

| File | Role |
|------|------|
| `index.html` | Markup, form structure, accessibility scaffolding (e.g. skip link, labels) |
| `styles.css` | Visual design and intentional layout/focus quirks |
| `app.js` | Validation timing, submit behavior, terms/pay interactions |
| `package.json` | `dev` / `start` scripts only |

## Participant brief (no spoilers)

Treat this like a **real registration checkout**: complete the form, accept terms, and complete payment. If something feels “off,” document **what you observe**, **how you reproduced it**, and **why it’s a problem** from a user or quality perspective.

## Organizer notes (spoilers)

The following items are **intentional UI-only issues** embedded for the exercise:

1. **Terms checkbox** — The real checkbox is **disabled** and never becomes checked. A **faux** checked state is toggled via the surrounding block; visually it can look accepted while the real control is not.
2. **Pay now** — When the real terms box is not checked, submit can **exit without status text** (no immediate error or loading feedback).
3. **Delayed validation** — Errors are debounced (~**1.4s**), so feedback can lag behind typing or blur.
4. **Email errors** — Error text for email uses **muted** styling so it is **harder to read** than other field errors.
5. **Inconsistent validation triggers** — Payment method validation is primarily tied to **`change`**, not the same blur/input pattern as other fields.
6. **Visual / micro-UI** — Minor **misalignment** (summary row, amount column width, small field nudges), **asymmetric** focus styling on the amount field, and slightly different **focus** treatment on the primary button vs inputs.
7. **Copy ambiguity** — “Work email” vs hints about receipts/access can confuse expectations.

Use this list to score submissions, run walkthroughs, or tune difficulty (e.g. remove or add hints).

## License / usage

Private event asset unless you attach a license. Adjust branding, copy, and “bugs” to match your program rules.
