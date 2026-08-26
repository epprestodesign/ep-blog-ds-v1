/** Shared fixtures for the editorial chart lane — EventPipe-shaped, not lorem. */

export const CHANNEL_FLOW = {
    nodes: [
        { id: 'search', label: 'Search' },
        { id: 'email', label: 'Email' },
        { id: 'partner', label: 'Partner site' },
        { id: 'block', label: 'Room block' },
        { id: 'direct', label: 'Direct rate' },
        { id: 'booked', label: 'Booked' },
        { id: 'abandoned', label: 'Abandoned' },
    ],
    links: [
        { source: 'search', target: 'block', value: 4200 },
        { source: 'search', target: 'direct', value: 1800 },
        { source: 'email', target: 'block', value: 2600 },
        { source: 'email', target: 'direct', value: 900 },
        { source: 'partner', target: 'block', value: 1400 },
        { source: 'partner', target: 'direct', value: 1100 },
        { source: 'block', target: 'booked', value: 6100 },
        { source: 'block', target: 'abandoned', value: 2100 },
        { source: 'direct', target: 'booked', value: 2600 },
        { source: 'direct', target: 'abandoned', value: 1200 },
    ],
}

/** Dotted paths give the treemap and sunburst their hierarchy. */
export const ROOM_NIGHTS_TREE = [
    { name: 'South.Dallas', size: 8400 },
    { name: 'South.Atlanta', size: 7100 },
    { name: 'South.Nashville', size: 3800 },
    { name: 'Midwest.Chicago', size: 6600 },
    { name: 'Midwest.Columbus', size: 2400 },
    { name: 'West.Phoenix', size: 4900 },
    { name: 'West.Denver', size: 4200 },
    { name: 'West.Seattle', size: 2600 },
    { name: 'East.Orlando', size: 5200 },
    { name: 'East.Boston', size: 3100 },
]

/** Trip lengths per event type — the distribution set. */
const seeded = (n: number, base: number, spread: number, seed: number) =>
    Array.from({ length: n }, (_, i) => {
        // Deterministic: a story that reshuffles on every render cannot be reviewed.
        const r = Math.sin(seed * 97.13 + i * 31.7) * 43758.5453
        return base + (r - Math.floor(r) - 0.5) * spread
    })

export const TRIP_LENGTHS = [
    ...seeded(60, 3.4, 3.2, 1).map((v) => ({ group: 'Youth sports', value: Math.max(1, v) })),
    ...seeded(60, 4.8, 5.5, 2).map((v) => ({ group: 'Trade show', value: Math.max(1, v) })),
    ...seeded(60, 4.1, 4.2, 3).map((v) => ({ group: 'Conference', value: Math.max(1, v) })),
    ...seeded(60, 2.6, 2.4, 4).map((v) => ({ group: 'Corporate', value: Math.max(1, v) })),
    ...seeded(60, 2.1, 1.8, 5).map((v) => ({ group: 'Concert', value: Math.max(1, v) })),
]

/** Lead time vs trip length — the scatter/regression/hexbin set. */
export const LEAD_VS_LENGTH = seeded(220, 0, 1, 11).map((r, i) => {
    const lead = 3 + Math.abs(r + 0.5) * 120 + (i % 17) * 2
    const nights = Math.max(1, 1.4 + lead * 0.055 + (Math.sin(i * 12.9898) * 3))
    return { lead: Math.round(lead), nights: Math.round(nights * 10) / 10 }
})

/** Month × market matrix for the heatmap. */
const MONTHS = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
const MARKETS = ['Dallas', 'Atlanta', 'Chicago', 'Phoenix', 'Denver', 'Orlando']
export const HEAT_CELLS = MARKETS.flatMap((market, mi) =>
    MONTHS.map((month, i) => {
        const r = Math.sin(mi * 41.3 + i * 17.7) * 43758.5453
        return { market, month, nights: Math.round(400 + (r - Math.floor(r)) * 2600) }
    }),
)

export const MONTH_SERIES = MONTHS.map((month, i) => ({
    month,
    thisYear: [2100, 4800, 9200, 7400, 5100, 8800, 11200, 9600][i],
    lastYear: [1800, 3900, 7600, 6800, 4700, 7200, 9100, 8200][i],
}))

export const CHANNEL_SHARE = [
    { channel: 'Direct', share: 38 },
    { channel: 'Call center', share: 24 },
    { channel: 'Group block', share: 18 },
    { channel: 'Partner', share: 13 },
    { channel: 'Walk-in', share: 7 },
]

/**
 * Violin and ridgeline take a `width` / `height` channel rather than raw
 * values — they draw a density that has already been computed. That is a
 * deliberate split (the mark does not guess your binning), but it means these
 * two need a preparation step where box plots do not.
 *
 * A plain histogram is enough here; a real KDE would smooth the tails.
 */
export function densityByGroup(
    rows: { group: string; value: number }[],
    bins = 18,
): { group: string; value: number; density: number }[] {
    const groups = [...new Set(rows.map((r) => r.group))]
    const min = Math.min(...rows.map((r) => r.value))
    const max = Math.max(...rows.map((r) => r.value))
    const step = (max - min) / bins

    return groups.flatMap((group) => {
        const vals = rows.filter((r) => r.group === group).map((r) => r.value)
        const counts = new Array(bins).fill(0)
        vals.forEach((v) => {
            const i = Math.min(bins - 1, Math.floor((v - min) / step))
            counts[i] += 1
        })
        const peak = Math.max(...counts, 1)
        return counts.map((c, i) => ({
            group,
            value: min + step * (i + 0.5),
            // Normalised per group so each shape fills its lane, which is what
            // makes shapes comparable rather than counts.
            density: c / peak,
        }))
    })
}

export const TRIP_DENSITY = densityByGroup(TRIP_LENGTHS)
