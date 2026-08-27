import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, type ReactNode } from 'react'
import { Shell } from '../components/story-shell'
import { buildChartEmbed, type ChartConfig, type ChartType } from './builders'
import { EmbedPlayground } from './embed-playground'
import { useEmbedHtml } from './use-charts-runtime'

/**
 * A chart rendered through the shipping runtime with no playground chrome —
 * for pages that show many variants side by side, where a copy button and a
 * code panel per chart would bury the comparison.
 */
function Embed({
    type,
    config,
    title,
    mode = 'light',
}: {
    type: ChartType
    config: ChartConfig
    title: string
    mode?: 'light' | 'dark'
}) {
    const ref = useRef<HTMLDivElement>(null)
    useEmbedHtml(ref, buildChartEmbed({ type, title, config }, mode))
    return <div ref={ref} />
}

/**
 * The charts draw with the *shipped* runtime, not a React chart library — the
 * same code that runs on the live blog renders these previews. There is no
 * second rendering path that could look right here and wrong in Webflow.
 */
const meta: Meta = {
    title: 'Embed Kit/Charts',
    parameters: { layout: 'fullscreen' },
    argTypes: {
        mode: { control: 'inline-radio', options: ['light', 'dark'] },
        title: { control: 'text' },
        description: { control: 'text' },
        source: { control: 'text' },
    },
    args: { mode: 'light' },
}
export default meta
type Story = StoryObj

const PASTE = 'Paste into a Rich Text → Custom Code block. Needs the one-time runtime — see Embed Kit → Webflow Setup.'

const SEASON = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']

function ChartStory({
    args,
    type,
    config,
    intro,
}: {
    args: any
    type: ChartType
    config: ChartConfig
    intro: ReactNode
}) {
    return (
        <Shell title={args.title} intro={intro}>
            <EmbedPlayground
                title={args.title}
                instructions={PASTE}
                mode={args.mode}
                html={buildChartEmbed(
                    { type, title: args.title, description: args.description, source: args.source, config },
                    args.mode,
                )}
            />
        </Shell>
    )
}

/* ------------------------------------------------------------------ */

export const Line: Story = {
    args: {
        title: 'Room nights by month',
        description: 'Bookings peak twice a season — once at announcement, once at the cutoff date.',
        source: 'Source: EventPipe reservation data, 2025–2026 season',
        mode: 'light',
    },
    render: (args: any) => (
        <ChartStory
            args={args}
            type="line"
            intro="Use for change over time. Points are hidden until hover, because a ten-point line with visible markers reads as a dot plot. A single series drops the legend — the title already names it."
            config={{
                labels: SEASON,
                series: [
                    { label: '2025–26', values: [2100, 4800, 9200, 7400, 5100, 8800, 11200, 9600, 6300, 3900] },
                    { label: '2024–25', values: [1800, 3900, 7600, 6800, 4700, 7200, 9100, 8200, 5800, 3400] },
                ],
                valueSuffix: '',
            }}
        />
    ),
}

export const Bar: Story = {
    args: {
        title: 'Room nights by trip length',
        description: 'Trips of eight nights or more are under 2% of reservations but 11% of room nights.',
        source: 'Source: EventPipe reservation data, 2025–2026 season',
        mode: 'light',
    },
    render: (args: any) => (
        <ChartStory
            args={args}
            type="bar"
            intro="Use for comparison across categories. Bars cap at 44px so a four-category chart does not turn into four billboards."
            config={{
                labels: ['1–2 nights', '3–4 nights', '5–7 nights', '8+ nights'],
                series: [{ label: 'Room nights', values: [29100, 44600, 18200, 10400] }],
            }}
        />
    ),
}

export const HorizontalBar: Story = {
    name: 'Bar — horizontal',
    args: {
        title: 'Top origin markets',
        description: 'Ranked by room nights booked into the destination.',
        source: 'Source: EventPipe reservation data, 2025–2026 season',
        mode: 'light',
    },
    render: (args: any) => (
        <ChartStory
            args={args}
            type="bar"
            intro="Set horizontal when the category labels are names rather than short codes — rotated x-axis labels are the most common reason an otherwise good chart becomes unreadable on a phone."
            config={{
                labels: ['Dallas', 'Atlanta', 'Chicago', 'Phoenix', 'Denver', 'Nashville'],
                series: [{ label: 'Room nights', values: [8400, 7100, 6600, 4900, 4200, 3800] }],
                horizontal: true,
            }}
        />
    ),
}

