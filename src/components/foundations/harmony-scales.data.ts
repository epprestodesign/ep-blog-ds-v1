/**
 * Harmony scales derived from the EventPipe brand teal #00AEB3.
 *
 * Generated, not hand-picked. Each scale is the brand rotated in OKLCH — hue
 * alone changes, perceived lightness and chroma are held constant — so every
 * ramp is a true sibling of the brand rather than a colour that merely looks
 * adjacent. Rotating in HSL instead would produce hues of wildly unequal
 * perceived lightness, which is what makes hand-built chart palettes look
 * weighted when the data is not.
 *
 * The hexes here are for display only. Swatches render from the
 * `--ep-palette-<name>-<step>` custom properties in src/tokens/palette.css,
 * so the page cannot drift from the tokens it documents.
 */

export interface HarmonyStep {
  step: string
  hex: string
  /** Contrast against white. 4.5 or above clears WCAG AA for body text. */
  onWhite: number
  /** Contrast against the Midnight canvas (#10163E). */
  onMidnight: number
}

export interface HarmonyScale {
  name: string
  /** Which harmony relationship this is to the brand. */
  kind: string
  /** OKLCH hue in degrees. The brand sits at 198. */
  hue: number
  description: string
  steps: HarmonyStep[]
}

export const SOURCE_HEX = '#00AEB3'
export const SOURCE_OKLCH = 'oklch(0.6816 0.1159 198.43)'

