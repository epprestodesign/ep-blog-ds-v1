# Shipping to Webflow

How a component gets from this repo onto the live blog, and why each step is
shaped the way it is.

## What Webflow can and cannot take

Webflow's Designer output is static HTML, CSS and JavaScript. There is no React
runtime, no build step, and no module system on the published page. Four ways
in exist; only two matter for a blog.

| Route | What it is | Verdict |
|---|---|---|
| **Custom code embed** | HTML/CSS/JS in Site settings, Page settings, a Code Embed element, or a CMS Rich Text field. Capped at 50,000 characters each. | **Used here.** The only route that puts a component inside an article body. |
| **Hosted asset** | A `<script src>` or `<link rel=stylesheet>` pointing anywhere. | **Used here.** How the stylesheet and chart runtime get in without burning the character cap. |
| **Webflow Cloud** | Next.js / Astro / Vite apps on Cloudflare Workers, mounted at a path on the Webflow domain. | Not used. It mounts an *app* at a subpath — the wrong shape for a CMS-driven blog, and it splits the site in two. This is the escape hatch if a genuinely interactive tool is ever needed. |
| **DevLink** | Exports Webflow components *into* React. | Backwards for this purpose. |

## The three pastes

### 1 · Stylesheet → Site Settings → Custom Code → Head

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/epprestodesign/ep-blog-ds-v1@main/src/webflow-embeds/blog-embeds.css">
```

Linking rather than pasting matters for two reasons:

- **The cap.** `blog-embeds.css` is ~19KB today and will pass 50,000 characters
  as the kit grows. A link never counts against it.
- **Shipping speed.** A restyle becomes a merge to `main`. Pasted CSS would mean
  someone re-pasting the whole file into the Designer every time.

jsDelivr caches `@main` for up to 12 hours, so `.github/workflows/deploy-storybook.yml`
calls the purge endpoint on every merge. Changes land in seconds.

> **Pinning.** `@main` always serves latest. To freeze the blog against a known
> good version, swap `@main` for a tag (`@v1.2.0`) and bump it deliberately.
> Worth doing once the blog has real traffic.

### 2 · Chart runtime → Site Settings → Custom Code → Footer

Two tags, in order — Chart.js from CDN, then the runtime. Copy both from
**Embed Kit → Webflow Setup** in Storybook. Skip entirely if the blog has no
charts.

The runtime scans for `.ep-chart[data-chart]`, so every chart embed pasted
afterwards is found and drawn with no script of its own. It reads its colors
from the *computed* CSS custom properties on each chart element rather than
from a hardcoded palette, which is what lets a chart pasted a year ago pick up
a rebrand on the next merge.

### 3 · Rich Text class → in the Designer

On the blog post template, wrap the Rich Text element:

```html
<div class="ep-blog">
  <div class="ep-prose w-richtext">  <!-- CMS Rich Text field binds here -->
</div>
```

`.ep-prose` styles every element a writer can produce with Webflow's native
toolbar — headings, lists, links, blockquotes, code, images, rules. Nothing to
style per-element in the Designer, nothing for a writer to remember.

## Adding a component to an article

1. Open its playground in Storybook, set the Controls.
2. **Copy for Webflow.**
3. In the Webflow editor, put the cursor where it goes, add a **Custom Code**
   block, paste, save.

The embed is a `<div class="ep-blog">` wrapper with `.ep-*` class names inside
and no styling of its own. Restyling every already-pasted instance is a change
to `blog-embeds.css`.

## CMS-bound embeds

A Code Embed element can interpolate CMS field values — `+ Add Field` inside
the embed. Useful for a chart whose data lives in a CMS field:

```html
<figure class="ep-chart" data-chart="bar" data-config='{{ Chart Config }}'>
  <figcaption><p class="ep-chart__title">{{ Chart Title }}</p></figcaption>
  <div class="ep-chart__canvas-wrap"><canvas></canvas></div>
</figure>
```

The config rides in a **single-quoted** attribute, because the JSON inside is
full of double quotes. `buildChartEmbed` escapes `'` and `&` accordingly — hand-
authored configs need the same treatment.

## Scoping guarantees

Nothing in `blog-embeds.css` applies outside `.ep-blog`, **including the custom
properties** — they are declared on `.ep-blog`, not `:root`. The file cannot
collide with the EventPipe marketing site's own styles or variables no matter
what it defines. Two rules deliberately reach outward, both to neutralize
Webflow defaults that break embeds:

- `.w-richtext figure { max-width: 60% }` — would shrink any embed built on
  `<figure>` to 60% of the column.
- Native `<summary>` markers on the FAQ component.

## Constraints worth remembering

- **50,000 characters** per Code Embed, per Page settings field, per Site
  settings field, per CMS Rich Text field. Paid plans only.
- **Bespoke visualizations** in `references/` are 60–90KB and exceed this.
  Deploy them as standalone files and embed an `<iframe>`, which also keeps the
  article page fast.
- **`{{ }}`** is Webflow's field-binding syntax. Avoid it in embed output.
- **The Designer cannot edit embed contents.** That is the cost of the Embed Kit
  lane, and the reason page chrome should be built natively instead.
