import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, Shell } from '../story-shell'
import { Ramp } from './parts'

const meta: Meta = { title: 'Foundations/Palette', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

/**
 * Tier 1. Nothing here carries meaning and nothing downstream may reference it
 * directly — use a semantic role from Colors instead.
 */
export const Primitives: Story = {
    render: () => (
        <Shell
            title="Palette"
            wide
            intro={
                <>
                    Tier 1 primitives. Nothing here carries meaning, and nothing downstream may
                    reference a ramp directly — use a role from <strong>Colors</strong>. The product
                    ramps are ported verbatim from the EventPipe product design system, so wherever
                    the blog and the admin platform overlap they resolve to identical hexes.
                </>
            }
        >
            <Section title="Blog brand" note="The blog's own hues, anchored on the values used by the editorial visualizations in references/.">
                <div className="flex flex-col gap-4">
                    <Ramp hue="brand" label="Brand — teal, anchored on #00ADB3 (600)" />
                    <Ramp hue="midnight" label="Midnight — canvas and ink, anchored on #10163E (900)" />
                    <Ramp hue="harbor" label="Harbor — secondary editorial blue, anchored on #093E60 (800)" />
                </div>
            </Section>

            <Section title="Product" note="Ported from eventpipe-prototype-ds. These drive the product brand theme.">
                <div className="flex flex-col gap-4">
                    <Ramp hue="azure" label="Azure — product primary action, anchored on #1876D2 (600)" />
                    <Ramp hue="graphite" label="Graphite — product neutral, anchored on #8C92A0 (500)" />
                    <Ramp hue="navy" label="Navy — product chrome, anchored on #00123D (900)" />
                </div>
            </Section>

            <Section title="Status hues">
                <div className="flex flex-col gap-4">
                    <Ramp hue="green" label="Green" />
                    <Ramp hue="amber" label="Amber" />
                    <Ramp hue="red" label="Red" />
                    <Ramp hue="blue" label="Blue" />
                </div>
            </Section>

            <Section title="Extended" note="Available for chart series and one-off editorial needs. Prefer the chart series roles first — they are ordered for legibility.">
                <div className="flex flex-col gap-4">
                    <Ramp hue="violet" label="Violet" />
                    <Ramp hue="pink" label="Pink" />
                    <Ramp hue="orange" label="Orange" />
                    <Ramp hue="teal" label="Teal (Tailwind)" />
                    <Ramp hue="zinc" label="Zinc" />
                </div>
            </Section>
        </Shell>
    ),
}