export const harmonyScales: HarmonyScale[] = [
  {
    name: 'coral',
    kind: 'Complement',
    hue: 18.43,
    description:
      'Directly opposite the brand. The strongest available contrast against teal — reach for it when two series must never be confused.',
    steps: [
      { step: '25', hex: '#FFF7F7', onWhite: 1.06, onMidnight: 16.5 },
      { step: '50', hex: '#FFEEEE', onWhite: 1.12, onMidnight: 15.51 },
      { step: '100', hex: '#FDE0DF', onWhite: 1.24, onMidnight: 14.01 },
      { step: '200', hex: '#FACBCB', onWhite: 1.45, onMidnight: 11.99 },
      { step: '300', hex: '#F4B3B3', onWhite: 1.76, onMidnight: 9.9 },
      { step: '400', hex: '#EC9C9D', onWhite: 2.14, onMidnight: 8.13 },
      { step: '500', hex: '#E2898B', onWhite: 2.57, onMidnight: 6.78 },
      { step: '600', hex: '#D77A7D', onWhite: 3.01, onMidnight: 5.78 },
      { step: '700', hex: '#BD6266', onWhite: 4.12, onMidnight: 4.23 },
      { step: '800', hex: '#A04E52', onWhite: 5.67, onMidnight: 3.07 },
      { step: '900', hex: '#813C40', onWhite: 7.91, onMidnight: 2.2 },
      { step: '950', hex: '#5A272A', onWhite: 11.94, onMidnight: 1.46 },
    ],
  },
  {
    name: 'rose',
    kind: 'Split-complement',
    hue: 348.43,
    description:
      'Softer opposition than coral. Pairs with the brand without the head-on clash of a true complement.',
    steps: [
      { step: '25', hex: '#FFF6FA', onWhite: 1.06, onMidnight: 16.43 },
      { step: '50', hex: '#FDEEF5', onWhite: 1.12, onMidnight: 15.52 },
      { step: '100', hex: '#FAE0EB', onWhite: 1.24, onMidnight: 14.03 },
      { step: '200', hex: '#F4CBDE', onWhite: 1.45, onMidnight: 11.97 },
      { step: '300', hex: '#EDB2CE', onWhite: 1.77, onMidnight: 9.83 },
      { step: '400', hex: '#E39CBF', onWhite: 2.15, onMidnight: 8.1 },
      { step: '500', hex: '#D989B1', onWhite: 2.57, onMidnight: 6.77 },
      { step: '600', hex: '#CD7AA5', onWhite: 3.03, onMidnight: 5.74 },
      { step: '700', hex: '#B3638D', onWhite: 4.13, onMidnight: 4.22 },
      { step: '800', hex: '#984F75', onWhite: 5.66, onMidnight: 3.08 },
      { step: '900', hex: '#7A3D5E', onWhite: 7.9, onMidnight: 2.2 },
      { step: '950', hex: '#552740', onWhite: 12.0, onMidnight: 1.45 },
    ],
  },
  {
    name: 'ember',
    kind: 'Split-complement',
    hue: 48.43,
    description:
      'The warm half of the split. Reads as the natural other side of a teal chart.',
    steps: [
      { step: '25', hex: '#FFF7F4', onWhite: 1.06, onMidnight: 16.46 },
      { step: '50', hex: '#FEEFE8', onWhite: 1.12, onMidnight: 15.52 },
      { step: '100', hex: '#FBE2D5', onWhite: 1.24, onMidnight: 14.04 },
      { step: '200', hex: '#F7CEBA', onWhite: 1.45, onMidnight: 12.01 },
      { step: '300', hex: '#F0B89B', onWhite: 1.74, onMidnight: 9.98 },
      { step: '400', hex: '#E8A27E', onWhite: 2.12, onMidnight: 8.21 },
      { step: '500', hex: '#DE9067', onWhite: 2.53, onMidnight: 6.87 },
      { step: '600', hex: '#D28256', onWhite: 2.97, onMidnight: 5.86 },
      { step: '700', hex: '#B86A3F', onWhite: 4.06, onMidnight: 4.29 },
      { step: '800', hex: '#9C562E', onWhite: 5.55, onMidnight: 3.14 },
      { step: '900', hex: '#7E4220', onWhite: 7.81, onMidnight: 2.23 },
      { step: '950', hex: '#582B11', onWhite: 11.87, onMidnight: 1.47 },
    ],
  },
  {
    name: 'jade',
    kind: 'Analogous',
    hue: 168.43,
    description:
      'One step green of the brand. Related enough to feel deliberate, separate enough to read in a chart.',
    steps: [
      { step: '25', hex: '#F3FBF8', onWhite: 1.05, onMidnight: 16.55 },
      { step: '50', hex: '#E8F7F0', onWhite: 1.11, onMidnight: 15.74 },
      { step: '100', hex: '#D4EFE4', onWhite: 1.22, onMidnight: 14.31 },
      { step: '200', hex: '#B7E4D2', onWhite: 1.4, onMidnight: 12.47 },
      { step: '300', hex: '#94D7BD', onWhite: 1.65, onMidnight: 10.54 },
      { step: '400', hex: '#72C9AA', onWhite: 1.97, onMidnight: 8.83 },
      { step: '500', hex: '#54BC99', onWhite: 2.33, onMidnight: 7.49 },
      { step: '600', hex: '#3DAF8C', onWhite: 2.72, onMidnight: 6.39 },
      { step: '700', hex: '#199775', onWhite: 3.67, onMidnight: 4.75 },
      { step: '800', hex: '#007E60', onWhite: 5.06, onMidnight: 3.44 },
      { step: '900', hex: '#00644B', onWhite: 7.18, onMidnight: 2.42 },
      { step: '950', hex: '#004432', onWhite: 11.21, onMidnight: 1.55 },
    ],
  },
  {
    name: 'cobalt',
    kind: 'Analogous',
    hue: 228.43,
    description:
      'One step blue of the brand. The safest second series when the first is teal.',
    steps: [
      { step: '25', hex: '#F2FBFF', onWhite: 1.05, onMidnight: 16.59 },
      { step: '50', hex: '#E7F6FD', onWhite: 1.11, onMidnight: 15.75 },
      { step: '100', hex: '#D3EDF9', onWhite: 1.22, onMidnight: 14.3 },
      { step: '200', hex: '#B4E0F4', onWhite: 1.41, onMidnight: 12.36 },
      { step: '300', hex: '#91D0EE', onWhite: 1.69, onMidnight: 10.33 },
      { step: '400', hex: '#6EC1E5', onWhite: 2.01, onMidnight: 8.64 },
      { step: '500', hex: '#4FB3DC', onWhite: 2.38, onMidnight: 7.31 },
      { step: '600', hex: '#37A6D1', onWhite: 2.79, onMidnight: 6.25 },
      { step: '700', hex: '#0D8EB8', onWhite: 3.76, onMidnight: 4.62 },
      { step: '800', hex: '#00759A', onWhite: 5.24, onMidnight: 3.33 },
      { step: '900', hex: '#005D7B', onWhite: 7.36, onMidnight: 2.36 },
      { step: '950', hex: '#003F55', onWhite: 11.4, onMidnight: 1.53 },
    ],
  },
  {
    name: 'orchid',
    kind: 'Triadic',
    hue: 318.43,
    description:
      'Balanced third point — distinct from both the brand and its complement.',
    steps: [
      { step: '25', hex: '#FCF7FE', onWhite: 1.06, onMidnight: 16.47 },
      { step: '50', hex: '#F8EFFB', onWhite: 1.12, onMidnight: 15.53 },
      { step: '100', hex: '#F1E1F6', onWhite: 1.25, onMidnight: 13.96 },
      { step: '200', hex: '#E8CEEF', onWhite: 1.45, onMidnight: 12.02 },
      { step: '300', hex: '#DCB7E6', onWhite: 1.76, onMidnight: 9.91 },
      { step: '400', hex: '#CFA1DD', onWhite: 2.14, onMidnight: 8.12 },
      { step: '500', hex: '#C38FD2', onWhite: 2.57, onMidnight: 6.78 },
      { step: '600', hex: '#B781C7', onWhite: 3.01, onMidnight: 5.78 },
      { step: '700', hex: '#9E6AAE', onWhite: 4.1, onMidnight: 4.25 },
      { step: '800', hex: '#855593', onWhite: 5.65, onMidnight: 3.08 },
      { step: '900', hex: '#6B4276', onWhite: 7.88, onMidnight: 2.21 },
      { step: '950', hex: '#4A2B52', onWhite: 11.94, onMidnight: 1.46 },
    ],
  },
  {
    name: 'citron',
    kind: 'Triadic',
    hue: 78.43,
    description:
      'The warm third point. Least chroma headroom in sRGB, so it is the most muted of the set.',
    steps: [
      { step: '25', hex: '#FDF8F1', onWhite: 1.06, onMidnight: 16.47 },
      { step: '50', hex: '#FAF2E5', onWhite: 1.11, onMidnight: 15.66 },
      { step: '100', hex: '#F4E6D0', onWhite: 1.23, onMidnight: 14.16 },
      { step: '200', hex: '#ECD5B1', onWhite: 1.43, onMidnight: 12.2 },
      { step: '300', hex: '#E1C18E', onWhite: 1.72, onMidnight: 10.13 },
      { step: '400', hex: '#D6AE6C', onWhite: 2.07, onMidnight: 8.4 },
      { step: '500', hex: '#CB9D4F', onWhite: 2.48, onMidnight: 7.03 },
      { step: '600', hex: '#BF8F3B', onWhite: 2.91, onMidnight: 5.97 },
      { step: '700', hex: '#A7781D', onWhite: 3.93, onMidnight: 4.43 },
      { step: '800', hex: '#8C6206', onWhite: 5.43, onMidnight: 3.2 },
      { step: '900', hex: '#704D00', onWhite: 7.63, onMidnight: 2.28 },
      { step: '950', hex: '#4D3400', onWhite: 11.62, onMidnight: 1.5 },
    ],
  },
]
