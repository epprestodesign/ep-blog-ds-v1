import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, Shell } from '../story-shell'

const meta: Meta = { title: 'Foundations/Elevation', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

const SHADOW: [string, string, string][] = [
    ['Card', '--ep-shadow-card', 'A soft even glow rather than a drop shadow. The default for editorial cards.'],
    ['Level 1', '--ep-shadow-1', 'Barely lifted — a hovered row, a sticky header.'],
    ['Level 2', '--ep-shadow-2', 'Dropdowns, popovers, a lifted card.'],
    ['Level 3', '--ep-shadow-3', 'Side panels and sheets.'],
    ['Level 4', '--ep-shadow-4', 'Modals. Rare on a blog.'],
]

export const Scale: Story = {
    render: () => (
        <Shell
            title="Elevation"
            intro={
                <>
                    Shadows are tinted with Midnight rather than pure black, so they sit on the
                    canvas instead of dirtying it. The blog leans on hairline rules far more than on
                    elevation — most editorial components are flat and bordered. Reach for a shadow
                    only when something genuinely floats above the page.
                </>
            }
        >
            <Section title="Scale">
                <div className="flex flex-wrap gap-6">
                    {SHADOW.map(([label, token]) => (
                        <div key={token} className="flex flex-col items-center gap-2">
                            <div
                                className="flex h-24 w-40 items-center justify-center rounded-lg bg-surface text-[12.5px] text-subtle"
                                style={{ boxShadow: `var(${token})` }}
                            >
                                {label}
                            </div>
                            <code className="text-[10px] text-subtlest">{token}</code>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="When to use each">
                <ul className="flex flex-col gap-2">
                    {SHADOW.map(([label, token, use]) => (
                        <li key={token} className="flex gap-4 text-[13px]">
                            <code className="w-40 shrink-0 text-[11px] text-subtlest">{token}</code>
                            <span className="w-20 shrink-0 font-medium text-ink">{label}</span>
                            <span className="max-w-[52ch] text-subtle">{use}</span>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section
                title="Flat by default"
                note="Every Embed Kit component is flat and bordered rather than elevated. An article body is already a busy vertical stack; shadows on each embed would turn it into a pile of floating cards."
            >
                <div className="ep-blog rounded-lg border border-line bg-surface p-6">
                    <aside className="ep-callout" data-accent="teal" style={{ marginTop: 0, marginBottom: 0 }}>
                        <div className="ep-callout__body">
                            <p className="ep-callout__title">No shadow</p>
                            <p className="ep-callout__text">
                                Separation comes from the tinted wash and the surrounding whitespace.
                            </p>
                        </div>
                    </aside>
                </div>
            </Section>
        </Shell>
    ),
}
