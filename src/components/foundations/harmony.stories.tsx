import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { SOURCE_HEX, SOURCE_OKLCH, harmonyScales } from './harmony-scales.data'

/**
 * Foundations → Colors → Harmonies
 *
 * Laid out to match the Nimbus colour foundations: six-up grid, 64px swatches
 * with an inset ring, each section titled and described.
 *
 * Swatches render from the `--ep-palette-*` custom properties rather than the
 * hexes in the data module, so this page cannot drift from the tokens it
 * documents — if a token changes, the swatch changes with it.
 */
const meta: Meta = {
    title: 'Foundations/Colors',
    parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const Section = ({
    title,
    description,
    children,
}: {
    title: string
    description?: ReactNode
    children: ReactNode
}) => (
    <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-ink">{title}</h3>
            {description && <p className="max-w-[76ch] text-sm text-subtle">{description}</p>}
        </div>
        {children}
    </section>
)

const Grid = ({ children }: { children: ReactNode }) => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">{children}</div>
)

/** Swatch driven by a live CSS variable so it always matches the token. */
const VarSwatch = ({
    varName,
    label,
    detail,
}: {
    varName: string
    label: string
    detail?: string
}) => (
    <div className="flex flex-col gap-1.5">
        <div
            className="h-16 w-full rounded-lg ring-1 ring-black/10 ring-inset"
            style={{ background: `var(${varName})` }}
        />
        <div className="flex flex-col">
            <span className="text-xs font-semibold text-ink">{label}</span>
            <span className="text-xs lowercase text-subtlest">{detail ?? varName.replace('--ep-palette-', '')}</span>
        </div>
    </div>
)

const BRAND_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']

export const Harmonies: Story = {
    render: () => (
        <div className="flex min-h-screen flex-col gap-12 bg-canvas p-10">
            <div className="flex flex-col gap-1">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
                    Harmony colours
                </h2>
                <p className="max-w-[80ch] text-base text-subtle">
                    Seven scales derived from the brand teal <code>{SOURCE_HEX}</code> —{' '}
                    <code>{SOURCE_OKLCH}</code>. Each is the brand rotated in{' '}
                    <strong>OKLCH</strong>: hue alone changes, perceived lightness and chroma are
                    held constant. Rotating in HSL instead would give hues of wildly unequal
                    perceived lightness, which is exactly what makes a hand-built chart palette look
                    weighted when the data is not.
                </p>
            </div>

            <Section
                title="Source — Brand teal"
                description={
                    <>
                        Every scale below is this colour with its hue rotated. Note the ramp in the
                        token layer is anchored on <code>#00ADB3</code>, one digit off the{' '}
                        <code>#00AEB3</code> these harmonies were generated from — see the note at
                        the foot of this page.
                    </>
                }
            >
                <Grid>
                    {BRAND_STEPS.map((s) => (
                        <VarSwatch key={s} varName={`--ep-palette-brand-${s}`} label={`Brand ${s}`} />
                    ))}
                </Grid>
            </Section>

            {harmonyScales.map((scale) => (
                <Section
                    key={scale.name}
                    title={`${scale.name[0].toUpperCase()}${scale.name.slice(1)} — ${scale.kind}`}
                    description={
                        <>
                            {scale.description} <span className="text-subtlest">Hue {scale.hue.toFixed(0)}°.</span>
                        </>
                    }
                >
                    <Grid>
                        {scale.steps.map((step) => (
                            <VarSwatch
                                key={step.step}
                                varName={`--ep-palette-${scale.name}-${step.step}`}
                                label={step.step}
                                detail={step.hex.toLowerCase()}
                            />
                        ))}
                    </Grid>
                </Section>
            ))}

            <Section
                title="Contrast"
                description="Because every scale shares one lightness curve, contrast behaves identically across all seven — which is the practical payoff of rotating in OKLCH rather than HSL. Steps 800 and darker clear WCAG AA (4.5:1) for body text on white; steps 600 and lighter clear it on the Midnight canvas. The band between is for fills and borders, not text."
            >
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse text-[13px]">
                        <thead>
                            <tr>
                                <th className="border-b border-line pr-4 pb-2 text-left text-[10px] font-semibold tracking-[0.1em] text-subtle uppercase">
                                    Scale
                                </th>
                                {harmonyScales[0].steps.map((s) => (
                                    <th
                                        key={s.step}
                                        className="border-b border-line pb-2 text-center text-[10px] font-semibold tracking-[0.1em] text-subtle uppercase"
                                    >
                                        {s.step}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {harmonyScales.map((scale) => (
                                <tr key={scale.name}>
                                    <td className="border-b border-line-subtle py-2 pr-4 font-medium text-ink">
                                        {scale.name}
                                    </td>
                                    {scale.steps.map((s) => (
                                        <td
                                            key={s.step}
                                            className="border-b border-line-subtle py-2 text-center tabular-nums"
                                            title={`${s.hex} · ${s.onWhite}:1 on white · ${s.onMidnight}:1 on midnight`}
                                        >
                                            <span className={s.onWhite >= 4.5 ? 'font-semibold text-ink' : 'text-subtlest'}>
                                                {s.onWhite.toFixed(1)}
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="mt-2 text-xs text-subtlest">
                        Contrast against white. Bold values clear 4.5:1. Hover a cell for the
                        Midnight figure.
                    </p>
                </div>
            </Section>

            <Section
                title="A discrepancy worth resolving"
                description={
                    <>
                        These harmonies were generated from <code>#00AEB3</code>, as specified. The
                        brand ramp already in <code>src/tokens/palette.css</code> is anchored on{' '}
                        <code>#00ADB3</code> — the value used by the editorial visualizations in{' '}
                        <code>references/</code> — and that hex is also hardcoded in the shipped
                        Webflow stylesheet. The two are visually indistinguishable, but they are two
                        different numbers, and one of them should win. Nothing here has changed the
                        brand token: doing so would alter the live blog's accent colour.
                    </>
                }
            >
                <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col gap-1.5">
                        <div className="h-16 w-40 rounded-lg ring-1 ring-black/10 ring-inset" style={{ background: '#00AEB3' }} />
                        <span className="text-xs font-semibold text-ink">#00AEB3</span>
                        <span className="text-xs text-subtlest">harmonies generated from this</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="h-16 w-40 rounded-lg ring-1 ring-black/10 ring-inset" style={{ background: '#00ADB3' }} />
                        <span className="text-xs font-semibold text-ink">#00ADB3</span>
                        <span className="text-xs text-subtlest">--ep-palette-brand-600, and the live blog</span>
                    </div>
                </div>
            </Section>
        </div>
    ),
}
