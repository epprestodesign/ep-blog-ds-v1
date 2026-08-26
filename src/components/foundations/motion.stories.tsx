import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, Shell } from '../story-shell'

const meta: Meta = { title: 'Foundations/Motion', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

const EASE: [string, string, string][] = [
    ['Standard', '--ep-ease-standard', 'Almost everything. Hover, focus, color changes.'],
    ['Emphasized', '--ep-ease-emphasized', 'Overshoots slightly. For something arriving that should be noticed.'],
    ['Decelerate', '--ep-ease-decelerate', 'Enters fast, settles. For elements coming in from off-screen.'],
    ['Accelerate', '--ep-ease-accelerate', 'Starts slow, leaves fast. For elements exiting.'],
]

const DURATION: [string, string, string][] = [
    ['Instant', '--ep-duration-instant', '80ms · color and opacity on hover'],
    ['Fast', '--ep-duration-fast', '150ms · small state changes'],
    ['Base', '--ep-duration-base', '240ms · the default; FAQ disclosure, panel reveals'],
    ['Slow', '--ep-duration-slow', '400ms · larger movements, chart draw-in'],
]

export const Scale: Story = {
    render: () => (
        <Shell
            title="Motion"
            intro={
                <>
                    Ported from the EventPipe product design system. The blog uses very little
                    motion — a reader scrolling through an article should not be animated at. In
                    practice this is the FAQ disclosure, link and hover transitions, and the chart
                    draw-in.
                </>
            }
        >
            <Section title="Easing" note="Hover a track to run its curve.">
                <div className="flex flex-col gap-3">
                    {EASE.map(([label, token]) => (
                        <div key={token} className="group flex items-center gap-4">
                            <code className="w-44 shrink-0 text-[11px] text-subtlest">{token}</code>
                            <div className="relative h-8 flex-1 rounded-sm bg-surface-sunken">
                                <div
                                    className="absolute top-1 left-1 h-6 w-6 rounded-sm bg-accent transition-transform group-hover:translate-x-[calc(100%*6)]"
                                    style={{
                                        transitionDuration: 'var(--ep-duration-slow)',
                                        transitionTimingFunction: `var(${token})`,
                                    }}
                                />
                            </div>
                            <span className="w-28 shrink-0 text-[11.5px] text-subtle">{label}</span>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Duration">
                <ul className="flex flex-col gap-2">
                    {DURATION.map(([label, token, use]) => (
                        <li key={token} className="flex gap-4 text-[13px]">
                            <code className="w-48 shrink-0 text-[11px] text-subtlest">{token}</code>
                            <span className="w-20 shrink-0 font-medium text-ink">{label}</span>
                            <span className="text-subtle">{use}</span>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section title="When to use each easing">
                <ul className="flex flex-col gap-2">
                    {EASE.map(([label, token, use]) => (
                        <li key={token} className="flex gap-4 text-[13px]">
                            <code className="w-44 shrink-0 text-[11px] text-subtlest">{token}</code>
                            <span className="w-28 shrink-0 font-medium text-ink">{label}</span>
                            <span className="max-w-[52ch] text-subtle">{use}</span>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section
                title="Reduced motion"
                note="The embed stylesheet collapses every transition and animation under prefers-reduced-motion, and the chart runtime disables animation outright rather than shortening it — a chart that still animates quickly is exactly what the setting is asking it not to do."
            >
                <pre className="overflow-x-auto rounded-lg border border-line bg-surface-sunken px-4 py-3 font-mono text-[11.5px] leading-relaxed text-ink">
                    <code>{`@media (prefers-reduced-motion: reduce) {
    .ep-blog *,
    .ep-blog *::before,
    .ep-blog *::after {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
    }
}`}</code>
                </pre>
            </Section>
        </Shell>
    ),
}
