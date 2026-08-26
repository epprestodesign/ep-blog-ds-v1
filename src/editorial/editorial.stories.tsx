import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, Shell } from '../components/story-shell'
import { editorialCharts } from './charts'
import { ChartStudio } from './svg-studio'

/**
 * Editorial charts — the third lane.
 *
 * TanStack Charts renders live here so the SVG can be serialized, but nothing
 * about that runtime ships. What ships is the static SVG: no script, no
 * classes, nothing to load. That is what makes a pre-alpha library safe to use
 * for this — a rendered SVG cannot regress.
 *
 * Every chart on this page is one our Chart.js embed runtime cannot draw.
 */
const meta: Meta = {
    title: 'Editorial/Chart Conversions',
    parameters: { layout: 'fullscreen' },
    argTypes: { mode: { control: 'inline-radio', options: ['light', 'dark'] } },
    args: { mode: 'light' },
}
export default meta
type Story = StoryObj

export const AllConversions: Story = {
    name: 'All conversions',
    render: (args: any) => (
        <Shell
            title="Chart conversions"
            wide
            intro={
                <>
                    Ten chart types our shipping runtime cannot draw, converted through TanStack
                    Charts and serialized to static SVG. Each badge reports whether the conversion
                    actually succeeded — this page is the experiment, not a claim.
                    <br />
                    <br />
                    <strong>Nothing here ships as code.</strong> TanStack is a devDependency and
                    renders only in Storybook; what you copy is a self-contained SVG with no
                    runtime, no classes and no dependencies. A pre-alpha library is safe in this
                    lane precisely because its output is frozen the moment you copy it.
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
