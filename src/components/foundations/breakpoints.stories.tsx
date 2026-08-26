import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { Section, Shell } from '../story-shell'

const meta: Meta = { title: 'Foundations/Breakpoints', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

/** Named exactly as Webflow names them in the Designer, so a conversation about
 *  "tablet" means the same width in both places. */
const BREAKPOINTS: { name: string; range: string; token: string; note: string }[] = [
    { name: 'Mobile portrait', range: '≤ 479px', token: '--ep-bp-mobile-portrait', note: 'Metrics collapse to one column. Tables scroll.' },
    { name: 'Mobile landscape', range: '480 – 767px', token: '--ep-bp-mobile-landscape', note: 'Metrics run two-up.' },
    { name: 'Tablet', range: '768 – 991px', token: '--ep-bp-tablet', note: 'Metrics reach three and four columns.' },
    { name: 'Desktop (base)', range: '≥ 992px', token: '--ep-bp-desktop', note: "Webflow's base canvas. Everything is authored here first." },
    { name: 'Large', range: '≥ 1280px', token: '--ep-bp-large', note: 'Optional in Webflow. Not used by any embed.' },
    { name: 'X-Large', range: '≥ 1440px', token: '--ep-bp-xlarge', note: 'Optional in Webflow. Not used by any embed.' },
    { name: 'XX-Large', range: '≥ 1920px', token: '--ep-bp-xxlarge', note: 'Optional in Webflow. Not used by any embed.' },
]

function LiveReadout() {
    const [w, setW] = useState<number | null>(null)

    useEffect(() => {
        const update = () => setW(window.innerWidth)
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    if (w === null) return null

    const current =
        w <= 479 ? 'Mobile portrait' : w <= 767 ? 'Mobile landscape' : w <= 991 ? 'Tablet' : 'Desktop (base)'

    return (
        <div className="flex flex-wrap items-center gap-6 rounded-lg border border-line bg-surface px-5 py-4">
            <div>
                <div className="text-[10px] font-semibold tracking-[0.14em] text-subtle uppercase">Canvas width</div>
                <div className="mt-0.5 text-2xl font-semibold tabular-nums text-ink">{w}px</div>
            </div>
            <div>
                <div className="text-[10px] font-semibold tracking-[0.14em] text-subtle uppercase">Webflow breakpoint</div>
                <div className="mt-0.5 text-2xl font-semibold text-accent">{current}</div>
            </div>
            <p className="max-w-[34ch] text-[12.5px] leading-relaxed text-subtle">
                Resize the Storybook canvas — or use the viewport toolbar — to watch this change.
            </p>
        </div>
    )
}

export const Breakpoints: Story = {
    render: () => (
        <Shell
            title="Breakpoints"
            intro={
                <>
                    These are <strong>Webflow's</strong> breakpoints, not a set invented here. The
                    blog renders inside Webflow, so an embed that reflowed on its own beat would
                    read as broken at exactly the widths where the two disagreed — even though each
                    would be individually correct. Matching them is the whole point.
                </>
            }
        >
            <Section title="Live">
                <LiveReadout />
            </Section>

            <Section title="The scale">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-[13px]">
                        <thead>
                            <tr>
                                {['Webflow name', 'Range', 'Token', 'What changes'].map((h) => (
                                    <th
                                        key={h}
                                        className="border-b border-line pr-4 pb-2 text-left text-[10px] font-semibold tracking-[0.1em] text-subtle uppercase"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {BREAKPOINTS.map((b) => (
                                <tr key={b.token}>
                                    <td className="border-b border-line-subtle py-2.5 pr-4 font-medium text-ink">{b.name}</td>
                                    <td className="border-b border-line-subtle py-2.5 pr-4 tabular-nums text-subtle">{b.range}</td>
                                    <td className="border-b border-line-subtle py-2.5 pr-4">
                                        <code className="text-[11px] text-subtlest">{b.token}</code>
                                    </td>
                                    <td className="border-b border-line-subtle py-2.5 text-subtle">{b.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>

            <Section
                title="Tokens cannot drive media queries"
                note="CSS cannot read a custom property inside a media query — the values above exist so that one file states what the numbers are, and so JS can use them. Stylesheets still hardcode the pixel values. This is a CSS limitation, not a choice."
            >
                <pre className="overflow-x-auto rounded-lg border border-line bg-surface-sunken px-4 py-3 font-mono text-[11.5px] leading-relaxed text-ink">
                    <code>{`/* Works — hardcoded, matching Webflow */
@media (min-width: 768px) { … }

/* Does NOT work — media queries cannot resolve custom properties */
@media (min-width: var(--ep-bp-tablet)) { … }`}</code>
                </pre>
            </Section>

            <Section
                title="Author desktop-first"
                note="Webflow inherits styles downward from the base desktop canvas — a style set at Desktop applies to Tablet and below unless overridden. The embed stylesheet follows the same direction so the two behave alike: the base rule is the desktop rule, and the media queries below it are the exceptions."
            >
                <div />
            </Section>
        </Shell>
    ),
}
