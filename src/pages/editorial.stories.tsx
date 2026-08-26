import type { Meta, StoryObj } from '@storybook/react-vite'
import longestTrips from '../../references/082626/longest-trips-map.html?raw'
import roomNights from '../../references/082626/room-nights-map-print.html?raw'
import { Section, Shell } from '../components/story-shell'

/**
 * The third lane of the system. Most posts are assembled from Embed Kit
 * components; a flagship piece gets a bespoke visualization authored as one
 * self-contained HTML file.
 *
 * Rendered in an iframe because each file is a complete document with its own
 * <html>, fonts and stylesheet — the same isolation Webflow gives it inside an
 * HTML Embed. Anything that renders correctly here renders correctly there.
 */
const meta: Meta = { title: 'Editorial/Bespoke Visualizations', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

function Frame({ html, height = 900 }: { html: string; height?: number }) {
    return (
        <iframe
            title="Editorial visualization"
            srcDoc={html}
            className="w-full rounded-lg border border-line bg-white"
            style={{ height }}
            sandbox="allow-scripts"
        />
    )
}

const SIZE_NOTE = (html: string) => {
    const kb = (html.length / 1024).toFixed(0)
    const over = html.length > 50000
    return (
        <>
            <strong>{Number(html.length).toLocaleString()} characters ({kb}KB).</strong>{' '}
            {over ? (
                <>
                    Over Webflow's 50,000-character cap for a Code Embed, so this cannot be pasted
                    directly. Commit it to <code>public/viz/</code> and embed a{' '}
                    <code>&lt;iframe&gt;</code> pointing at the deployed file instead — which is
                    also what keeps the article page fast, since the visualization then loads on its
                    own.
                </>
            ) : (
                <>Fits inside a Code Embed and can be pasted directly.</>
            )}
        </>
    )
}

export const LongestTrips: Story = {
    name: 'The 100 longest trips',
    render: () => (
        <Shell
            title="The 100 longest trips"
            wide
            intro="Dark editorial canvas, hand-authored inline SVG, no chart library. This is the register to reach for when the shape of the data is the story and a generic chart type would flatten it."
        >
            <Section title="Rendered" note={SIZE_NOTE(longestTrips)}>
                <Frame html={longestTrips} height={1000} />
            </Section>
            <Section
                title="Why this is not an Embed Kit chart"
                note="A bespoke piece earns its cost when the visualization is the article — a custom projection, a ranked board tied to the same hover state, annotations that only make sense for this dataset. If the answer is a line or a bar, use the Embed Kit and spend the time on the writing instead."
            >
                <div />
            </Section>
        </Shell>
    ),
}

export const RoomNights: Story = {
    name: 'Where the room nights are',
    render: () => (
        <Shell
            title="Where the room nights are"
            wide
            intro="The same construction on the light canvas, set for print. Note the type pairing — Fraunces over Inter — which is the pairing the design system adopted as the marketing brand's default."
        >
            <Section title="Rendered" note={SIZE_NOTE(roomNights)}>
                <Frame html={roomNights} height={900} />
            </Section>
        </Shell>
    ),
}
