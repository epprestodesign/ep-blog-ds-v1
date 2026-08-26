import type { Meta, StoryObj } from '@storybook/react-vite'
import { BarChart } from '@mui/x-charts/BarChart'
import { LineChart } from '@mui/x-charts/LineChart'
import { PieChart } from '@mui/x-charts/PieChart'
import { useRef, type ReactNode } from 'react'
import { buildChartEmbed, type ChartConfig, type ChartType } from '../../webflow-embeds/builders'
import { useChartsRuntime } from '../../webflow-embeds/use-charts-runtime'
import { Section, Shell } from '../story-shell'
import { MuiChartFrame, axisTextStyle, chartSx } from './mui-reference'

/**
 * Embed Kit → Charts → Reference
 *
 * MUI X on the left as the visual target, the shipping Chart.js embed on the
 * right, same data and same tokens on both sides. Only the right-hand column
 * can reach Webflow; the left exists to be matched.
 */
const meta: Meta = {
    title: 'Embed Kit/Charts',
    parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const SEASON = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']
const S1 = [2100, 4800, 9200, 7400, 5100, 8800, 11200, 9600, 6300, 3900]
const S2 = [1800, 3900, 7600, 6800, 4700, 7200, 9100, 8200, 5800, 3400]

const TRIP_LABELS = ['1–2 nights', '3–4 nights', '5–7 nights', '8+ nights']
const TRIP_VALUES = [29100, 44600, 18200, 10400]

/** Renders a shipping embed with the same runtime the live blog uses. */
function Embed({ type, config, title }: { type: ChartType; config: ChartConfig; title: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const html = buildChartEmbed({ type, title, config })
    useChartsRuntime(ref, [html])
    return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
}

function Pair({ label, note, mui, embed }: { label: string; note?: string; mui: ReactNode; embed: ReactNode }) {
    return (
        <Section title={label} note={note}>
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-semibold tracking-[0.14em] text-subtle uppercase">
                        MUI X · reference
                    </span>
                    <div className="rounded-lg border border-line bg-surface p-4">{mui}</div>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-semibold tracking-[0.14em] text-accent uppercase">
                        Chart.js · ships to Webflow
                    </span>
                    {embed}
                </div>
            </div>
        </Section>
    )
}

export const Reference: Story = {
    name: 'Reference — MUI X vs shipped',
    render: () => (
        <Shell
            title="Chart reference"
            wide
            intro={
                <>
                    MUI X on the left as the visual target, the shipping Chart.js embed on the
                    right. Both read the same <code>--ep-chart-*</code> tokens and both follow the
                    Brand and Mode toolbars, so any difference you see is a genuine styling gap
                    rather than a palette mismatch. <strong>Only the right column ships</strong> —
                    MUI X is React and Emotion, and cannot run inside a Webflow embed. It lives in{' '}
                    <code>devDependencies</code> and never reaches <code>src/webflow-embeds/</code>.
                </>
            }
        >
            <MuiChartFrame>
                {(t) => (
                    <>
                        <Pair
                            label="Line"
                            note="Watch the point markers, the curve tension and the gap between legend swatch and label — those are the three places the two engines drift most."
                            mui={
                                <LineChart
                                    height={320}
                                    colors={t?.series}
                                    grid={{ horizontal: true }}
                                    xAxis={[{ scaleType: 'point', data: SEASON, tickLabelStyle: axisTextStyle(t) }]}
                                    yAxis={[{ tickLabelStyle: axisTextStyle(t), width: 52 }]}
                                    series={[
                                        { data: S1, label: '2025–26', showMark: false, curve: 'monotoneX' },
                                        { data: S2, label: '2024–25', showMark: false, curve: 'monotoneX' },
                                    ]}
                                    sx={chartSx(t)}
                                />
                            }
                            embed={
                                <Embed
                                    type="line"
                                    title="Room nights by month"
                                    config={{
                                        labels: SEASON,
                                        series: [
                                            { label: '2025–26', values: S1 },
                                            { label: '2024–25', values: S2 },
                                        ],
                                    }}
                                />
                            }
                        />

                        <Pair
                            label="Bar"
                            note="MUI X uses square corners and a wider default bar. Ours rounds to 3px and caps at 44px — a deliberate divergence, not a gap."
                            mui={
                                <BarChart
                                    height={320}
                                    colors={t?.series}
                                    grid={{ horizontal: true }}
                                    xAxis={[{ scaleType: 'band', data: TRIP_LABELS, tickLabelStyle: axisTextStyle(t) }]}
                                    yAxis={[{ tickLabelStyle: axisTextStyle(t), width: 52 }]}
                                    series={[{ data: TRIP_VALUES, label: 'Room nights' }]}
                                    sx={chartSx(t)}
                                />
                            }
                            embed={
                                <Embed
                                    type="bar"
                                    title="Room nights by trip length"
                                    config={{
                                        labels: TRIP_LABELS,
                                        series: [{ label: 'Room nights', values: TRIP_VALUES }],
                                    }}
                                />
                            }
                        />

                        <Pair
                            label="Pie / doughnut"
                            note="MUI X draws a true pie by default; the embed is a doughnut. Compare the legend placement and the slice separation rather than the hole."
                            mui={
                                <PieChart
                                    height={340}
                                    colors={t?.series}
                                    series={[
                                        {
                                            innerRadius: 60,
                                            paddingAngle: 1,
                                            cornerRadius: 2,
                                            data: TRIP_LABELS.map((label, i) => ({
                                                id: i,
                                                value: [31, 47, 11, 11][i],
                                                label,
                                            })),
                                        },
                                    ]}
                                    sx={chartSx(t)}
                                />
                            }
                            embed={
                                <Embed
                                    type="doughnut"
                                    title="Share of room nights by trip length"
                                    config={{
                                        labels: TRIP_LABELS,
                                        series: [{ label: 'Share', values: [31, 47, 11, 11] }],
                                        valueSuffix: '%',
                                    }}
                                />
                            }
                        />
                    </>
                )}
            </MuiChartFrame>

            <Section
                title="Where the two deliberately differ"
                note="Not every difference is a defect. These are choices, recorded so nobody 'fixes' them later."
            >
                <ul className="flex max-w-[76ch] flex-col gap-2 text-[13px] text-subtle">
                    <li>
                        <strong className="text-ink">Bar corners.</strong> MUI X squares them; the
                        embed rounds to 3px and caps bar width at 44px, so a four-category chart
                        does not become four billboards.
                    </li>
                    <li>
                        <strong className="text-ink">Line markers.</strong> Both hide points until
                        hover. A ten-point line with visible markers reads as a dot plot.
                    </li>
                    <li>
                        <strong className="text-ink">Single-series legend.</strong> The embed drops
                        it entirely — the chart title already names the series. MUI X keeps it.
                    </li>
                    <li>
                        <strong className="text-ink">Panel chrome.</strong> The embed carries its own
                        bordered card, title, description and source line. MUI X renders the plot
                        alone; the surrounding card here is added by this page.
                    </li>
                </ul>
            </Section>
        </Shell>
    ),
}
