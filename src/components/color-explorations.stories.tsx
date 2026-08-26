import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef } from 'react'
import { EXPLORATION_SOURCE, colorSchemes, type ColorScheme } from './foundations/color-schemes.data'
import {
    JUSTIN_STEPS,
    closestPairs,
    justinColors,
    justinDataViz,
    justinRamps,
} from './foundations/justin-palette.data'
import { buildChartEmbed, type ChartType } from '../webflow-embeds/builders'
import { useEmbedHtml } from '../webflow-embeds/use-charts-runtime'
import { Section, Shell } from './story-shell'

/**
 * Colour explorations — proposals, not decisions.
 *
 * Every scheme is generated from the brand by rotating hue in OKLCH, so each
 * palette is a true derivation rather than a set of colours that merely look
 * adjacent. Nothing here is wired into the token layer; the point is to see
 * each scheme carrying real data before any of it becomes a token.
 *
 * Each is shown on a stacked bar, a pie and a doughnut, because those are the
 * three places a palette is put under the most pressure — many series at once,
 * touching each other, with no axis to help tell them apart.
 */
const meta: Meta = {
    title: 'Color Explorations',
    parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4']
const SERIES = [
    'Direct', 'Call center', 'Group block', 'Partner', 'Walk-in',
    'OTA', 'Corporate', 'Rebooking', 'Comp', 'Other',
]
const STACKED = [
    [6800, 7400, 3200, 4100],
    [4100, 3300, 4800, 4600],
    [2900, 3100, 2100, 2400],
    [1800, 2200, 1500, 1700],
    [900, 1100, 700, 800],
    [1400, 1600, 1100, 1300],
    [1100, 900, 1300, 1000],
    [700, 800, 600, 750],
    [500, 450, 520, 480],
    [300, 350, 280, 320],
]
const SHARE = [24, 18, 14, 11, 9, 7, 6, 5, 4, 2]

/** Renders through the shipping runtime, so these previews are the real thing. */
function Chart({
    type,
    palette,
    title,
    height,
    count = 5,
}: {
    type: ChartType
    palette: string[]
    title: string
    height?: number
    /** How many series to draw. Raising it is how a palette gets stress-tested. */
    count?: number
}) {
    const ref = useRef<HTMLDivElement>(null)
    const labels = SERIES.slice(0, count)
    const config =
        type === 'bar'
            ? {
                  labels: QUARTERS,
                  series: labels.map((label, i) => ({ label, values: STACKED[i % STACKED.length] })),
                  stacked: true,
                  palette,
              }
            : {
                  labels,
                  series: [{ label: 'Share', values: SHARE.slice(0, count) }],
                  valueSuffix: '%',
                  palette,
              }
    const html = buildChartEmbed({ type, title, config })
    useEmbedHtml(ref, html)
    return <div ref={ref} style={height ? { minHeight: height } : undefined} />
}

function Swatches({ scheme }: { scheme: ColorScheme }) {
    return (
        <div className="grid grid-cols-5 gap-3">
            {scheme.colors.map((hex, i) => (
                <div key={hex + i} className="flex flex-col gap-1.5">
                    <div className="h-16 w-full rounded-lg ring-1 ring-black/10 ring-inset" style={{ background: hex }} />
                    <div>
                        <code className="text-[11.5px] font-medium text-ink">{hex.toLowerCase()}</code>
                        <div
                            className={
                                scheme.onWhite[i] >= 4.5
                                    ? 'text-[10.5px] font-semibold text-ink'
                                    : 'text-[10.5px] text-subtlest'
                            }
                            title="Contrast against white"
                        >
                            {scheme.onWhite[i].toFixed(1)}:1
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function SchemePage({ scheme }: { scheme: ColorScheme }) {
    return (
        <Shell
            title={scheme.name}
            wide
            intro={
                <>
                    {scheme.description} Derived from <code>{EXPLORATION_SOURCE}</code> by rotating
                    hue in OKLCH, so perceived lightness stays even across the set.
                </>
            }
        >
            <Section title="Palette" note="Figures under each swatch are contrast against white; bold clears 4.5:1 for body text.">
                <Swatches scheme={scheme} />
            </Section>

            <Section
                title="Stacked bar"
                note="The hardest test: five series touching each other with no gap and no axis to separate them."
            >
                <Chart type="bar" palette={scheme.colors} title="Reservations by channel" height={380} />
            </Section>

            <Section title="Pie and doughnut">
                <div className="grid gap-6 lg:grid-cols-2">
                    <Chart type="pie" palette={scheme.colors} title="Share by channel" height={400} />
                    <Chart type="doughnut" palette={scheme.colors} title="Share by channel" height={400} />
                </div>
            </Section>
        </Shell>
    )
}

export const Overview: Story = {
    render: () => (
        <Shell
            title="Colour explorations"
            wide
            intro={
                <>
                    Ten harmony schemes generated from <code>{EXPLORATION_SOURCE}</code>. Each
                    rotates hue in OKLCH and holds perceived lightness even, so no series looks
                    emphasised by accident. Where a scheme has fewer base hues than the five a chart
                    needs, the rest come from lightness steps of those same hues rather than
                    unrelated ones — otherwise the scheme stops being the scheme.
                    <br />
                    <br />
                    These are proposals. None is wired into the token layer. Open a scheme in the
                    sidebar to see it carrying real data.
                </>
            }
        >
            {colorSchemes.map((s) => (
                <Section key={s.key} title={s.name} note={s.description}>
                    <Swatches scheme={s} />
                </Section>
            ))}
        </Shell>
    ),
}

export const Monochromatic: Story = {
    name: 'Monochromatic',
    render: () => <SchemePage scheme={colorSchemes.find((s) => s.key === 'monochromatic')!} />,
}

export const Analogous: Story = {
    name: 'Analogous',
    render: () => <SchemePage scheme={colorSchemes.find((s) => s.key === 'analogous')!} />,
}

export const AnalogousWide: Story = {
    name: 'Analogous (wide)',
    render: () => <SchemePage scheme={colorSchemes.find((s) => s.key === 'analogous-wide')!} />,
}

export const Complementary: Story = {
    name: 'Complementary',
    render: () => <SchemePage scheme={colorSchemes.find((s) => s.key === 'complementary')!} />,
}

export const SplitComplementary: Story = {
    name: 'Split-complementary',
    render: () => <SchemePage scheme={colorSchemes.find((s) => s.key === 'split-complementary')!} />,
}

export const Triadic: Story = {
    name: 'Triadic',
    render: () => <SchemePage scheme={colorSchemes.find((s) => s.key === 'triadic')!} />,
}

export const Square: Story = {
    name: 'Square',
    render: () => <SchemePage scheme={colorSchemes.find((s) => s.key === 'square')!} />,
}

export const Tetradic: Story = {
    name: 'Tetradic (rectangle)',
    render: () => <SchemePage scheme={colorSchemes.find((s) => s.key === 'tetradic')!} />,
}

export const DoubleSplit: Story = {
    name: 'Double split-complementary',
    render: () => <SchemePage scheme={colorSchemes.find((s) => s.key === 'double-split')!} />,
}

export const AccentedNeutral: Story = {
    name: 'Accented neutral',
    render: () => <SchemePage scheme={colorSchemes.find((s) => s.key === 'accented-neutral')!} />,
}

/* ==========================================================================
   Justin's Exploration — hand-authored rather than generated.
   ========================================================================== */

function RampRow({ name, steps }: { name: string; steps: Record<string, string> }) {
    return (
        <div>
            <div className="mb-1.5 text-[12.5px] font-medium text-ink">{name}</div>
            <div className="flex overflow-hidden rounded-md border border-line">
                {JUSTIN_STEPS.map((k) => (
                    <div
                        key={k}
                        className="flex h-12 flex-1 items-end justify-center pb-1 text-[9px] font-medium"
                        style={{
                            background: steps[k],
                            color: Number(k) >= 500 ? 'rgba(255,255,255,.85)' : 'rgba(16,22,62,.55)',
                        }}
                        title={`${name}-${k} · ${steps[k]}`}
                    >
                        {k}
                    </div>
                ))}
            </div>
        </div>
    )
}

export const JustinsExploration: Story = {
    name: "Justin's Exploration",
    render: () => (
        <Shell
            title="Justin's Exploration"
            wide
            intro={
                <>
                    Hand-authored rather than derived — ten hues at eleven steps, with a fixed
                    data-visualization order. Everything below uses the supplied hexes verbatim;
                    nothing is recomputed. The analysis at the foot of the page is measured from
                    them.
                    <br />
                    <br />
                    The <strong>order</strong> is the load-bearing part. A chart with N series takes
                    the first N colours, so position 2 has to be distinguishable from position 1 far
                    more urgently than position 10 does from position 9.
                </>
            }
        >
            <Section
                title="Data visualization order"
                note="Series 1 through 10, in the order a chart consumes them. Figures are contrast against white and against the Midnight canvas."
            >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {justinDataViz.map((d) => (
                        <div key={d.hex} className="flex flex-col gap-1.5">
                            <div
                                className="flex h-16 w-full items-start justify-end rounded-lg p-1.5 ring-1 ring-black/10 ring-inset"
                                style={{ background: d.hex }}
                            >
                                <span className="text-[10px] font-semibold text-white/80">{d.position}</span>
                            </div>
                            <div>
                                <div className="text-[12px] font-medium text-ink">{d.name}</div>
                                <code className="text-[10.5px] text-subtlest">{d.hex.toLowerCase()}</code>
                                <div className="mt-0.5 text-[10px] text-subtle">
                                    <span className={d.onWhite >= 4.5 ? 'font-semibold text-ink' : ''}>
                                        {d.onWhite.toFixed(1)}
                                    </span>
                                    {' / '}
                                    <span className={d.onMidnight >= 4.5 ? 'font-semibold text-ink' : ''}>
                                        {d.onMidnight.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Ramps" note="Eleven steps per hue. 500 is the anchor and the step that appears in the order above.">
                <div className="flex flex-col gap-4">
                    {justinRamps.map((r) => (
                        <RampRow key={r.name} name={r.name} steps={r.steps} />
                    ))}
                </div>
            </Section>

            <Section
                title="Five series"
                note="The realistic case. Most editorial charts never exceed five, and this is where the palette is strongest — the first five hues are well separated."
            >
                <Chart type="bar" palette={justinColors} title="Reservations by channel" height={380} />
            </Section>

            <Section title="Pie and doughnut">
                <div className="grid gap-6 lg:grid-cols-2">
                    <Chart type="pie" palette={justinColors} title="Share by channel" height={400} />
                    <Chart type="doughnut" palette={justinColors} title="Share by channel" height={400} />
                </div>
            </Section>

            <Section
                title="All ten series"
                note="The stress test. Ten touching bands is more than any editorial chart should carry, but it is where a palette's weak pairs show themselves."
            >
                <Chart type="bar" palette={justinColors} title="Reservations by channel — all ten" height={420} count={10} />
                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <Chart type="doughnut" palette={justinColors} title="Share — all ten" height={420} count={10} />
                    <Chart type="pie" palette={justinColors} title="Share — all ten" height={420} count={10} />
                </div>
            </Section>

            <Section
                title="Analysis"
                note="Measured from the supplied hexes, in OKLab and OKLCH — the same method used for the generated schemes, so the two are comparable."
            >
                <div className="flex flex-col gap-5 text-[13.5px] leading-relaxed text-subtle">
                    <div>
                        <h4 className="mb-1 text-[13.5px] font-semibold text-ink">
                            Navy is the outlier, and it is the one real problem
                        </h4>
                        <p className="max-w-[76ch]">
                            At OKLCH lightness <strong>0.351</strong> against a set averaging{' '}
                            <strong>0.593</strong>, Navy is far darker than every other series. In a
                            stacked bar it reads as heavier and more important than its neighbours
                            regardless of its value. It also scores <strong>1.55:1</strong> against
                            the Midnight canvas, so on the dark theme it is effectively invisible —
                            a dark navy band on a dark navy ground. If the dark canvas matters,
                            Navy needs a lighter step (600 or 500 of a lifted ramp) for charts,
                            keeping the current value for the light theme only.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-1 text-[13.5px] font-semibold text-ink">
                            The warm end crowds
                        </h4>
                        <p className="max-w-[76ch]">
                            Coral, Orange and Gold sit within 47° of hue of each other. Coral and
                            Orange are the closest pair in the whole set at an OKLab distance of{' '}
                            <strong>0.050</strong> — close enough to be confused when adjacent.
                            They are positions 7 and 10, so it only bites on charts with eight or
                            more series, which is the right place for the weakness to be. Gold and
                            Orange (positions 4 and 10) are the next closest at 0.079.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-1 text-[13.5px] font-semibold text-ink">The ordering is sound</h4>
                        <p className="max-w-[76ch]">
                            The first six are well spread around the wheel, and the closest pair
                            among them — Teal and Green at 0.102 — sits at positions 1 and 6, about
                            as far apart in the order as it can be. Nothing needs reordering for
                            the common cases.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-1 text-[13.5px] font-semibold text-ink">
                            Nothing clears 4.5:1 for text on white
                        </h4>
                        <p className="max-w-[76ch]">
                            Only Navy (11.2), Plum (5.5), Violet (5.2) and Magenta (4.2, marginal)
                            come close. That is fine — these are <em>fills</em>, and a fill does not
                            need text contrast. It does mean none of the 500 steps should be used
                            for coloured type on white; the 700–900 steps of each ramp exist for
                            that.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px] border-collapse text-[13px]">
                            <thead>
                                <tr>
                                    {['Closest pairs', 'OKLab distance', 'Positions'].map((h) => (
                                        <th
                                            key={h}
                                            className="border-b border-line pr-4 pb-2 text-left text-[10px] font-semibold tracking-[0.1em] text-subtle uppercase"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {closestPairs.map((p) => (
                                    <tr key={p.a + p.b}>
                                        <td className="border-b border-line-subtle py-2 pr-4 font-medium text-ink">
                                            {p.a} vs {p.b}
                                        </td>
                                        <td className="border-b border-line-subtle py-2 pr-4 tabular-nums">
                                            <span className={p.distance < 0.09 ? 'font-semibold text-ink' : 'text-subtle'}>
                                                {p.distance.toFixed(3)}
                                            </span>
                                        </td>
                                        <td className="border-b border-line-subtle py-2 text-subtle">{p.positions}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="mt-2 text-xs text-subtlest">
                            Bold marks pairs under 0.09, the rough threshold where two fills become
                            hard to tell apart side by side.
                        </p>
                    </div>
                </div>
            </Section>
        </Shell>
    ),
}
