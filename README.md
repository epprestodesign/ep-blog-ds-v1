# EventPipe Blog Design System

Foundations, editorial components and data visualizations for the EventPipe
blog — authored in Storybook, shipped to a Webflow-hosted site as copy-paste
embeds.

### ▶ [Open the live Storybook →](https://epprestodesign.github.io/ep-blog-ds-v1/)

Auto-deployed from GitHub Pages on every push to `main`. Locally:
`pnpm storybook` → http://localhost:6008

---

## Why it is built this way

Webflow serves static HTML, CSS and JavaScript. There is no React runtime on
the page, so a React component library cannot ship there directly. This repo is
therefore split in two, and only one half leaves the building:

| Layer | Stack | Ships to Webflow |
|---|---|---|
| **Authoring** | React 19 · Tailwind v4 · Storybook | No |
| **Shipping** — `src/webflow-embeds/` | One CSS file, one Chart.js runtime, and pure functions that emit HTML strings | Yes |

Every playground in **Embed Kit** renders its preview from the exact string its
Copy button puts on the clipboard, so the preview and production output cannot
drift apart.

## The three lanes

Pick by how a thing is used, not by how complicated it looks.

1. **Native Webflow** — cards, nav, directory grids, post headers. Built in the
   Designer against the class names documented here. Stays editable by
   non-developers and binds to CMS fields.
2. **Embed Kit** — callouts, pull quotes, metric rows, tables, checklists,
   FAQs, charts. Copy from a playground into a Rich Text → Custom Code block.
3. **Bespoke editorial** — one flagship visualization per major piece, authored
   as a self-contained HTML file. See `references/` for two built this way.

Anything shipped as an embed becomes uneditable in the Designer. That is the
cost of lane 2, and the reason lane 1 exists.

## Webflow setup

Three one-time pastes. After that, publishing a new component is a merge to
`main` — nobody touches Webflow again.

1. **Head** — link the stylesheet from the repo via jsDelivr:
   ```html
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/epprestodesign/ep-blog-ds-v1@main/src/webflow-embeds/blog-embeds.css">
   ```
   The deploy workflow purges the jsDelivr cache on merge, so a restyle lands in
   seconds rather than at the end of a 12-hour TTL. Linking also sidesteps
   Webflow's 50,000-character cap on custom code, which the stylesheet will
   eventually exceed.
2. **Footer** — the Chart.js CDN tag plus the runtime. Only needed if the blog
   uses charts. Copy both from **Embed Kit → Webflow Setup**.
3. **Designer** — give the Rich Text element the class `ep-prose`, inside a
   parent with `ep-blog`.

Full walkthrough: [`docs/WEBFLOW.md`](docs/WEBFLOW.md).

## Brands

Two foundations, switched by attribute on any element:

```html
<div class="ep-blog" data-ep-brand="marketing" data-ep-mode="dark">
```

- **Marketing** (default) — Midnight `#10163E` and Teal `#00ADB3`, Fraunces
  over Inter. The blog's own voice.
- **Product** — Azure `#2561FA` and Graphite, Product Sans. Ported from
  [`eventpipe-prototype-ds`](https://github.com/epprestodesign/eventpipe-prototype-ds),
  for posts embedding real admin-platform UI.

Both run light and dark. Storybook's **Brand** and **Mode** toolbars switch any
story between all four.

## Structure

```
src/
├── tokens/              Three-tier token layer — the source of truth
│   ├── palette.css        Tier 1 · raw ramps, no meaning
│   ├── scales.css         Spacing, radius, type, elevation, motion
│   └── semantic.css       Tier 2 · roles, themed per brand × mode
├── styles/              Tailwind v4 bridge + web fonts (authoring only)
├── webflow-embeds/      THE SHIPPING LAYER
│   ├── blog-embeds.css    One stylesheet, everything scoped to .ep-blog
│   ├── builders.ts        Props in, HTML string out
│   ├── charts-runtime.ts  Chart.js runtime, reads its colors from CSS vars
│   └── *.stories.tsx      Live playgrounds with Copy buttons
├── components/          Storybook chrome and foundation stories
└── pages/               Editorial lane
references/              Bespoke visualizations, one HTML file each
```

## Development

```bash
pnpm install
pnpm storybook          # http://localhost:6008
pnpm typecheck          # tsc -b
pnpm build-storybook
```

There is no application build. Storybook is the only surface this repo
produces — everything that reaches the live blog does so through
`src/webflow-embeds/`, as HTML pasted into Webflow or a stylesheet linked from
this repo.

Storybook auto-deploys to
**[epprestodesign.github.io/ep-blog-ds-v1](https://epprestodesign.github.io/ep-blog-ds-v1/)**
on every push to `main`. The same workflow purges the jsDelivr cache for
`blog-embeds.css`, so a restyle reaches the live Webflow blog in the same run.
