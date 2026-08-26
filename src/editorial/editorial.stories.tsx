import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, Shell } from '../components/story-shell'
import { editorialCharts } from './charts'
import { ChartStudio } from './svg-studio'

/**
 * Editorial charts — the third lane.
 *
 * TanStack Charts renders live here so the SVG can be serialized, but nothing
 * about that runtime ships. What ships is the static SVG: no script, no
 * classes, nothing to load. That is what makes a pre-alpha library safe for
 * this — a rendered SVG cannot regress.
 *
 * Every chart here is one the Chart.js embed runtime cannot draw. Each gets its
 * own story so it can be reviewed alone; "All conversions" shows the whole set.
 */
const meta: Meta = {
    title: 'Editorial/Chart Conversions',
    parameters: { layout: 'fullscreen' },
    argTypes: { mode: { control: 'inline-radio', options: ['light', 'dark'] } },
    args: { mode: 'light' },
}
export default meta
type Story = StoryObj

const byId = (id: string) => editorialCharts.find((c) => c.id === id)!

function One({ id, mode }: { id: string; mode: 'light' | 'dark' }) {
    const chart = byId(id)
    return (
        <Shell title={chart.name} wide intro={chart.note}>
            <Section title="Conversion">
                <ChartStudio chart={chart} mode={mode} />
            </Section>
        </Shell>
    )
}

export const AllConversions: Story = {
    name: 'All conversions',
    render: (args: any) => (
        <Shell
            title="Chart conversions"
            wide
            intro={
                <>
                    {editorialCharts.length} chart types the shipping runtime cannot draw, converted
                    through TanStack Charts and serialized to static SVG. Each badge reports whether
                    the conversion actually succeeded — this page is the experiment, not a claim.
                    <br />
                    <br />
                    <strong>Nothing here ships as code.</strong> TanStack is a devDependency that
                    renders only in Storybook; what you copy is a self-contained SVG with no
                    runtime, no classes and no dependencies.
                </>
            }
        >
            {editorialCharts.map((c) => (
                <Section key={c.id} title={c.name}>
                    <ChartStudio chart={c} mode={args.mode} />
                </Section>
            ))}
        </Shell>
    ),
}

export const Sankey: Story = {
    name: 'Sankey',
    render: (args: any) => <One id="sankey" mode={args.mode} />,
}

export const Treemap: Story = {
    name: 'Treemap',
    render: (args: any) => <One id="treemap" mode={args.mode} />,
}

export const Sunburst: Story = {
    name: 'Sunburst',
    render: (args: any) => <One id="sunburst" mode={args.mode} />,
}

export const Boxplot: Story = {
    name: 'Box plot',
    render: (args: any) => <One id="boxplot" mode={args.mode} />,
}

export const Violin: Story = {
    name: 'Violin',
    render: (args: any) => <One id="violin" mode={args.mode} />,
}

export const Ridgeline: Story = {
    name: 'Ridgeline',
    render: (args: any) => <One id="ridgeline" mode={args.mode} />,
}

export const Heatmap: Story = {
    name: 'Heatmap',
    render: (args: any) => <One id="heatmap" mode={args.mode} />,
}

export const Hexbin: Story = {
    name: 'Hexbin',
    render: (args: any) => <One id="hexbin" mode={args.mode} />,
}

export const Regression: Story = {
    name: 'Scatter with regression',
    render: (args: any) => <One id="regression" mode={args.mode} />,
}

export const Histogram: Story = {
    name: 'Histogram',
    render: (args: any) => <One id="histogram" mode={args.mode} />,
}

export const RangeBand: Story = {
    name: 'Interval band',
    render: (args: any) => <One id="range-band" mode={args.mode} />,
}

export const Difference: Story = {
    name: 'Difference',
    render: (args: any) => <One id="difference" mode={args.mode} />,
}

export const Waterfall: Story = {
    name: 'Waterfall',
    render: (args: any) => <One id="waterfall" mode={args.mode} />,
}

export const Tree: Story = {
    name: 'Tree / dendrogram',
    render: (args: any) => <One id="tree" mode={args.mode} />,
}

export const Id: Story = {
    name: 'Force-directed network',
    render: (args: any) => <One id="id" mode={args.mode} />,
}

export const Force: Story = {
    name: 'Voronoi',
    render: (args: any) => <One id="force" mode={args.mode} />,
}

export const Voronoi: Story = {
    name: 'Density contour',
    render: (args: any) => <One id="voronoi" mode={args.mode} />,
}

export const Density: Story = {
    name: 'Vector field',
    render: (args: any) => <One id="density" mode={args.mode} />,
}

export const Vector: Story = {
    name: 'Radial bar',
    render: (args: any) => <One id="vector" mode={args.mode} />,
}

export const RadialBar: Story = {
    name: 'Radial arc (pie substitute)',
    render: (args: any) => <One id="radial-bar" mode={args.mode} />,
}

export const RadialArc: Story = {
    name: 'Radial line',
    render: (args: any) => <One id="radial-arc" mode={args.mode} />,
}

export const RadialLine: Story = {
    name: 'Waffle',
    render: (args: any) => <One id="radial-line" mode={args.mode} />,
}
