import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import {
    IMAGERY_CATEGORIES,
    IMAGERY_REPO,
    type ImageCredit,
    type ImageryCategory,
    categoryOf,
    creditLine,
    imageUrl,
    loadCredits,
} from '../../lib/imagery'
import { Section, Shell } from '../story-shell'

const meta: Meta = { title: 'Foundations/Imagery', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

const RATIOS: [string, string, string][] = [
    ['16 / 9', 'Article hero, in-body figure', 'The default. Close enough to the chart panel proportions that a page mixing both stays calm.'],
    ['3 / 2', 'Card thumbnails in the directory', 'Slightly taller — gives a card body more to sit under.'],
    ['1 / 1', 'Author avatars, partner marks', 'Circular for people, square for logos.'],
]

function useCredits() {
    const [credits, setCredits] = useState<Record<string, ImageCredit> | null>(null)
    useEffect(() => {
        loadCredits().then(setCredits)
    }, [])
    return credits
}

function Plate({ imgKey, credit }: { imgKey: string; credit: ImageCredit }) {
    return (
        <figure className="ep-figure m-0">
            <img
                src={imageUrl(imgKey)}
                alt={credit.description}
                loading="lazy"
                style={{ aspectRatio: '16 / 9', objectFit: 'cover' }}
            />
            <figcaption>
                <span className="block truncate text-ink">{credit.description}</span>
                <a
                    href={credit.photoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline"
                >
                    {creditLine(credit)}
                </a>
            </figcaption>
        </figure>
    )
}

export const Library: Story = {
    render: function Render() {
        const credits = useCredits()

        const byCategory = (cat: string) =>
            credits
                ? Object.entries(credits)
                      .filter(([k]) => categoryOf(k) === cat)
                      .sort(([a], [b]) => a.localeCompare(b))
                : []

        return (
            <Shell
                title="Imagery"
                wide
                intro={
                    <>
                        All placeholder photography comes from the shared EventPipe image host,{' '}
                        <a href={IMAGERY_REPO} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                            presentation-imagery
                        </a>
                        — never from a bare <code>images.unsplash.com</code> URL. Attribution
                        travels with the files in <code>credits.json</code>, which is what the
                        Unsplash guidelines require and what a raw URL throws away. The images are
                        shared with the slide design system, so a placeholder here is a photograph
                        readers have already seen in a deck.
                    </>
                }
            >
                <Section
                    title="Library"
                    note={
                        credits === null
                            ? 'Loading credits from the host…'
                            : Object.keys(credits).length === 0
                              ? 'Could not reach the image host. Check your connection — the page renders without it, but no photographs will load.'
                              : `${Object.keys(credits).length} credited photographs across ${Object.keys(IMAGERY_CATEGORIES).length} categories, loaded at runtime so images added to the host appear here without rebuilding this repo.`
                    }
                >
                    <div className="flex flex-col gap-10">
                        {(Object.keys(IMAGERY_CATEGORIES) as ImageryCategory[]).map((cat) => {
                            const items = byCategory(cat).slice(0, 6)
                            if (!items.length) return null
                            return (
                                <div key={cat} className="flex flex-col gap-3">
                                    <div>
                                        <h3 className="text-[13px] font-semibold text-ink">{cat}</h3>
                                        <p className="mt-0.5 max-w-[72ch] text-[12.5px] text-subtle">
                                            {IMAGERY_CATEGORIES[cat]}{' '}
                                            <span className="text-subtlest">
                                                {byCategory(cat).length} images
                                                {byCategory(cat).length > 6 && ' · showing 6'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="ep-blog grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {items.map(([k, c]) => (
                                            <Plate key={k} imgKey={k} credit={c} />
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Section>

                <Section title="Using an image in a post">
                    <pre className="overflow-x-auto rounded-lg border border-line bg-surface-sunken px-4 py-3 font-mono text-[11.5px] leading-relaxed text-ink">
                        <code>{`import { imageUrl } from '@/lib/imagery'

imageUrl('hotels-housing/hotel-lobby-1')
// https://epprestodesign.github.io/presentation-imagery/imagery/unsplash/hotels-housing/hotel-lobby-1.jpg

buildFigureEmbed({
  src: imageUrl('live-events/stadium-crowd-1'),
  alt: 'A packed stadium during an evening event',
  caption: 'Peak arrival day accounts for a third of all check-ins.',
})`}</code>
                    </pre>
                </Section>

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
                                        <td className="max-w-[44ch] border-b border-line-subtle py-2.5 text-subtle">{why}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Section>

                <Section
                    title="Treatment"
                    note="12px radius, a hairline border, no drop shadow. The border matters on light images — without it a pale photo bleeds into the canvas and loses its edge."
                >
                    <div />
                </Section>

                <Section
                    title="Alt text is required"
                    note="buildFigureEmbed takes alt as a required argument, not an optional one — an editorial image with an empty alt is a defect, not a style choice. The host's credits.json carries a description for every photograph, which is a starting point but rarely the right alt text: describe what the image is doing in this article, not just what is in the frame."
                >
                    <div className="flex flex-col gap-2 text-[13px]">
                        <div className="flex gap-3">
                            <span className="w-14 shrink-0 font-semibold text-accent">Do</span>
                            <span className="text-subtle">“A packed stadium during an evening event”</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="w-14 shrink-0 font-semibold text-subtlest">Don't</span>
                            <span className="text-subtle">“Image of a stadium” · “stadium.jpg” · “”</span>
                        </div>
                    </div>
                </Section>

                <Section
                    title="Attribution"
                    note="Unsplash asks that the photographer be credited with a link back. Every caption above does it, and creditLine() in src/lib/imagery.ts produces the string. For a published article the credit belongs in the figure caption, not buried in a page footer."
                >
                    <div />
                </Section>
            </Shell>
        )
    },
}
