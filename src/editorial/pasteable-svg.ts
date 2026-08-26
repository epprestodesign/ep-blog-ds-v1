/**
 * Turns a mounted TanStack chart into an SVG string that survives being pasted
 * anywhere — a Webflow embed, an email, a slide.
 *
 * TanStack renders geometry as inline attributes, which is most of the way
 * there, but two things are left to inherit from the page it was rendered on:
 *
 *   - `currentColor`, used for grid lines, axis rules and every tick label
 *   - `font-family="inherit"` on all text
 *
 * Inside Storybook those inherit our tokens and look correct, which is exactly
 * what makes the problem easy to miss: the chart looks right in the story and
 * then renders with Webflow's body font and text colour once pasted. Both are
 * resolved to literals here.
 *
 * The result is deliberately static. No script, no classes to style against,
 * nothing to load — if it renders once it renders forever, which is the whole
 * reason this lane can use a pre-alpha library safely.
 */

export interface SvgExportTheme {
    /** Replaces `currentColor` — grid, axes, tick labels. */
    ink: string
    /** Replaces `font-family="inherit"`. Use a full stack, not one face. */
    fontFamily: string
    /** Optional background painted behind the chart. */
    background?: string
}

/** Attributes that only matter to the live runtime's reconciler. */
const RUNTIME_ATTRS = ['data-ts-key', 'tabindex']

export function toPasteableSvg(source: SVGSVGElement, theme: SvgExportTheme): string {
    const svg = source.cloneNode(true) as SVGSVGElement

    svg.querySelectorAll<SVGElement>('*').forEach((el) => {
        RUNTIME_ATTRS.forEach((a) => el.removeAttribute(a))
        // currentColor can sit on any paint attribute, not just fill.
        ;['fill', 'stroke', 'color'].forEach((attr) => {
            if (el.getAttribute(attr) === 'currentColor') el.setAttribute(attr, theme.ink)
        })
        if (el.getAttribute('font-family') === 'inherit') el.setAttribute('font-family', theme.fontFamily)
    })
    RUNTIME_ATTRS.forEach((a) => svg.removeAttribute(a))

    // The root carries the fallbacks, so anything the walk above missed — a
    // nested paint added by a future version, say — still resolves sensibly.
    svg.setAttribute('color', theme.ink)
    svg.setAttribute('font-family', theme.fontFamily)
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    if (theme.background) {
        const rect = svg.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'rect')
        rect.setAttribute('width', '100%')
        rect.setAttribute('height', '100%')
        rect.setAttribute('fill', theme.background)
        svg.insertBefore(rect, svg.firstChild)
    }

    // viewBox alone makes it scale to its container, which is what an embed
    // wants. Explicit width/height would pin it to the size it happened to be
    // authored at.
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', 'auto')

    return format(svg.outerHTML)
}

/** Light indentation. The output is meant to be read in a diff, not minified. */
function format(html: string): string {
    return html
        .replace(/><(?=[a-z])/g, '>\n<')
        .split('\n')
        .reduce<{ out: string[]; depth: number }>(
            (acc, line) => {
                if (/^<\//.test(line)) acc.depth = Math.max(0, acc.depth - 1)
                acc.out.push('  '.repeat(acc.depth) + line)
                if (/^<[a-z][^>]*[^/]>$/.test(line) && !/^<(rect|line|path|circle|text|use|stop)\b/.test(line)) {
                    acc.depth += 1
                }
                return acc
            },
            { out: [], depth: 0 },
        )
        .out.join('\n')
}

/** Wraps the SVG in the figure chrome the rest of the embed kit uses. */
export function wrapEditorialSvg({
    svg,
    title,
    description,
    source,
    mode = 'light',
}: {
    svg: string
    title: string
    description?: string
    source?: string
    mode?: 'light' | 'dark'
}): string {
    const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return `<div class="ep-blog"${mode === 'dark' ? ' data-ep-mode="dark"' : ''}>
  <figure class="ep-chart" data-chart="static">
    <figcaption>
      <p class="ep-chart__title">${esc(title)}</p>
${description ? `      <p class="ep-chart__desc">${esc(description)}</p>\n` : ''}    </figcaption>
    <div class="ep-chart__svg">
${svg}
    </div>
${source ? `    <p class="ep-chart__source">${esc(source)}</p>\n` : ''}  </figure>
</div>`
}
