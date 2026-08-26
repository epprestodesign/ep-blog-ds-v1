/**
 * Colour explorations — every standard harmony scheme derived from the brand.
 *
 * Generated, not hand-picked: each scheme rotates hue in OKLCH from the source
 * and varies lightness/chroma only where the scheme itself calls for it.
 * Rotating in HSL would give hues of unequal perceived lightness, which reads
 * as some series being emphasised when they are not.
 *
 * Where a scheme has fewer base hues than the five colours a chart needs, the
 * remainder come from lightness steps of those same hues rather than from
 * unrelated ones — otherwise the scheme stops being the scheme.
 *
 * These are proposals for review. None of them is wired into the token layer.
 */

export interface ColorScheme {
  key: string
  name: string
  description: string
  /** Five colours, ordered as a chart should consume them. */
  colors: string[]
  /** Contrast of each colour against white, for the accessibility read-out. */
  onWhite: number[]
}

export const EXPLORATION_SOURCE = '#02ADB3'

export const colorSchemes: ColorScheme[] = [
  {
    key: 'monochromatic',
    name: 'Monochromatic',
    description:
      'One hue, five lightness steps. The safest option and the least informative: with no hue difference, series are told apart only by lightness, which is exactly what fails in greyscale print and for most colour-vision deficiencies.',
    colors: ['#B6E9EB', '#72CBCF', '#02ADB3', '#00888D', '#006568'],
    onWhite: [1.33, 1.88, 2.75, 4.28, 6.86],
  },
  {
    key: 'analogous',
    name: 'Analogous',
    description:
      'Neighbouring hues, 30° apart. Reads as one family. Good for ordered data — stages of a funnel, buckets of a range — and poor for unrelated categories, which end up looking related.',
    colors: ['#5FC0A0', '#1DAFA0', '#02ADB3', '#1AAAC3', '#5CB7DF'],
    onWhite: [2.2, 2.73, 2.75, 2.77, 2.26],
  },
  {
    key: 'analogous-wide',
    name: 'Analogous (wide)',
    description:
      'The same idea opened to 60°. More separation between adjacent series while still reading as a spectrum rather than a set of unrelated colours.',
    colors: ['#85B778', '#3CAF8C', '#02ADB3', '#38A5D1', '#80A9E9'],
    onWhite: [2.32, 2.73, 2.75, 2.81, 2.39],
  },
  {
    key: 'complementary',
    name: 'Complementary',
    description:
      'The brand and its opposite, plus lightness steps of each. Maximum separation between exactly two groups — use it when the chart is fundamentally an us-versus-them comparison.',
    colors: ['#8DD2D5', '#02ADB3', '#007E83', '#D6797B', '#F1B1B1'],
    onWhite: [1.71, 2.75, 4.87, 3.05, 1.8],
  },
  {
    key: 'split-complementary',
    name: 'Split-complementary',
    description:
      'The brand plus the two hues flanking its opposite. Nearly the contrast of a true complement without the vibration two exact opposites produce at high chroma.',
    colors: ['#8ACFD2', '#02ADB3', '#CD79A3', '#D18155', '#E9B396'],
    onWhite: [1.76, 2.75, 3.06, 3.01, 1.85],
  },
  {
    key: 'triadic',
    name: 'Triadic',
    description:
      'Three hues evenly spaced at 120°. The most balanced way to show three genuinely unrelated categories — no colour dominates.',
    colors: ['#02ADB3', '#B780C5', '#BE8F3A', '#96D4D7', '#DBB9E4'],
    onWhite: [2.75, 3.04, 2.92, 1.65, 1.74],
  },
  {
    key: 'square',
    name: 'Square',
    description:
      'Four hues at 90°. Four distinct categories with no implied ordering. Busy by nature — if the chart needs more than four, the chart is the problem.',
    colors: ['#02ADB3', '#968BDA', '#D6797B', '#9E9E41', '#9ED6D9'],
    onWhite: [2.75, 3.0, 3.05, 2.83, 1.61],
  },
  {
    key: 'tetradic',
    name: 'Tetradic (rectangle)',
    description:
      'Two complementary pairs, 60° apart. Effectively two teams of two, which suits data that is grouped and then split within each group.',
    colors: ['#02ADB3', '#6C99DF', '#D6797B', '#BE8F3A', '#AFC9F1'],
    onWhite: [2.75, 2.89, 3.05, 2.92, 1.69],
  },
  {
    key: 'double-split',
    name: 'Double split-complementary',
    description:
      'Both split pairs at once — four hues clustered around the brand and its opposite. The widest set that still reads as deliberate rather than arbitrary.',
    colors: ['#3CAF8C', '#38A5D1', '#CD79A3', '#D18155', '#9ED6D9'],
    onWhite: [2.73, 2.81, 3.06, 3.01, 1.61],
  },
  {
    key: 'accented-neutral',
    name: 'Accented neutral',
    description:
      'The brand at full chroma against four near-neutral steps of the same hue. For charts with one figure that matters and several that are context.',
    colors: ['#02ADB3', '#C2CDCD', '#9FAEAE', '#7A8A8A', '#5E6C6C'],
    onWhite: [2.75, 1.63, 2.3, 3.6, 5.47],
  },
]
