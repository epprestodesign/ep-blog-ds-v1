import { useEffect, useState } from 'react'

/**
 * Reads the resolved EventPipe tokens off the document.
 *
 * The MUI X reference charts have to be driven by the same values the shipping
 * Chart.js runtime reads, or the side-by-side comparison is meaningless — we
 * would be looking at two different palettes and calling the difference a
 * styling gap. Both sides therefore resolve `--ep-*` from computed style, and
 * both follow the Brand and Mode toolbars.
 */
export interface EpTokens {
    series: string[]
    grid: string
    axis: string
    label: string
    tooltipBg: string
    tooltipText: string
    text: string
    subtle: string
    surface: string
    border: string
    accent: string
    fontSans: string
}

function read(el: Element, name: string, fallback: string): string {
    const v = getComputedStyle(el).getPropertyValue(name)
    return (v && v.trim()) || fallback
}

export function readEpTokens(el: Element = document.documentElement): EpTokens {
    return {
        series: Array.from({ length: 8 }, (_, i) => read(el, `--ep-chart-${i + 1}`, '#18B6C1')),
        grid: read(el, '--ep-chart-grid', '#C6CED6'),
        axis: read(el, '--ep-chart-axis', '#6B8196'),
        label: read(el, '--ep-chart-label', '#1B3D5D'),
        tooltipBg: read(el, '--ep-chart-tooltip-bg', '#0C1B2A'),
        tooltipText: read(el, '--ep-chart-tooltip-text', '#FFFFFF'),
        text: read(el, '--ep-color-text', '#0C1B2A'),
        subtle: read(el, '--ep-color-text-subtle', '#1B3D5D'),
        surface: read(el, '--ep-color-surface', '#FFFFFF'),
        border: read(el, '--ep-color-border', '#C6CED6'),
        accent: read(el, '--ep-color-accent', '#18B6C1'),
        fontSans: read(el, '--ep-font-sans', 'Inter, sans-serif'),
    }
}

/** Re-reads whenever brand or mode flips, so a story restyles in place. */
export function useEpTokens(): EpTokens | null {
    const [tokens, setTokens] = useState<EpTokens | null>(null)

    useEffect(() => {
        const update = () => setTokens(readEpTokens())
        update()
        const obs = new MutationObserver(update)
        obs.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-ep-mode', 'data-ep-brand'],
        })
        return () => obs.disconnect()
    }, [])

    return tokens
}
