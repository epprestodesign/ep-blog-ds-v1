import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, Shell } from '../story-shell'

const meta: Meta = { title: 'Foundations/Typography', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

function Row({
    token,
    label,
    sample,
    display,
    weight = 600,
    tracking = 'var(--ep-tracking-heading)',
    leading = 'var(--ep-leading-heading)',
}: {
    token: string
    label: string
    sample: string
    display?: boolean
    weight?: number
    tracking?: string
    leading?: string
}) {
    return (
        <div className="grid gap-3 border-b border-line py-5 last:border-0 md:grid-cols-[160px_1fr]">
            <div>
                <div className="text-[12.5px] font-medium text-ink">{label}</div>
                <code className="text-[10.5px] text-subtlest">{token}</code>
            </div>
            <div
                style={{
                    fontSize: `var(${token})`,
                    fontFamily: display ? 'var(--ep-font-display)' : 'var(--ep-font-sans)',
                    fontWeight: weight,
                    letterSpacing: tracking,
                    lineHeight: leading,
                    color: 'var(--ep-color-text)',
                }}
            >
                {sample}
            </div>
        </div>
    )
}

export const Scale: Story = {
    render: () => (
        <Shell
            title="Typography"
            intro={
                <>
                    Two faces. <strong>Fraunces</strong> carries display and headings;{' '}
                    <strong>Inter</strong> carries body, UI and every number. Switching Brand to
                    Product swaps both to Product Sans, so a post embedding real admin UI reads in
                    the platform's own voice. Display and H1 are fluid; everything below is fixed,
                    so body copy holds a predictable measure.
                </>
            }
        >
            <Section title="Display & headings" note="Fraunces, semibold, tight tracking.">
                <Row token="--ep-text-display" label="Display" display sample="Where the room nights are" leading="var(--ep-leading-tight)" tracking="var(--ep-tracking-tight)" />
                <Row token="--ep-text-h1" label="Heading 1" display sample="The 100 longest trips" leading="var(--ep-leading-tight)" tracking="var(--ep-tracking-tight)" />
                <Row token="--ep-text-h2" label="Heading 2" display sample="What the data actually shows" />
                <Row token="--ep-text-h3" label="Heading 3" display sample="Room blocks by region" />
                <Row token="--ep-text-h4" label="Heading 4" display sample="Methodology" />
                <Row token="--ep-text-h5" label="Heading 5" sample="A note on rounding" weight={600} />
            </Section>

            <Section title="Body" note="17px at 1.7 line height, capped at 62–68ch. Long-form reading wants a larger size than a dense admin UI does — this is the one scale not ported from the product design system.">
                <Row token="--ep-text-lead" label="Lead" sample="Attendees booked 41,000 room nights across 340 events last season." weight={400} leading="var(--ep-leading-body)" tracking="var(--ep-tracking-normal)" />
                <Row token="--ep-text-body" label="Body" sample="The longest single trip in the dataset ran 19 nights — a crew booking that opened three weeks before the event and closed four days after it." weight={400} leading="var(--ep-leading-body)" tracking="var(--ep-tracking-normal)" />
                <Row token="--ep-text-sm" label="Small" sample="Figures are rounded to the nearest hundred room nights." weight={400} leading="var(--ep-leading-ui)" tracking="var(--ep-tracking-normal)" />
                <Row token="--ep-text-xs" label="Extra small" sample="Source: EventPipe reservation data, 2025–2026 season." weight={400} leading="var(--ep-leading-ui)" tracking="var(--ep-tracking-normal)" />
            </Section>

            <Section title="Eyebrow" note="Always uppercase at 0.18em tracking, always in the accent color. It is the one place the blog shouts, so it is deliberately tiny.">
                <div className="ep-blog py-3">
                    <span className="ep-eyebrow">Data / Room nights</span>
                </div>
            </Section>

            <Section title="Measure">
                <div className="rounded-lg border border-line bg-surface p-5">
                    <p className="text-[17px] leading-[1.7] text-ink" style={{ maxWidth: 'var(--ep-measure)' }}>
                        Sixty-two characters is the cap the reference visualizations use for their
                        standfirst copy, and it is the value in <code className="text-[13px]">--ep-measure</code>.
                        Prose in an article body runs slightly wider at 68ch, because a full article
                        wants fewer line breaks than a chart caption does.
                    </p>
                </div>
            </Section>
        </Shell>
    ),
}
