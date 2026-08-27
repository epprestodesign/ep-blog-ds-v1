import type { Meta, StoryObj } from '@storybook/react-vite'
import logoBlack from '../../assets/logo/eventpipe-logo-000.svg'
import logoWhite from '../../assets/logo/eventpipe-logo-fff.svg'
import logoColor from '../../assets/logo/eventpipe-logo.svg'
import { Section, Shell } from '../story-shell'

const meta: Meta = { title: 'Foundations/Logos', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

function Chip({ label, bg, src, bordered }: { label: string; bg: string; src: string; bordered?: boolean }) {
    return (
        <div className="flex flex-col gap-3">
            <div
                className="flex h-32 items-center justify-center rounded-lg"
                style={{ background: bg, border: bordered ? '1px solid var(--ep-color-border)' : undefined }}
            >
                <img src={src} alt={`EventPipe logo — ${label}`} className="h-auto w-[180px]" />
            </div>
            <div className="text-[13px] text-subtle">{label}</div>
        </div>
    )
}

/**
 * The bar mark from the editorial visualizations in references/ — three teal
 * bars stepping down in height and opacity. It is pure CSS rather than an
 * image, so it costs nothing in an embed and inherits the accent color.
 */
function BarMark() {
    return (
        <span className="flex items-center">
            {[
                { h: 22, o: 1, ml: 0 },
                { h: 15, o: 0.72, ml: 3 },
                { h: 9, o: 0.45, ml: 3 },
            ].map((b, i) => (
                <i
                    key={i}
                    className="block w-[7px]"
                    style={{ height: b.h, opacity: b.o, marginLeft: b.ml, background: 'var(--ep-color-accent)' }}
                />
            ))}
        </span>
    )
}

export const Variants: Story = {
    render: () => (
        <Shell
            title="Logos"
            intro={
                <>
                    The EventPipe wordmark in three variants. Pick by the surface it sits on, so the
                    mark keeps sufficient contrast. Native artwork is 128×33 — scale
                    proportionally, keep clear space around it, and do not recolor outside these
                    variants.
                </>
            }
        >
            <Section title="Wordmark">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Chip label="Full color · on light surfaces" bg="var(--ep-color-surface)" src={logoColor} bordered />
                    <Chip label="White · on the dark canvas and photography" bg="#09141E" src={logoWhite} />
                    <Chip label="Black · one-color contexts, print, watermarks" bg="var(--ep-color-surface)" src={logoBlack} bordered />
                </div>
            </Section>

            <Section title="Sizes" note="96px is the practical floor for the wordmark — below that the descenders stop resolving. Use the bar mark instead.">
                <div className="flex flex-wrap items-end gap-8 rounded-lg border border-line bg-surface p-6">
                    {[96, 140, 200].map((w) => (
                        <div key={w} className="flex flex-col items-center gap-2">
                            <img src={logoColor} alt="EventPipe" style={{ width: w }} className="h-auto" />
                            <code className="text-[10.5px] text-subtlest">{w}px</code>
                        </div>
                    ))}
                </div>
            </Section>

            <Section
                title="Bar mark"
                note="The mark used by the editorial visualizations in references/ — three bars stepping down in height and opacity. It is built from CSS rather than an image, so it costs nothing inside an embed and picks up the accent color automatically."
            >
                <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap gap-5">
                        <div className="flex items-center gap-3 rounded-lg border border-line bg-surface px-5 py-4">
                            <BarMark />
                            <b className="text-[15px] font-semibold tracking-tight text-ink">EventPipe</b>
                            <span className="border-l border-line pl-3 text-[11px] text-subtle">Data</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg px-5 py-4" style={{ background: '#09141E' }}>
                            <span className="flex items-center">
                                {[
                                    { h: 22, o: 1, ml: 0 },
                                    { h: 15, o: 0.72, ml: 3 },
                                    { h: 9, o: 0.45, ml: 3 },
                                ].map((b, i) => (
                                    <i key={i} className="block w-[7px]" style={{ height: b.h, opacity: b.o, marginLeft: b.ml, background: '#18B6C1' }} />
                                ))}
                            </span>
                            <b className="text-[15px] font-semibold tracking-tight text-white">EventPipe</b>
                            <span className="border-l border-[#142E46] pl-3 text-[11px] text-[#A4B1BE]">Data</span>
                        </div>
                    </div>
                    <pre className="overflow-x-auto rounded-lg border border-line bg-surface-sunken px-4 py-3 font-mono text-[11.5px] leading-relaxed text-ink">
                        <code>{`<span class="ep-mark" aria-hidden="true"><i></i><i></i><i></i></span>

.ep-mark { display: flex; align-items: center; }
.ep-mark i { display: block; width: 7px; height: 22px; background: var(--ep-accent); }
.ep-mark i:nth-child(2) { height: 15px; opacity: .72; margin-left: 3px; }
.ep-mark i:nth-child(3) { height: 9px;  opacity: .45; margin-left: 3px; }`}</code>
                    </pre>
                </div>
            </Section>

            <Section
                title="Don't"
                note="Recolor the wordmark outside these three variants, place the full-color mark on a dark surface, stretch it non-proportionally, or set it below 96px wide. Assets live in src/assets/logo/."
            >
                <div />
            </Section>
        </Shell>
    ),
}