export const StackedBar: Story = {
    name: 'Bar — stacked',
    args: {
        title: 'Reservations by channel',
        description: 'Direct booking overtook the call center in the second half of the season.',
        source: 'Source: EventPipe reservation data, 2025–2026 season',
        mode: 'light',
    },
    render: (args: any) => (
        <ChartStory
            args={args}
            type="bar"
            intro="Stack only when the parts genuinely sum to a meaningful whole. If the reader needs to compare the middle bands against each other, use grouped bars or a line chart instead — stacked segments that do not share a baseline are very hard to compare."
            config={{
                labels: ['Q3', 'Q4', 'Q1', 'Q2'],
                series: [
                    { label: 'Direct', values: [3200, 4100, 6800, 7400] },
                    { label: 'Call center', values: [4800, 4600, 4100, 3300] },
                    { label: 'Group block', values: [2100, 2400, 2900, 3100] },
                ],
                stacked: true,
            }}
        />
    ),
}

export const Doughnut: Story = {
    args: {
        title: 'Share of room nights by trip length',
        description: '',
        source: 'Source: EventPipe reservation data, 2025–2026 season',
        mode: 'light',
    },
    render: (args: any) => (
        <ChartStory
            args={args}
            type="doughnut"
            intro="Only for parts of a whole, and only with four or five slices at most. Anything finer-grained is a bar chart — people read length far more accurately than they read angle."
            config={{
                labels: ['1–2 nights', '3–4 nights', '5–7 nights', '8+ nights'],
                series: [{ label: 'Share', values: [31, 47, 11, 11] }],
                valueSuffix: '%',
            }}
        />
    ),
}

export const Radar: Story = {
    args: {
        title: 'Event profile comparison',
        description: 'Three event types scored across six housing dimensions. Each has a different shape, not just a different size.',
        source: 'Source: EventPipe reservation data, 2025–2026 season',
        mode: 'light',
    },
    render: (args: any) => (
        <ChartStory
            args={args}
            type="radar"
            intro={
                <>
                    For comparing a few items across the same handful of dimensions. It earns its
                    place only when the <strong>shape</strong> is the point — when two profiles
                    differ in kind rather than degree. The three event types below do: a youth
                    tournament fills its block but books late and stays short; a trade show books
                    far ahead and stays long but leaks to direct rates; a concert is almost pure
                    late walk-up. Three genuinely different silhouettes, which is the only case
                    where a radar beats a table.
                    <br />
                    <br />
                    Colours are pulled from the palette by position — teal, magenta and golden amber —
                    rather than the adjacent first two series, which are both cool and dark and sit
                    almost on top of each other once the fills overlap.
                </>
            }
            config={{
                labels: [
                    'Block fill',
                    'Lead time',
                    'Trip length',
                    'Shoulder nights',
                    'Direct share',
                    'Rebooking',
                ],
                series: [
                    { label: 'Youth tournament', values: [94, 22, 31, 18, 12, 71] },
                    { label: 'Trade show', values: [48, 91, 84, 76, 68, 34] },
                    { label: 'Concert', values: [26, 9, 14, 8, 88, 12] },
                ],
                // Positions 1, 3 and 4 — teal, magenta, amber. Chosen for
                // separation rather than palette order, because a radar overlaps
                // its fills and two cool hues become one shape.
                palette: ['#18B6C1', '#E13D8F', '#E9A126'],
                yMin: 0,
                yMax: 100,
            }}
        />
    ),
}

export const Area: Story = {
    args: {
        title: 'Cumulative room nights',
        description: 'A filled line. Use it only when the area under the curve means something — a running total, a share of capacity. Filling a line whose area is meaningless just adds ink.',
        source: 'Source: EventPipe reservation data, 2025–2026 season',
        mode: 'light',
    },
    render: (args: any) => (
        <ChartStory
            args={args}
            type="area"
            intro="Identical to the line chart except the area beneath is filled. That fill is a claim: it says the accumulated quantity matters. If it does not, use a line."
            config={{
                labels: SEASON,
                series: [{ label: 'Room nights', values: [2100, 6900, 16100, 23500, 28600, 37400, 48600, 58200, 64500, 68400] }],
            }}
        />
    ),
}

