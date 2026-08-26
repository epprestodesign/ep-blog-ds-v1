import type { Meta, StoryObj } from '@storybook/react-vite'
import { Shell } from '../components/story-shell'
import { buildChartEmbed, type ChartConfig } from './builders'
import { EmbedPlayground } from './embed-playground'

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
    type: 'line' | 'bar' | 'doughnut' | 'radar'
    config: ChartConfig
    intro: string
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
        description: 'Two events of similar size, scored across six housing dimensions.',
        source: 'Source: EventPipe reservation data, 2025–2026 season',
        mode: 'light',
    },
    render: (args: any) => (
        <ChartStory
            args={args}
            type="radar"
            intro="For comparing two or three items across the same handful of dimensions. Rarely the right chart — reach for it only when the shape of the profile is the actual point."
            config={{
                labels: ['Block fill', 'Lead time', 'Trip length', 'Shoulder nights', 'Direct share', 'Rebooking'],
                series: [
                    { label: 'Crane Expo', values: [82, 64, 71, 55, 78, 61] },
                    { label: 'Summit West', values: [61, 88, 49, 74, 52, 80] },
                ],
                yMin: 0,
                yMax: 100,
            }}
        />
    ),
}

export const DarkCanvas: Story = {
    name: 'Dark canvas',
    args: {
        title: 'Room nights by month',
        description: 'The same chart on the dark editorial canvas — no per-chart configuration.',
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
