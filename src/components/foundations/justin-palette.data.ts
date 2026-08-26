/**
 * "Justin's Exploration" — a hand-authored palette, kept verbatim.
 *
 * Unlike the generated schemes beside it, this one was designed rather than
 * derived, so nothing here is recomputed: the hexes are exactly as supplied.
 * The analysis below is measured from them, not imposed on them.
 *
 * Ten hues at eleven steps, plus a fixed data-visualization order. The order is
 * the important part — a chart with N series takes the first N colours, so
 * position 2 has to be distinguishable from position 1 far more urgently than
 * position 10 does from position 9.
 */

export interface PaletteRamp {
    name: string
    /** The step that anchors the ramp and appears in the dataViz order. */
    anchor: string
    steps: Record<string, string>
}

const STEP_KEYS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']

export const JUSTIN_STEPS = STEP_KEYS

export const justinRamps: PaletteRamp[] = [
    {
        name: 'teal',
        anchor: '500',
        steps: {
            50: '#F4FAFA', 100: '#EAF5F6', 200: '#D2EAEC', 300: '#B8DDE0', 400: '#8BC8CC',
            500: '#4DAAB1', 600: '#44969C', 700: '#3A8085', 800: '#2E666A', 900: '#234C50', 950: '#193639',
        },
    },
    {
        name: 'navy',
        anchor: '500',
        steps: {
            50: '#F1F3F5', 100: '#E4E8EC', 200: '#C6CED6', 300: '#A4B1BE', 400: '#6B8196',
            500: '#1B3D5D', 600: '#183652', 700: '#142E46', 800: '#102538', 900: '#0C1B2A', 950: '#09141E',
        },
    },
    {
        name: 'magenta',
        anchor: '500',
        steps: {
            50: '#FCF4F8', 100: '#F9EAF1', 200: '#F2D3E2', 300: '#EAB9D0', 400: '#DD8DB3',
            500: '#CB4F8A', 600: '#B34679', 700: '#983B68', 800: '#7A2F53', 900: '#5B243E', 950: '#41192C',
        },
    },
    {
        name: 'gold',
        anchor: '500',
        steps: {
            50: '#FCF9F3', 100: '#F9F2E8', 200: '#F2E5CF', 300: '#E9D5B2', 400: '#DCBB82',
            500: '#C9963F', 600: '#B18437', 700: '#97702F', 800: '#795A26', 900: '#5A441C', 950: '#403014',
        },
    },
    {
        name: 'violet',
        anchor: '500',
        steps: {
            50: '#F7F5FA', 100: '#EEECF6', 200: '#DCD7EC', 300: '#C8BFE1', 400: '#A598CE',
            500: '#7560B3', 600: '#67549E', 700: '#584886', 800: '#463A6B', 900: '#352B51', 950: '#251F39',
        },
    },
    {
        name: 'green',
        anchor: '500',
        steps: {
            50: '#F5F9F6', 100: '#EBF2ED', 200: '#D5E4DA', 300: '#BCD5C3', 400: '#92BA9E',
            500: '#57956A', 600: '#4D835D', 700: '#417050', 800: '#345940', 900: '#274330', 950: '#1C3022',
        },
    },
    {
        name: 'coral',
        anchor: '500',
        steps: {
            50: '#FCF6F5', 100: '#F9EDEB', 200: '#F3DAD6', 300: '#EBC4BD', 400: '#DF9F94',
            500: '#CE6C5B', 600: '#B55F50', 700: '#9A5144', 800: '#7C4137', 900: '#5D3129', 950: '#42231D',
        },
    },
    {
        name: 'sky',
        anchor: '500',
        steps: {
            50: '#F4F8FB', 100: '#EAF0F8', 200: '#D2E0F0', 300: '#B7CDE7', 400: '#8BAED8',
            500: '#4C82C3', 600: '#4372AC', 700: '#396292', 800: '#2E4E75', 900: '#223A58', 950: '#182A3E',
        },
    },
    {
        name: 'plum',
        anchor: '500',
        steps: {
            50: '#F8F5F7', 100: '#F1EBEF', 200: '#E2D6DD', 300: '#D1BDC9', 400: '#B494A7',
            500: '#8B5A78', 600: '#7A4F6A', 700: '#68445A', 800: '#533648', 900: '#3F2836', 950: '#2C1D26',
        },
    },
    {
        name: 'orange',
        anchor: '500',
        steps: {
            50: '#FCF7F3', 100: '#F8EFE8', 200: '#F1DDCF', 300: '#E9C9B2', 400: '#DBA782',
            500: '#C7773E', 600: '#AF6937', 700: '#95592E', 800: '#774725', 900: '#5A361C', 950: '#402614',
        },
    },
]

export interface DataVizEntry {
    position: number
    name: string
    hex: string
    /** Perceived lightness, OKLCH. Even values mean no series looks heavier. */
    lightness: number
    onWhite: number
    onMidnight: number
}

/** Measured from the hexes above — see the Analysis section of the story. */
export const justinDataViz: DataVizEntry[] = [
    { position: 1, name: 'Teal', hex: '#4DAAB1', lightness: 0.685, onWhite: 2.73, onMidnight: 6.38 },
    { position: 2, name: 'Navy', hex: '#1B3D5D', lightness: 0.351, onWhite: 11.22, onMidnight: 1.55 },
    { position: 3, name: 'Magenta', hex: '#CB4F8A', lightness: 0.608, onWhite: 4.18, onMidnight: 4.17 },
    { position: 4, name: 'Gold', hex: '#C9963F', lightness: 0.706, onWhite: 2.65, onMidnight: 6.56 },
    { position: 5, name: 'Violet', hex: '#7560B3', lightness: 0.547, onWhite: 5.15, onMidnight: 3.38 },
    { position: 6, name: 'Green', hex: '#57956A', lightness: 0.616, onWhite: 3.55, onMidnight: 4.90 },
    { position: 7, name: 'Coral', hex: '#CE6C5B', lightness: 0.641, onWhite: 3.55, onMidnight: 4.91 },
    { position: 8, name: 'Sky', hex: '#4C82C3', lightness: 0.599, onWhite: 3.97, onMidnight: 4.38 },
    { position: 9, name: 'Plum', hex: '#8B5A78', lightness: 0.531, onWhite: 5.48, onMidnight: 3.18 },
    { position: 10, name: 'Orange', hex: '#C7773E', lightness: 0.645, onWhite: 3.42, onMidnight: 5.09 },
]

export const justinColors = justinDataViz.map((d) => d.hex)

/** Pairs closest together in OKLab — the ones a reader is most likely to
 *  confuse. Distance below roughly 0.09 is worth designing around. */
export const closestPairs: { a: string; b: string; distance: number; positions: string }[] = [
    { a: 'Coral', b: 'Orange', distance: 0.05, positions: '7 and 10' },
    { a: 'Gold', b: 'Orange', distance: 0.079, positions: '4 and 10' },
    { a: 'Violet', b: 'Sky', distance: 0.097, positions: '5 and 8' },
    { a: 'Violet', b: 'Plum', distance: 0.098, positions: '5 and 9' },
    { a: 'Teal', b: 'Green', distance: 0.102, positions: '1 and 6' },
]
