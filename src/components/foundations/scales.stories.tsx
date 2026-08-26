import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, Shell } from '../story-shell'

const meta: Meta = { title: 'Foundations/Scales', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

const SPACE = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
const RADIUS: [string, string][] = [
    ['sm', '--ep-radius-sm'],
    ['md', '--ep-radius-md'],
    ['lg', '--ep-radius-lg'],
    ['xl', '--ep-radius-xl'],
    ['pill', '--ep-radius-pill'],
]
const SHADOW: [string, string][] = [
    ['Card', '--ep-shadow-card'],
    ['Level 1', '--ep-shadow-1'],
    ['Level 2', '--ep-shadow-2'],
    ['Level 3', '--ep-shadow-3'],
    ['Level 4', '--ep-shadow-4'],
]
const EASE: [string, string][] = [
    ['Standard', '--ep-ease-standard'],
    ['Emphasized', '--ep-ease-emphasized'],
    ['Decelerate', '--ep-ease-decelerate'],
    ['Accelerate', '--ep-ease-accelerate'],
]

export const Scales: Story = {
    render: () => (
        <Shell
            title="Scales"
            intro="Spacing, radius, elevation and motion hold their values across every brand and mode — switching theme recolors a page, it never reflows one. Spacing, radius and motion are ported from the EventPipe product design system so the two systems stay dimensionally identical."
        >
            <Section title="Spacing" note="A 4px base. Steps 1–6 match the product design system exactly; 7–9 are added for editorial section rhythm, which needs more air than an admin UI.">
                <div className="flex flex-col gap-2">
                    {SPACE.map((n) => (
                        <div key={n} className="flex items-center gap-4">
                            <code className="w-32 text-[11px] text-subtlest">--ep-space-{n}</code>
                            <div className="h-4 rounded-sm bg-accent" style={{ width: `var(--ep-space-${n})` }} />
                            <span className="text-[11.5px] text-subtle">
                                {[4, 8, 12, 16, 24, 32, 48, 64, 96][Number(n) - 1]}px
                            </span>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Radius" note="The product system is a uniform 4px. The blog keeps 4px for controls and chips so the two feel related, but allows 12–16px on cards and chart panels, which read better with more.">
                <div className="flex flex-wrap gap-4">
                    {RADIUS.map(([label, token]) => (
                        <div key={token} className="flex flex-col items-center gap-2">
                            <div
                                className="h-20 w-20 border border-line bg-surface"
                                style={{ borderRadius: `var(${token})` }}
                            />
                            <div className="text-center">
                                <div className="text-[12px] font-medium text-ink">{label}</div>
                                <code className="text-[10px] text-subtlest">{token}</code>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Elevation" note="Shadows are tinted with midnight rather than pure black, so they sit on the canvas instead of dirtying it.">
                <div className="flex flex-wrap gap-5">
                    {SHADOW.map(([label, token]) => (
                        <div key={token} className="flex flex-col items-center gap-2">
                            <div
                                className="flex h-20 w-32 items-center justify-center rounded-lg bg-surface text-[12px] text-subtle"
                                style={{ boxShadow: `var(${token})` }}
                            >
                                {label}
                            </div>
                            <code className="text-[10px] text-subtlest">{token}</code>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Motion" note="Hover to run each curve. Every embed honors prefers-reduced-motion, including the chart runtime, which disables animation entirely rather than shortening it.">
                <div className="flex flex-col gap-3">
                    {EASE.map(([label, token]) => (
                        <div key={token} className="group flex items-center gap-4">
                            <code className="w-40 text-[11px] text-subtlest">{token}</code>
                            <div className="relative h-8 flex-1 rounded-sm bg-surface-sunken">
                                <div
                                    className="absolute top-1 left-1 h-6 w-6 rounded-sm bg-accent transition-transform group-hover:translate-x-[calc(100%*6)]"
                                    style={{
                                        transitionDuration: 'var(--ep-duration-slow)',
                                        transitionTimingFunction: `var(${token})`,
                                    }}
                                />
                            </div>
                            <span className="w-24 text-[11.5px] text-subtle">{label}</span>
                        </div>
                    ))}
                </div>
            </Section>
        </Shell>
    ),
}
