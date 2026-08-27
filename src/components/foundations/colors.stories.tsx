import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, Shell } from '../story-shell'
import { JUSTIN_STEPS, justinDataViz, justinRamps } from './justin-palette.data'
import { SwatchGrid } from './parts'

/**
 * Foundations → Colors
 *
 * One page. The palette is hand-authored — ten hues at eleven steps — and it
 * is the whole colour identity: accent, neutrals, status and chart series all
 * come from it. There is no separate grey ramp because navy is near-achromatic
 * through its light steps (chroma 0.003 at 50), so surfaces and borders stay
 * inside the family rather than borrowing an unrelated grey.
 *
 * Swatches in the Roles section render from the live custom properties, so the
 * page cannot drift from the tokens it documents. The ramp and series swatches
 * render from the authored hexes, because those ARE the source.
 */
const meta: Meta = { title: 'Foundations/Colors', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

function Ramp({ name, steps }: { name: string; steps: Record<string, string> }) {
    return (
        <div>
            <div className="mb-1.5 text-[12.5px] font-medium text-ink">{name}</div>
            <div className="flex overflow-hidden rounded-md border border-line">
                {JUSTIN_STEPS.map((k) => (
                    <div
                        key={k}
                        className="flex h-12 flex-1 items-end justify-center pb-1 text-[9px] font-medium"
                        style={{
                            background: steps[k],
                            color: Number(k) >= 500 ? 'rgba(255,255,255,.85)' : 'rgba(12,27,42,.55)',
                        }}
                        title={`${name}-${k} · ${steps[k]}`}
                    >
                        {k}
                    </div>
                ))}
            </div>
        </div>
    )
}

const ROLE_OF: Record<string, string> = {
    teal: 'Accent, links, focus, first chart series',
    navy: 'Every neutral — canvas, surfaces, borders, all text',
    magenta: 'Chart series 3',
    gold: 'Warning · chart series 4',
    violet: 'Chart series 5',
    green: 'Success · chart series 6',
    coral: 'Danger · chart series 7',
    sky: 'Info · chart series 8',
    plum: 'Chart series 9',
    orange: 'Chart series 10',
}

export const Colors: Story = {
    render: () => (
        <Shell
            title="Colors"
            wide
            intro={
                <>
                    Ten hues at eleven steps, hand-authored. This is the entire colour identity —
                    accent, neutrals, status and every chart series come from it, and nothing is
                    invented outside it.
                    <br />
                    <br />
                    There is no separate grey ramp because none is needed: <strong>navy</strong> is
                    near-achromatic through its light steps (chroma 0.003 at 50, 0.014 at 200), so
                    surfaces, borders and text all come from it and stay in the family.
                </>
            }
        >
            <Section
                title="Series order"
                note="What a chart consumes, in order. These are the vivid values, deliberately distinct from each ramp's 500 step — a chart fill wants more chroma than a UI surface does. Figures are contrast against white, then against the dark canvas."
            >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {justinDataViz.map((d) => (
                        <div key={d.hex} className="flex flex-col gap-1.5">
                            <div
                                className="flex h-16 w-full items-start justify-end rounded-lg p-1.5 ring-1 ring-black/10 ring-inset"
                                style={{ background: d.hex }}
                            >
                                <span className="text-[10px] font-semibold text-white/80">{d.position}</span>
                            </div>
                            <div>
                                <div className="text-[12px] font-medium text-ink">{d.name}</div>
                                <code className="text-[10.5px] text-subtlest">{d.hex.toLowerCase()}</code>
                                <div className="mt-0.5 text-[10px] text-subtle">
                                    <span className={d.onWhite >= 4.5 ? 'font-semibold text-ink' : ''}>
                                        {d.onWhite.toFixed(1)}
                                    </span>
                                    {' / '}
                                    <span className={d.onMidnight >= 4.5 ? 'font-semibold text-ink' : ''}>
                                        {d.onMidnight.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-3 max-w-[76ch] text-[12.5px] text-subtle">
                    None of these clears 4.5:1 on white, which is correct — they are{' '}
                    <strong>fills</strong>, and a fill needs no text contrast. It does mean none of
                    them should carry coloured type; the 700–900 steps below exist for that.
                    Series&nbsp;2 is the darkest and disappears against the dark canvas, so it lifts
                    to a light navy there.
                </p>
            </Section>

            <Section title="Ramps" note="Eleven steps per hue. 500 anchors each ramp; 700–900 are the text-safe steps.">
                <div className="flex flex-col gap-4">
                    {justinRamps.map((r) => (
                        <div key={r.name}>
                            <Ramp name={r.name} steps={r.steps} />
                            <div className="mt-1 text-[11px] text-subtlest">{ROLE_OF[r.name]}</div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section
                title="Roles — surface"
                note="Canvas is the page, surface is anything sitting on it. All from navy's light steps. These swatches read the live custom properties, so switch Brand and Mode in the toolbar to check every theme."
            >
                <SwatchGrid
                    items={[
                        ['Canvas', '--ep-color-canvas'],
                        ['Surface', '--ep-color-surface'],
                        ['Sunken', '--ep-color-surface-sunken'],
                        ['Inset', '--ep-color-surface-inset'],
                        ['Hover', '--ep-color-surface-hover'],
                    ]}
                />
            </Section>

            <Section title="Roles — text" note="navy-900 for body, navy-500 for captions and labels, navy-400 for eyebrow-scale metadata only.">
                <SwatchGrid
                    items={[
                        ['Text', '--ep-color-text'],
                        ['Subtle', '--ep-color-text-subtle'],
                        ['Subtlest', '--ep-color-text-subtlest'],
                        ['Inverse', '--ep-color-text-inverse'],
                        ['Accent', '--ep-color-text-accent'],
                    ]}
                />
            </Section>

            <Section
                title="Roles — accent"
                note="Two roles, deliberately. Accent is the vivid series teal and is for fills, rules and focus rings. Link is teal-800, because the accent is 2.5:1 on white and cannot carry text. Getting this wrong is the most common way a brand colour ends up failing contrast."
            >
                <SwatchGrid
                    items={[
                        ['Accent · fills', '--ep-color-accent'],
                        ['Accent hover', '--ep-color-accent-hover'],
                        ['Accent contrast', '--ep-color-accent-contrast'],
                        ['Accent wash', '--ep-color-accent-wash'],
                        ['Link · text', '--ep-color-link'],
                        ['Link hover', '--ep-color-link-hover'],
                    ]}
                />
            </Section>

            <Section title="Roles — line">
                <SwatchGrid
                    items={[
                        ['Border', '--ep-color-border'],
                        ['Border subtle', '--ep-color-border-subtle'],
                        ['Border bold', '--ep-color-border-bold'],
                        ['Border accent', '--ep-color-border-accent'],
                        ['Focus', '--ep-color-focus'],
                    ]}
                />
            </Section>

            <Section
                title="Roles — status"
                note="Green, gold, coral and sky at step 700–800 on light, lifting to 300 on dark. Colour is never the only signal — the callout component pairs each status with its own glyph."
            >
                <SwatchGrid
                    items={[
                        ['Success', '--ep-color-success'],
                        ['Warning', '--ep-color-warning'],
                        ['Danger', '--ep-color-danger'],
                        ['Info', '--ep-color-info'],
                        ['Success wash', '--ep-color-success-wash'],
                        ['Warning wash', '--ep-color-warning-wash'],
                        ['Danger wash', '--ep-color-danger-wash'],
                        ['Info wash', '--ep-color-info-wash'],
                    ]}
                />
            </Section>

            <Section title="Roles — data visualization" note="The series order plus the chart chrome. Read live, so these follow the toolbar too.">
                <SwatchGrid
                    items={[
                        ['Series 1', '--ep-chart-1'],
                        ['Series 2', '--ep-chart-2'],
                        ['Series 3', '--ep-chart-3'],
                        ['Series 4', '--ep-chart-4'],
                        ['Series 5', '--ep-chart-5'],
                        ['Series 6', '--ep-chart-6'],
                        ['Series 7', '--ep-chart-7'],
                        ['Series 8', '--ep-chart-8'],
                        ['Series 9', '--ep-chart-9'],
                        ['Series 10', '--ep-chart-10'],
                        ['Grid', '--ep-chart-grid'],
                        ['Label', '--ep-chart-label'],
                    ]}
                />
            </Section>
        </Shell>
    ),
}