export const RangeBar: Story = {
    name: 'Range bar',
    args: {
        title: 'Booking window by event type',
        description: 'Earliest and latest reservation for each event type, in days before arrival. The bar is the spread, not a quantity.',
        source: 'Source: EventPipe reservation data, 2025–2026 season',
        mode: 'light',
    },
    render: (args: any) => (
        <ChartStory
            args={args}
            type="range-bar"
            intro={
                <>
                    Each bar spans a <strong>from</strong> and a <strong>to</strong> rather than
                    rising from zero, so it shows a spread — a booking window, a rate range, a
                    minimum and maximum stay. Horizontal suits it: the categories are names, and the
                    eye compares spans left to right more easily than up and down.
                    <br />
                    <br />
                    This is a <strong>Pro</strong> component in MUI X, so there is no reference
                    chart beside it — but Chart.js draws floating bars natively, so the shipping
                    version needs no licence and no plugin.
                </>
            }
            config={{
                labels: ['Youth sports', 'Trade show', 'Conference', 'Corporate meeting', 'Concert'],
                series: [
                    {
                        label: 'Booking window',
                        values: [
                            [14, 96],
                            [30, 210],
                            [21, 168],
                            [7, 62],
                            [3, 45],
                        ] as any,
                    },
                ],
                horizontal: true,
                rangeUnit: ' days',
                valueSuffix: '',
            }}
        />
    ),
}

export const Scatter: Story = {
    args: {
        title: 'Lead time against trip length',
        description: 'Each point is one reservation. Longer trips are booked earlier, but the relationship is weaker than it is usually assumed to be.',
        source: 'Source: EventPipe reservation data, 2025–2026 season',
        mode: 'light',
    },
    render: (args: any) => (
        <ChartStory
            args={args}
            type="scatter"
            intro="For the relationship between two continuous quantities. Both axes need titles — a scatter plot without them is unreadable, so xLabel and yLabel are effectively required rather than optional."
            config={{
                series: [
                    {
                        label: 'Reservations',
                        values: [
                            { x: 4, y: 2 }, { x: 7, y: 2 }, { x: 9, y: 3 }, { x: 12, y: 3 },
                            { x: 14, y: 4 }, { x: 18, y: 3 }, { x: 21, y: 5 }, { x: 24, y: 4 },
                            { x: 28, y: 6 }, { x: 31, y: 5 }, { x: 35, y: 7 }, { x: 38, y: 6 },
                            { x: 42, y: 9 }, { x: 46, y: 7 }, { x: 51, y: 11 }, { x: 55, y: 8 },
                            { x: 60, y: 14 }, { x: 66, y: 10 }, { x: 71, y: 17 }, { x: 78, y: 19 },
                        ],
                    },
                ],
                xLabel: 'Days booked before arrival',
                yLabel: 'Nights stayed',
            }}
        />
    ),
}

export const Sparkline: Story = {
    args: {
        title: 'Room nights, last ten months',
        description: '',
        source: '',
        mode: 'light',
    },
    render: (args: any) => (
        <ChartStory
            args={args}
            type="sparkline"
            intro="No axes, no legend, no grid — a sparkline is a shape, not a chart. It belongs beside a number in running text, showing direction rather than value. If a reader needs to read a quantity off it, it is the wrong component."
            config={{
                labels: SEASON,
                series: [{ label: 'Room nights', values: [2100, 4800, 9200, 7400, 5100, 8800, 11200, 9600, 6300, 3900] }],
            }}
        />
    ),
}

export const GaugeChart: Story = {
    name: 'Gauge',
    args: {
        title: 'Block fill rate',
        description: 'Share of the contracted room block that was actually picked up.',
        source: 'Source: EventPipe reservation data, 2025–2026 season',
        mode: 'light',
    },
    render: (args: any) => (
        <ChartStory
            args={args}
            type="gauge"
            intro="One number against a maximum, and nothing else. A gauge carries less information than the sentence it replaces, so use it when the single figure IS the story — a fill rate, a pickup percentage — and never to show change over time."
            config={{
                series: [{ label: 'Block fill', values: [82] }],
                max: 100,
                valueSuffix: '%',
                gaugeLabel: 'of contracted block',
            }}
        />
    ),
}

