# Outlet Performance Dashboard

A single-page, static dashboard that pulls weekly sales-vs-target data
directly from a Google Sheet and renders KPIs, a bar chart, and an
"needs attention" list — entirely client-side, no backend or build step.

## How it works

`index.html` fetches the sheet via Google's public `gviz/tq` endpoint
(JSONP), so it works as a plain static file with no server or API keys.
The sheet is configured at the top of the `<script>` block in
`index.html`:

```js
const CONFIG = {
  sheetUrl: "https://docs.google.com/spreadsheets/d/.../edit?usp=sharing",
  tabName: "Combined",
  threshold: 0.9
};
```

**Requirements for the sheet:**
- Sharing must be set to "Anyone with the link can view".
- It must have a tab named to match `tabName`, with columns
  `outlet`, `week`, `sales`, `target`, `orders`, `returns`.

To point the dashboard at a different sheet, edit `sheetUrl`/`tabName`
in `index.html` and redeploy.

## Deploying to Vercel

This repo needs no build step — it's a static `index.html`.

1. Go to [vercel.com/new](https://vercel.com/new) and import this
   GitHub repo (`builtbynext/google-sheet-dashboard`).
2. Framework preset: **Other** (Vercel should auto-detect this; no
   build command or output directory is needed since `index.html`
   sits at the repo root).
3. Click **Deploy**.

Or from the CLI, after `npm i -g vercel`:

```bash
vercel        # preview deploy
vercel --prod # production deploy
```

Every push to the connected branch will auto-deploy once the project
is linked on Vercel.
