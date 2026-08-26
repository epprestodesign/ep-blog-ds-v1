import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, Shell } from '../story-shell'
import { Specimen } from './parts'

const meta: Meta = { title: 'Foundations/Border Radius', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

const RADIUS: [string, string, string][] = [
    ['sm', '--ep-radius-sm', '4px · pills, code, small chips'],
    ['md', '--ep-radius-md', '6px · inputs, buttons'],
    ['lg', '--ep-radius-lg', '12px · cards, callouts, charts'],
    ['xl', '--ep-radius-xl', '16px · hero and feature panels'],
    ['pill', '--ep-radius-pill', '999px · tags, avatars, counters'],
    ['control', '--ep-radius-control', '4px · matches product controls'],
]

export const Scale: Story = {
    render: () => (
        <Shell
            title="Border radius"
            intro={
                <>
                    The EventPipe product design system is a uniform 4px — every card, input and
                    button resolves to the same corner. The blog keeps 4px for controls and chips so
                    the two systems read as related, but allows 12–16px on cards, callouts and chart
                    panels, which carry editorial content and look better with more.
                </>
            }
        >
            <Section title="Scale">
                <div className="flex flex-wrap gap-5">
                    {RADIUS.map(([label, token, detail]) => (
                        <Specimen key={token} token={token} label={label} detail={detail.split(' · ')[0]}>
                            <div
                                className="h-20 w-20 border border-line bg-surface"
                                style={{ borderRadius: `var(${token})` }}
                            />
                        </Specimen>
                    ))}
                </div>
            </Section>

            <Section title="Where each one goes">
                <ul className="flex flex-col gap-2">
                    {RADIUS.map(([label, token, detail]) => (
                        <li key={token} className="flex gap-4 text-[13px]">
                            <code className="w-40 shrink-0 text-[11px] text-subtlest">{token}</code>
                            <span className="w-16 shrink-0 font-medium text-ink">{label}</span>
                            <span className="text-subtle">{detail.split(' · ')[1]}</span>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section title="On real components" note="Left to right: pill, control, card.">
                <div className="ep-blog flex flex-wrap items-center gap-5">
                    <ul className="ep-tags" style={{ margin: 0 }}>
                        <li><span className="ep-tag" data-accent="teal">Room blocks</span></li>
                    </ul>
                    <div className="rounded-[var(--ep-radius-control)] border border-line bg-surface px-4 py-2 text-[13px] text-ink">
                        Control
                    </div>
                    <div className="rounded-[var(--ep-radius-lg)] border border-line bg-surface px-6 py-5 text-[13px] text-ink">
                        Card
                    </div>
                </div>
            </Section>
        </Shell>
    ),
}
