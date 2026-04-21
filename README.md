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

1. **Terms checkbox validation** — The form can cleanly submit and produce a "payment successful" alert even if the "Terms & Conditions" checkbox is left unchecked by the user. The submit handler fails to mandate the acceptance of terms.

2. **Delayed validation** — Errors are debounced (~**1.4s**), so feedback can lag behind typing or blur.
They type something invalid into a field (like "hello" into the amount field).
They click away to the next field (the blur event).
Nothing happens immediately.
They wait about 1.4 seconds, and completely out of nowhere, an error message finally pops up.

3. **Inconsistent validation triggers** — Payment method validation is primarily tied to **`change`**, not the same blur/input pattern as other fields.
 Imagine a user clicks the "Payment method" dropdown, looks at the options, but clicks away without selecting anything (triggering a blur). Because there is no blur listener, no error message appears to warn them that they missed the field. They will only find out they missed it when they click the "Pay now" button and the whole form validation runs.

It creates an uneven user experience where some fields hold your hand and warn you immediately if you skip them, but the Payment Method field stays completely silent!

4. **Visual / micro-UI** — Severe **misalignment** (summary row visibly crooked) and intensely **asymmetric** focus styling on the amount field.
Jolted the "Platform fee" row: It now explicitly sticks out 14px to the right (padding-left: 14px). It's very visibly crooked now. Heavy Asymmetric Focus Glitch: The Amount field focus ring now draws a huge, thick 5px stroke on the right side only.

5. **Amount field lacks limits** — There is no maximum limit or sanity check in the amount field. Absurdly high amounts (e.g., trillions of dollars) can be entered and will produce a "payment successful" alert, whereas real-life payment processors would block this.

6. **Name field missing sanitization** — The "Full name" field accepts any characters, including pure numbers or special symbols (e.g., "12345" or "@#%"), allowing users to successfully check out with completely invalid name formats.

Use this list to score submissions, run walkthroughs, or tune difficulty (e.g. remove or add hints).

## License / usage

Private event asset unless you attach a license. Adjust branding, copy, and “bugs” to match your program rules.
