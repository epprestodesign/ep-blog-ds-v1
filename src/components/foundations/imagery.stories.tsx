import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, Shell } from '../story-shell'

const meta: Meta = { title: 'Foundations/Imagery', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

const SAMPLES = [
    { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80', alt: 'Attendees seated in rows at a conference session', ratio: '16 / 9' },
    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80', alt: 'Hotel exterior at dusk', ratio: '16 / 9' },
    { url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&q=80', alt: 'Attendees talking in a convention centre lobby', ratio: '16 / 9' },
]

const RATIOS: [string, string, string][] = [
    ['16 / 9', 'Article hero, in-body figure', 'The default. Matches the chart panel proportions closely enough that a page mixing both stays calm.'],
    ['3 / 2', 'Card thumbnails in the directory', 'Slightly taller — gives a card body more to sit under.'],
    ['1 / 1', 'Author avatars, partner marks', 'Always circular for people, square for logos.'],
]

export const Guidance: Story = {
    render: () => (
        <Shell
            title="Imagery"
            intro={
                <>
                    The blog is data-led, so photography plays a supporting role — it sets a scene,
                    it does not carry the argument. When a picture would carry the argument, it
                    should be a chart or a bespoke visualization instead.
                </>
            }
        >
            <Section title="Aspect ratios">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse text-[13px]">
                        <thead>
                            <tr>
                                {['Ratio', 'Where', 'Why'].map((h) => (
                                    <th key={h} className="border-b border-line pr-4 pb-2 text-left text-[10px] font-semibold tracking-[0.1em] text-subtle uppercase">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {RATIOS.map(([r, where, why]) => (
                                <tr key={r}>
                                    <td className="border-b border-line-subtle py-2.5 pr-4 font-medium tabular-nums text-ink">{r}</td>
                                    <td className="border-b border-line-subtle py-2.5 pr-4 text-subtle">{where}</td>
                                    <td className="border-b border-line-subtle py-2.5 max-w-[44ch] text-subtle">{why}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>

            <Section title="Treatment" note="12px radius, a hairline border, no drop shadow. The border matters on light images — without it a pale photo bleeds into the canvas and loses its edge.">
                <div className="ep-blog grid gap-5 sm:grid-cols-3">
                    {SAMPLES.map((s) => (
                        <figure key={s.url} className="ep-figure" style={{ margin: 0 }}>
                            <img src={s.url} alt={s.alt} style={{ aspectRatio: s.ratio, objectFit: 'cover' }} />
                            <figcaption>Caption sets context the photo cannot.</figcaption>
                        </figure>
                    ))}
                </div>
            </Section>

            <Section
                title="Alt text is required"
                note="buildFigureEmbed takes alt as a required argument rather than an optional one — an editorial image with an empty alt is a defect, not a style choice. Describe what is in the frame and why it is there; do not start with 'Image of'."
            >
                <div className="flex flex-col gap-2 text-[13px]">
                    <div className="flex gap-3">
                        <span className="w-14 shrink-0 font-semibold text-accent">Do</span>
                        <span className="text-subtle">“Attendees seated in rows at a conference session”</span>
                    </div>
                    <div className="flex gap-3">
                        <span className="w-14 shrink-0 font-semibold text-subtlest">Don't</span>
                        <span className="text-subtle">“Image of a conference” · “conference.jpg” · “”</span>
                    </div>
                </div>
            </Section>

            <Section
                title="Captions carry the load"
                note="A caption should add something the photograph cannot: a figure, a date, a source. Repeating what the reader can already see is wasted space directly under the image."
            >
                <div />
            </Section>

            <Section
                title="Where images are hosted"
                note="Article images live in the Webflow Assets panel and bind through the CMS, so writers manage them without a deploy. Only images that are part of a component — a logo, an illustration in a template — belong in this repo. The product design system's separately-hosted imagery library (presto-ds-imagery) is for prototyping the admin platform and is deliberately not wired up here."
            >
                <div />
            </Section>
        </Shell>
    ),
}
