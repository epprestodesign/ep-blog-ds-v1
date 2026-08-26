/**
 * EventPipe Blog — embed builders
 * ===============================
 * Pure functions: props in, an HTML string out. That string is what a writer
 * copies into a Webflow Rich Text "Custom Code" block.
 *
 * Two rules keep this layer honest:
 *
 *  1. NO styling in the output. Every builder emits `.ep-*` class names only,
 *     so restyling the blog is a change to blog-embeds.css — not a hunt
 *     through hundreds of already-pasted embeds.
 *  2. Everything user-supplied goes through `esc`. These strings are injected
 *     into a live page as raw HTML; an unescaped `<` in a quote is a defect,
 *     and in a CMS-driven field it is worse than that.
 */

const escRaw = (v: string): string =>
    v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Curly quotes and true dashes — editorial copy should not read as ASCII. */
const smartQuotes = (v: string): string =>
    v
        .replace(/(^|[\s([{<])"/g, '$1“')
        .replace(/"/g, '”')
        .replace(/(^|[\s([{<])'/g, '$1‘')
        .replace(/'/g, '’')
        .replace(/(\d)\s*-\s*(\d)/g, '$1–$2')
        .replace(/\s--\s/g, ' — ')

const esc = (v: string): string => escRaw(smartQuotes(v))
const escAttr = (v: string): string => escRaw(v).replace(/"/g, '&quot;')

/** Split a textarea value into non-empty lines — the playground's list input. */
export const lines = (v: string): string[] =>
    v.split('\n').map((l) => l.trim()).filter(Boolean)

/** Collapse the indentation this file's template literals introduce. */
const tidy = (html: string): string =>
    html
        .split('\n')
        .map((l) => l.trimEnd())
        .filter((l) => l.trim().length > 0)
        .join('\n')

export type Accent = 'teal' | 'harbor' | 'amber'

/** The wrapper every embed needs. `mode` is per-embed so a single dark
 *  visualization can sit inside an otherwise light article. */
const wrap = (inner: string, mode?: 'light' | 'dark'): string =>
    tidy(`<div class="ep-blog"${mode === 'dark' ? ' data-ep-mode="dark"' : ''}>
${inner}
</div>`)

/* ===================================================================
   Metrics row
=================================================================== */

export interface MetricItem {
    value: string
    label: string
    /** Tint the number teal. Use on at most one metric — the point is
     *  to single out the figure the article is actually about. */
    highlight?: boolean
}

export function buildMetricsEmbed(metrics: MetricItem[], mode?: 'light' | 'dark'): string {
    const items = metrics
        .filter((m) => m.value.trim() || m.label.trim())
        .map(
            (m) => `  <div>
    <span class="ep-metric__value"${m.highlight ? ' data-accent="teal"' : ''}>${esc(m.value)}</span>
    <span class="ep-metric__label">${esc(m.label)}</span>
  </div>`,
        )
        .join('\n')

    return wrap(
        `<div class="ep-metrics" data-cols="${Math.min(Math.max(metrics.length, 2), 4)}">
${items}
</div>`,
        mode,
    )
}

/* ===================================================================
   Pull quote
=================================================================== */

export interface PullQuoteProps {
    quote: string
    attribution?: string
    role?: string
    variant?: 'bar' | 'centered'
    avatarUrl?: string
}

const initials = (name: string): string =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('')

export function buildPullQuoteEmbed(
    { quote, attribution, role, variant = 'bar', avatarUrl }: PullQuoteProps,
    mode?: 'light' | 'dark',
): string {
    const avatar = avatarUrl
        ? `<img class="ep-quote__avatar" src="${escAttr(avatarUrl)}" alt="" />`
        : attribution
          ? `<span class="ep-quote__avatar" aria-hidden="true">${esc(initials(attribution))}</span>`
          : ''

    const credit = attribution
        ? `  <div class="ep-quote__attribution">
${avatar ? `    ${avatar}\n` : ''}    <span>
      <span class="ep-quote__name">${esc(attribution)}</span>
${role ? `      <span class="ep-quote__role">${esc(role)}</span>\n` : ''}    </span>
  </div>`
        : ''

    return wrap(
        `<figure class="ep-quote${variant === 'centered' ? ' ep-quote--centered' : ''}">
  <blockquote class="ep-quote__text">${esc(quote)}</blockquote>
${credit}
</figure>`,
        mode,
    )
}

/* ===================================================================
   Callout
=================================================================== */

const CALLOUT_ICONS: Record<Accent, string> = {
    teal: '<path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2Z"/><path d="M9 21h6"/>',
    harbor: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    amber: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
}

export function buildCalloutEmbed(
    {
        title,
        text,
        accent = 'teal',
    }: { title?: string; text: string; accent?: Accent },
    mode?: 'light' | 'dark',
): string {
    const icon = `<svg class="ep-callout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CALLOUT_ICONS[accent]}</svg>`

    const body = lines(text)
        .map((p) => `    <p class="ep-callout__text">${esc(p)}</p>`)
        .join('\n')

    return wrap(
        `<aside class="ep-callout" data-accent="${accent}">
  ${icon}
  <div class="ep-callout__body">
${title ? `    <p class="ep-callout__title">${esc(title)}</p>\n` : ''}${body}
  </div>
</aside>`,
        mode,
    )
}

/* ===================================================================
   Editorial table
=================================================================== */

export type ColumnType = 'text' | 'num' | 'bold' | 'muted' | 'check' | 'pill' | 'pill-teal' | 'pill-harbor'

export interface TableColumn {
    header: string
    type: ColumnType
}

const TABLE_CHECK =
    '<svg class="ep-table__icon ep-table__icon--check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>'
const TABLE_CROSS =
    '<svg class="ep-table__icon ep-table__icon--cross" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>'

const TRUTHY = new Set(['yes', 'y', 'true', '1', '✓', '✔', 'on'])

const cellHtml = (cell: string, type: ColumnType): string => {
    switch (type) {
        case 'check': {
            const on = TRUTHY.has(cell.trim().toLowerCase())
            // The icon is decorative; the accessible name has to be real text.
            return `${on ? TABLE_CHECK : TABLE_CROSS}<span class="ep-sr-only">${on ? 'Yes' : 'No'}</span>`
        }
        case 'pill':
            return `<span class="ep-table__pill">${esc(cell)}</span>`
        case 'pill-teal':
            return `<span class="ep-table__pill" data-accent="teal">${esc(cell)}</span>`
        case 'pill-harbor':
            return `<span class="ep-table__pill" data-accent="harbor">${esc(cell)}</span>`
        default:
            return esc(cell)
    }
}

/** `type` drives both the header and cell rendering, so a numeric column
 *  right-aligns its header too — misaligned number columns are the most
 *  common defect in hand-built editorial tables. */
const cellTypeAttr = (type: ColumnType): string =>
    type === 'num' || type === 'muted' || type === 'bold' ? ` data-type="${type}"` : ''

export function buildTableEmbed(
    {
        caption,
        columns,
        rows,
    }: { caption?: string; columns: TableColumn[]; rows: string[][] },
    mode?: 'light' | 'dark',
): string {
    const head = columns
        .map((c) => `      <th scope="col"${c.type === 'num' ? ' data-type="num"' : ''}>${esc(c.header)}</th>`)
        .join('\n')

    const body = rows
        .map((row) => {
            const cells = columns
                .map((c, i) => {
                    const value = row[i] ?? ''
                    // First column is the row's label, so it gets <th scope="row">
                    // rather than a <td> — that is what lets a screen reader
                    // announce which row a value belongs to.
                    const tag = i === 0 ? 'th scope="row"' : 'td'
                    const close = i === 0 ? 'th' : 'td'
                    return `        <${tag}${cellTypeAttr(c.type)}>${cellHtml(value, c.type)}</${close}>`
                })
                .join('\n')
            return `      <tr>\n${cells}\n      </tr>`
        })
        .join('\n')

    return wrap(
        `<div class="ep-table-wrap">
  <table class="ep-table">
${caption ? `    <caption>${esc(caption)}</caption>\n` : ''}    <thead>
      <tr>
${head}
      </tr>
    </thead>
    <tbody>
${body}
    </tbody>
  </table>
</div>`,
        mode,
    )
}

/* ===================================================================
   Checklist
=================================================================== */

const CHECK_ICON =
    '<svg class="ep-checklist__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>'

export function buildChecklistEmbed(
    { heading, items }: { heading?: string; items: string[] },
    mode?: 'light' | 'dark',
): string {
    const list = items
        .map((t) => `    <li class="ep-checklist__item">${CHECK_ICON}<span>${esc(t)}</span></li>`)
        .join('\n')

    return wrap(
        `<div class="ep-checklist">
${heading ? `  <p class="ep-checklist__heading">${esc(heading)}</p>\n` : ''}  <ul class="ep-checklist__list">
${list}
  </ul>
</div>`,
        mode,
    )
}

/* ===================================================================
   Numbered steps
=================================================================== */

export interface StepItem {
    title: string
    text?: string
}

export function buildStepsEmbed(steps: StepItem[], mode?: 'light' | 'dark'): string {
    const items = steps
        .map(
            (s, i) => `  <li class="ep-steps__item">
    <span class="ep-steps__num" aria-hidden="true">${i + 1}</span>
    <div>
      <p class="ep-steps__title">${esc(s.title)}</p>
${s.text ? `      <p class="ep-steps__text">${esc(s.text)}</p>\n` : ''}    </div>
  </li>`,
        )
        .join('\n')

    return wrap(`<ol class="ep-steps">\n${items}\n</ol>`, mode)
}

/* ===================================================================
   FAQ — native <details>, no JavaScript required in Webflow
=================================================================== */

const FAQ_ICON =
    '<svg class="ep-faq__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'

export interface FaqItem {
    question: string
    answer: string
}

export function buildFaqEmbed(items: FaqItem[], mode?: 'light' | 'dark'): string {
    const list = items
        .map(
            (f) => `  <details class="ep-faq__item">
    <summary class="ep-faq__q">${esc(f.question)}${FAQ_ICON}</summary>
    <p class="ep-faq__a">${esc(f.answer)}</p>
  </details>`,
        )
        .join('\n')

    return wrap(`<div class="ep-faq">\n${list}\n</div>`, mode)
}

/* ===================================================================
   Tags
=================================================================== */

export interface TagItem {
    label: string
    accent?: Accent | 'neutral'
    href?: string
}

export function buildTagsEmbed(tags: TagItem[], mode?: 'light' | 'dark'): string {
    const items = tags
        .map((t) => {
            const attr = t.accent && t.accent !== 'neutral' ? ` data-accent="${t.accent}"` : ''
            const inner = t.href
                ? `<a class="ep-tag"${attr} href="${escAttr(t.href)}">${esc(t.label)}</a>`
                : `<span class="ep-tag"${attr}>${esc(t.label)}</span>`
            return `  <li>${inner}</li>`
        })
        .join('\n')

    return wrap(`<ul class="ep-tags">\n${items}\n</ul>`, mode)
}

/* ===================================================================
   Figure
=================================================================== */

export function buildFigureEmbed(
    { src, alt, caption }: { src: string; alt: string; caption?: string },
    mode?: 'light' | 'dark',
): string {
    return wrap(
        `<figure class="ep-figure">
  <img src="${escAttr(src)}" alt="${escAttr(alt)}" loading="lazy" />
${caption ? `  <figcaption>${esc(caption)}</figcaption>\n` : ''}</figure>`,
        mode,
    )
}

/* ===================================================================
   Chart
   The embed carries only data. Colors, fonts, grid and tooltip styling
   all come from the runtime, so a chart pasted a year ago restyles with
   the rest of the blog on the next merge to main.
=================================================================== */

export type ChartType = 'line' | 'bar' | 'doughnut' | 'radar'

export interface ChartSeries {
    label: string
    values: number[]
    /** Override the themed series color. Leave unset in almost every case. */
    color?: string
}

export interface ChartConfig {
    labels: string[]
    series: ChartSeries[]
    yMin?: number
    yMax?: number
    yStep?: number
    valueSuffix?: string
    stacked?: boolean
    horizontal?: boolean
}

/** The config rides in a single-quoted attribute, so `'` is the character
 *  that must be escaped — not `"`, which JSON is full of. */
const escConfig = (json: string): string =>
    json.replace(/&/g, '&amp;').replace(/'/g, '&#39;')

export function buildChartEmbed(
    {
        type,
        title,
        description,
        source,
        config,
    }: {
        type: ChartType
        title: string
        description?: string
        source?: string
        config: ChartConfig
    },
    mode?: 'light' | 'dark',
): string {
    const json = escConfig(JSON.stringify(config))

    return wrap(
        `<figure class="ep-chart" data-chart="${type}" data-config='${json}'>
  <figcaption>
    <p class="ep-chart__title">${esc(title)}</p>
${description ? `    <p class="ep-chart__desc">${esc(description)}</p>\n` : ''}  </figcaption>
  <div class="ep-chart__canvas-wrap"><canvas></canvas></div>
${source ? `  <p class="ep-chart__source">${esc(source)}</p>\n` : ''}</figure>`,
        mode,
    )
}
