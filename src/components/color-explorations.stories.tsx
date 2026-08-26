import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef } from 'react'
import { EXPLORATION_SOURCE, colorSchemes, type ColorScheme } from './foundations/color-schemes.data'
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
const SERIES = ['Direct', 'Call center', 'Group block', 'Partner', 'Walk-in']
const STACKED = [
    [6800, 7400, 3200, 4100],
    [4100, 3300, 4800, 4600],
    [2900, 3100, 2100, 2400],
    [1800, 2200, 1500, 1700],
    [900, 1100, 700, 800],
]
const SHARE = [38, 24, 18, 13, 7]

/** Renders through the shipping runtime, so these previews are the real thing. */
function Chart({ type, palette, title, height }: { type: ChartType; palette: string[]; title: string; height?: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const config =
        type === 'bar'
            ? {
                  labels: QUARTERS,
                  series: SERIES.map((label, i) => ({ label, values: STACKED[i] })),
                  stacked: true,
                  palette,
              }
            : { labels: SERIES, series: [{ label: 'Share', values: SHARE }], valueSuffix: '%', palette }
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