export const GaugeVariants: Story = {
    name: 'Gauge — variants',
    args: { mode: 'light' },
    render: (args: any) => {
        const base = { max: 100, valueSuffix: '%' }
        const specs: { title: string; note: string; config: any }[] = [
            {
                title: 'Half arc · default',
                note: '180° sweep, 72% cutout. The house default — a thin band that reads as a readout rather than a dial.',
                config: { ...base, series: [{ label: 'Fill', values: [82] }], gaugeLabel: 'of contracted block' },
            },
            {
                title: 'Half arc · heavy',
                note: '55% cutout. The band carries more weight, which suits a gauge standing alone rather than in a row.',
                config: { ...base, series: [{ label: 'Fill', values: [82] }], thickness: 55 },
            },
            {
                title: 'Dial · 270°',
                note: 'A wider sweep gives a low value more room to read as low. At 180° the difference between 12% and 20% is a sliver.',
                config: { ...base, sweep: 270, series: [{ label: 'Fill', values: [82] }] },
            },
            {
                title: 'Ring · 360°',
                note: 'A full ring. Reads as a progress indicator rather than a measurement, so keep it for completion rather than performance.',
                config: { ...base, sweep: 360, thickness: 68, series: [{ label: 'Fill', values: [82] }] },
            },
            {
                title: 'Accent colour',
                note: 'The track defaults to the series colour at 15%, so it stays tied to the value it belongs to.',
                config: { ...base, palette: ['#E13D8F'], series: [{ label: 'Fill', values: [82] }] },
            },
            {
                title: 'Explicit track',
                note: 'A neutral track detaches the remainder from the value. Use when the shortfall is not itself meaningful.',
                config: { ...base, palette: ['#E9A126'], trackColor: '#E4E8EC', series: [{ label: 'Fill', values: [82] }] },
            },
            {
                title: 'Low value',
                note: 'The case that exposes a gauge. At 14% there is almost no arc to read, and the number is doing all the work — which is the argument for writing the number in a sentence instead.',
                config: { ...base, sweep: 270, series: [{ label: 'Fill', values: [14] }] },
            },
            {
                title: 'Non-percentage scale',
                note: 'max sets what a full arc means. Here the block is 12,000 room nights, so the arc is a fraction of a real quantity rather than a percentage.',
                config: {
                    max: 12000,
                    series: [{ label: 'Picked up', values: [9840] }],
                    gaugeLabel: 'of 12,000 room nights',
                },
            },
        ]

        return (
            <Shell
                title="Gauge variants"
                wide
                intro={
                    <>
                        A gauge carries one number against a maximum and nothing else — less
                        information than the sentence it replaces. These are the levers worth
                        having: <code>sweep</code> for arc span, <code>thickness</code> for the
                        band, <code>palette</code> and <code>trackColor</code> for colour.
                        <br />
                        <br />
                        The last two are the useful ones to look at. A low value at 180° is nearly
                        unreadable, and a non-percentage <code>max</code> is what makes a gauge
                        about a real quantity rather than a ratio.
                    </>
                }
            >
                <div className="grid gap-8 lg:grid-cols-2">
                    {specs.map((spec) => (
                        <div key={spec.title} className="flex flex-col gap-2">
                            <div>
                                <h3 className="text-[13.5px] font-semibold text-ink">{spec.title}</h3>
                                <p className="mt-0.5 max-w-[52ch] text-[12.5px] leading-relaxed text-subtle">
                                    {spec.note}
                                </p>
                            </div>
                            <Embed type="gauge" title={spec.title} config={spec.config} mode={args.mode} />
                        </div>
                    ))}
                </div>
            </Shell>
        )
    },
}

export const Pie: Story = {
    args: {
        title: 'Share of room nights by trip length',
        description: 'A true pie rather than a doughnut. Prefer the doughnut — the hole gives the labels somewhere to breathe.',
        source: 'Source: EventPipe reservation data, 2025–2026 season',
        mode: 'light',
    },
    render: (args: any) => (
        <ChartStory
            args={args}
            type="pie"
            intro="Same constraints as the doughnut: parts of a whole, four or five slices at most. The doughnut is the house default; this exists for the occasional layout where the centre hole reads as a hole rather than as breathing room."
            config={{
                labels: ['1–2 nights', '3–4 nights', '5–7 nights', '8+ nights'],
                series: [{ label: 'Share', values: [31, 47, 11, 11] }],
                valueSuffix: '%',
            }}
        />
    ),
}

export const DarkCanvas: Story = {
    name: 'Dark canvas',
    args: {
        title: 'Room nights by month',
        description: 'The same chart on the dark canvas — no per-chart configuration.',
        source: 'Source: EventPipe reservation data, 2025–2026 season',
        mode: 'dark',
    },
    render: (args: any) => (
        <ChartStory
            args={args}
            type="line"
            intro="Set the embed to dark and the runtime re-reads its grid, label, series and tooltip colors from the scoped tokens. Nothing about the chart's data changes — only where it is standing."
            config={{
                labels: SEASON,
                series: [
                    { label: '2025–26', values: [2100, 4800, 9200, 7400, 5100, 8800, 11200, 9600, 6300, 3900] },
                    { label: '2024–25', values: [1800, 3900, 7600, 6800, 4700, 7200, 9100, 8200, 5800, 3400] },
                ],
            }}
        />
    ),
}
