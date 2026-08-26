import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, Shell } from '../story-shell'

const meta: Meta = {
    title: 'Foundations/Palette',
    parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

/** Reads the live computed value, so every swatch reflects whichever
 *  brand/mode the toolbar is currently set to rather than a copied hex. */
function Swatch({ name, token }: { name: string; token: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div
                className="h-14 rounded-md border border-line"
                style={{ background: `var(${token})` }}
            />
            <div>
                <div className="text-[12.5px] font-medium text-ink">{name}</div>
                <code className="text-[10.5px] text-subtlest">{token}</code>
            </div>
        </div>
    )
}

function Grid({ items }: { items: [string, string][] }) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map(([name, token]) => (
                <Swatch key={token} name={name} token={token} />
            ))}
        </div>
    )
}

function Ramp({ hue, label }: { hue: string; label: string }) {
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    return (
        <div>
            <div className="mb-1.5 text-[12.5px] font-medium text-ink">{label}</div>
            <div className="flex overflow-hidden rounded-md border border-line">
                {steps.map((s) => (
                    <div
                        key={s}
                        className="flex h-12 flex-1 items-end justify-center pb-1 text-[9px] font-medium"
                        style={{
                            background: `var(--ep-palette-${hue}-${s})`,
                            color: s >= 500 ? 'rgba(255,255,255,.85)' : 'rgba(16,22,62,.55)',
                        }}
                        title={`--ep-palette-${hue}-${s}`}
                    >
                        {s}
                    </div>
                ))}
            </div>
        </div>
    )
}

export const Semantic: Story = {
    render: () => (
        <Shell
            title="Palette"
            intro={
                <>
                    Three tiers. <strong>Primitives</strong> are raw ramps with no meaning.{' '}
                    <strong>Semantic roles</strong> are the only tier anything downstream may use.
                    The <strong>embed stylesheet</strong> carries a resolved copy of the roles,
                    scoped to <code>.ep-blog</code>, because Webflow has no access to the rest of
                    the token layer. Switch Brand and Mode in the toolbar — every swatch below
                    reads its live computed value.
                </>
            }
        >
            <Section title="Surface" note="Canvas is the page. Surface is anything sitting on it — cards, callouts, chart panels.">
                <Grid
                    items={[
                        ['Canvas', '--ep-color-canvas'],
                        ['Surface', '--ep-color-surface'],
                        ['Sunken', '--ep-color-surface-sunken'],
                        ['Inset', '--ep-color-surface-inset'],
                    ]}
                />
            </Section>

            <Section title="Text" note="Body copy uses Text. Subtle is for captions, labels and metric descriptions; Subtlest only for eyebrow-scale metadata.">
                <Grid
                    items={[
                        ['Text', '--ep-color-text'],
                        ['Subtle', '--ep-color-text-subtle'],
                        ['Subtlest', '--ep-color-text-subtlest'],
                        ['Inverse', '--ep-color-text-inverse'],
                    ]}
                />
            </Section>

            <Section title="Accent & line">
                <Grid
                    items={[
                        ['Accent', '--ep-color-accent'],
                        ['Accent hover', '--ep-color-accent-hover'],
                        ['Accent wash', '--ep-color-accent-wash'],
                        ['Link', '--ep-color-link'],
                        ['Border', '--ep-color-border'],
                        ['Border subtle', '--ep-color-border-subtle'],
                        ['Border bold', '--ep-color-border-bold'],
                        ['Focus', '--ep-color-focus'],
                    ]}
                />
            </Section>

            <Section title="Status">
                <Grid
                    items={[
                        ['Success', '--ep-color-success'],
                        ['Warning', '--ep-color-warning'],
                        ['Danger', '--ep-color-danger'],
                        ['Info', '--ep-color-info'],
                    ]}
                />
            </Section>

            <Section
                title="Data visualization"
                note="Ordered by legibility against this theme's canvas, not by hue family — a two-series chart should get the strongest available pair without anyone choosing colors by hand."
            >
                <Grid
                    items={[
                        ['Series 1', '--ep-chart-1'],
                        ['Series 2', '--ep-chart-2'],
                        ['Series 3', '--ep-chart-3'],
                        ['Series 4', '--ep-chart-4'],
                        ['Series 5', '--ep-chart-5'],
                        ['Series 6', '--ep-chart-6'],
                        ['Grid', '--ep-chart-grid'],
                        ['Label', '--ep-chart-label'],
                    ]}
                />
            </Section>
        </Shell>
    ),
}

export const Primitives: Story = {
    render: () => (
        <Shell
            title="Primitives"
            wide
            intro={
                <>
                    Tier 1. Nothing here carries meaning and nothing downstream may reference it
                    directly — use a semantic role instead. The product ramps are ported verbatim
                    from the EventPipe product design system, so where the blog and the admin
                    platform overlap they resolve to identical hexes.
                </>
            }
        >
            <Section title="Blog brand" note="The blog's own hues, taken from the editorial visualizations in references/.">
                <div className="flex flex-col gap-4">
                    <Ramp hue="brand" label="Brand — teal, anchored on #00ADB3" />
                    <Ramp hue="midnight" label="Midnight — canvas and ink, anchored on #10163E" />
                    <Ramp hue="harbor" label="Harbor — secondary editorial blue, anchored on #093E60" />
                </div>
            </Section>

            <Section title="Product" note="Ported from eventpipe-prototype-ds.">
                <div className="flex flex-col gap-4">
                    <Ramp hue="azure" label="Azure — product primary action" />
                    <Ramp hue="graphite" label="Graphite — product neutral" />
                    <Ramp hue="navy" label="Navy — product chrome" />
                </div>
            </Section>

            <Section title="Status hues">
                <div className="flex flex-col gap-4">
                    <Ramp hue="green" label="Green" />
                    <Ramp hue="amber" label="Amber" />
                    <Ramp hue="red" label="Red" />
                </div>
            </Section>
        </Shell>
    ),
}
