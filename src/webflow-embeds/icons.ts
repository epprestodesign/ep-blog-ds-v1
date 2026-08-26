/**
 * EventPipe Blog — icon set
 * =========================
 * Every icon that ships inside an embed lives here, and the builders import
 * from this file rather than carrying their own copies. Two reasons:
 *
 *  - The Foundations → Icons story documents what actually ships, because it
 *    reads the same map. A curated list maintained separately from the code
 *    would start drifting the first time a builder inlined one more path.
 *  - Icons ship as inline SVG, never as an icon font or a sprite reference.
 *    A Webflow embed cannot rely on a font having loaded, and a <use href>
 *    pointing at a sprite elsewhere on the page breaks the moment the embed is
 *    moved. Inline is the only form that survives being pasted anywhere.
 *
 * All icons are 24×24 on a 2px stroke and inherit `currentColor`, so a single
 * `color` in the stylesheet themes them.
 */

export interface IconMeta {
    /** Inner markup — everything between the <svg> tags. */
    body: string
    /** Where it is used, or what it means. Shown in the Icons story. */
    use: string
    /** Filled rather than stroked. A handful of glyphs read better solid. */
    filled?: boolean
}

export const ICONS = {
    /* --- Editorial signals ------------------------------------------- */
    insight: {
        body: '<path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2Z"/><path d="M9 21h6"/>',
        use: 'Callout — an insight or takeaway. The default callout icon.',
    },
    info: {
        body: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
        use: 'Callout — context, a definition, or a methodology note.',
    },
    caution: {
        body: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
        use: 'Callout — a caveat or a limitation in the data.',
    },
    quote: {
        body: '<path d="M10 11H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4"/><path d="M20 11h-4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4"/>',
        use: 'Pull quote marker, where a quote needs one.',
    },

    /* --- List and table marks ---------------------------------------- */
    checkCircle: {
        body: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
        use: 'Checklist item.',
    },
    check: {
        body: '<path d="M20 6 9 17l-5-5"/>',
        use: 'Table — a true value in a comparison column.',
    },
    cross: {
        body: '<path d="M18 6 6 18M6 6l12 12"/>',
        use: 'Table — a false value in a comparison column.',
    },
    plus: {
        body: '<path d="M12 5v14M5 12h14"/>',
        use: 'FAQ — rotates 45° into a close mark when the item opens.',
    },

    /* --- Direction and change ---------------------------------------- */
    arrowRight: {
        body: '<path d="M5 12h14M12 5l7 7-7 7"/>',
        use: 'Inline link out of a callout, or a step continuation.',
    },
    externalLink: {
        body: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
        use: 'Link leaving the blog — a report, a partner site, a source.',
    },
    trendingUp: {
        body: '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
        use: 'Metric moving in the intended direction.',
    },
    trendingDown: {
        body: '<path d="M16 17h6v-6"/><path d="m22 17-8.5-8.5-5 5L2 7"/>',
        use: 'Metric moving against the intended direction. Not automatically bad — say which in the label.',
    },

    /* --- Domain: events and housing ---------------------------------- */
    calendar: {
        body: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
        use: 'Event dates, booking windows, cutoff dates.',
    },
    clock: {
        body: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
        use: 'Lead time, booking curves, trip length.',
    },
    mapPin: {
        body: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
        use: 'Destination, origin market, venue.',
    },
    bed: {
        body: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
        use: 'Room nights, room blocks, inventory.',
    },
    users: {
        body: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
        use: 'Attendees, headcount, group size.',
    },
    building: {
        body: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/>',
        use: 'Hotel, property, venue.',
    },

    /* --- Data -------------------------------------------------------- */
    chart: {
        body: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M7 16v-5M12 16V8M17 16v-3"/>',
        use: 'Section marker for a data-led passage.',
    },
    download: {
        body: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
        use: 'Downloadable dataset or report.',
    },
} as const satisfies Record<string, IconMeta>

export type IconName = keyof typeof ICONS

/**
 * Render an icon as inline SVG. `className` is required rather than optional —
 * every icon in an embed is sized and colored by a component class, and an
 * unclassed SVG inherits Webflow's own img/svg defaults instead.
 */
export function icon(name: IconName, className: string): string {
    const meta = ICONS[name] as IconMeta
    const paint = meta.filled
        ? 'fill="currentColor"'
        : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
    return `<svg class="${className}" viewBox="0 0 24 24" ${paint} aria-hidden="true">${meta.body}</svg>`
}
