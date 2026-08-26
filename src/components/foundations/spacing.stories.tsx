import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, Shell } from '../story-shell'

const meta: Meta = { title: 'Foundations/Spacing', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

const SCALE: [string, number, string][] = [
    ['1', 4, 'Icon-to-label gaps, pill padding'],
    ['2', 8, 'Tag gaps, tight stacks'],
    ['3', 12, 'Table cell padding, list item gaps'],
    ['4', 16, 'Default gap inside a component'],
    ['5', 24, 'Padding inside a card or callout'],
    ['6', 32, 'Gap between embeds in an article body'],
    ['7', 48, 'Space around a section rule'],
    ['8', 64, 'Between article sections'],
    ['9', 96, 'Page-level bands'],
]

export const Scale: Story = {
    render: () => (
        <Shell
            title="Spacing"
            intro={
                <>
                    A 4px base. Steps 1–6 match the EventPipe product design system exactly, so the
                    blog and the admin platform stay dimensionally identical; 7–9 are added for
                    editorial section rhythm, which needs more air than a dense admin UI does.
                </>
            }
        >
            <Section title="Scale">
                <div className="flex flex-col gap-2.5">
                    {SCALE.map(([n, px, use]) => (
                        <div key={n} className="flex items-center gap-4">
                            <code className="w-28 shrink-0 text-[11px] text-subtlest">--ep-space-{n}</code>
                            <div className="h-4 shrink-0 rounded-sm bg-accent" style={{ width: `var(--ep-space-${n})` }} />
                            <span className="w-12 shrink-0 text-[11.5px] tabular-nums text-subtle">{px}px</span>
                            <span className="text-[12.5px] text-subtle">{use}</span>
                        </div>
                    ))}
                </div>
            </Section>

            <Section
                title="Vertical rhythm in an article"
                note="Embeds sit 32px clear of the copy above and below them (--ep-space-6). Anything tighter and the embed reads as part of the preceding paragraph rather than as its own beat."
            >
                <div className="rounded-lg border border-line bg-surface p-6">
                    <div className="ep-blog">
                        <p className="max-w-[62ch] text-[17px] leading-[1.7] text-ink">
                            Most reservations are short — nearly half run three or four nights.
                        </p>
                        <aside className="ep-callout" data-accent="teal">
                            <div className="ep-callout__body">
                                <p className="ep-callout__text">32px of clearance, top and bottom.</p>
                            </div>
                        </aside>
                        <p className="max-w-[62ch] text-[17px] leading-[1.7] text-ink">
                            The interesting part is at the tail, where a small number of long trips
                            carry a disproportionate share of the room nights.
                        </p>
                    </div>
                </div>
            </Section>
        </Shell>
    ),
}
