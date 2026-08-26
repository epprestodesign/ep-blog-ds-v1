import type { Meta, StoryObj } from '@storybook/react-vite'
import { Shell } from '../components/story-shell'
import {
    buildCalloutEmbed,
    buildChecklistEmbed,
    buildFaqEmbed,
    buildFigureEmbed,
    buildMetricsEmbed,
    buildPullQuoteEmbed,
    buildStepsEmbed,
    buildTableEmbed,
    buildTagsEmbed,
    lines,
} from './builders'
import { EmbedPlayground } from './embed-playground'

/**
 * Every story here is a live playground: edit the Controls, watch the preview,
 * copy the result into a Webflow Rich Text "Custom Code" block. The preview is
 * rendered from the same string the button copies.
 */
const meta: Meta = {
    title: 'Embed Kit/Components',
    parameters: { layout: 'fullscreen' },
    argTypes: {
        mode: {
            control: 'inline-radio',
            options: ['light', 'dark'],
            description: 'Preview and ship this embed against the light or dark canvas.',
        },
    },
    args: { mode: 'light' },
}
export default meta

const PASTE = 'Paste into a Rich Text → Custom Code block.'

type Args = Record<string, never>
type Story = StoryObj<Args>

/* ------------------------------------------------------------------ */

export const MetricsRow: Story = {
    name: 'Metrics row',
    args: {
        values: '41,000\n340\n19 nights\n+18%',
        labels: 'Room nights booked\nEvents in the dataset\nLongest single trip\nYear over year',
        highlightIndex: 2,
        mode: 'light',
    },
    argTypes: {
        values: { control: 'text', description: 'One value per line.' },
        labels: { control: 'text', description: 'One label per line, matched to the values above.' },
        highlightIndex: {
            control: { type: 'number', min: -1, max: 3 },
            description: 'Which metric gets the accent color. -1 for none — use at most one.',
        },
    },
    render: (args: any) => {
        const v = lines(args.values)
        const l = lines(args.labels)
        const metrics = v.map((value, i) => ({
            value,
            label: l[i] ?? '',
            highlight: i === Number(args.highlightIndex),
        }))
        return (
            <Shell title="Metrics row" intro="The lead statistic strip — hairline rules top and bottom, tabular numerals so the figures align. Two to four metrics; beyond that it stops reading as a summary.">
                <EmbedPlayground title="Metrics row" instructions={PASTE} mode={args.mode} html={buildMetricsEmbed(metrics, args.mode)} />
            </Shell>
        )
    },
}

export const PullQuote: Story = {
    name: 'Pull quote',
    args: {
        quote: 'We stopped guessing at room block sizes the first season we had the trip-length data in front of us.',
        attribution: 'Dana Whitfield',
        role: 'Director of Housing, Crane Expo',
        variant: 'bar',
        mode: 'light',
    },
    argTypes: {
        quote: { control: 'text' },
        attribution: { control: 'text' },
        role: { control: 'text' },
        variant: { control: 'inline-radio', options: ['bar', 'centered'] },
    },
    render: (args: any) => (
        <Shell title="Pull quote" intro="Set in Fraunces at 24px. Straight quotes and hyphens are converted to true typographic marks on the way out, so a writer pasting from email still gets correct punctuation.">
            <EmbedPlayground
                title="Pull quote"
                instructions={PASTE}
                mode={args.mode}
                html={buildPullQuoteEmbed(
                    { quote: args.quote, attribution: args.attribution, role: args.role, variant: args.variant },
                    args.mode,
                )}
            />
        </Shell>
    ),
}

export const Callout: Story = {
    args: {
        title: 'What this means for your room block',
        text: 'Trips longer than seven nights are 4% of reservations but 11% of room nights.\nIf your block is sized on headcount alone, that gap is where the shortfall comes from.',
        accent: 'teal',
        mode: 'light',
    },
    argTypes: {
        title: { control: 'text' },
        text: { control: 'text', description: 'One paragraph per line.' },
        accent: { control: 'inline-radio', options: ['teal', 'harbor', 'amber'] },
    },
    render: (args: any) => (
        <Shell title="Callout" intro="For an aside the reader can skip without losing the thread. Teal for an insight, harbor for context or a definition, amber for a caveat. If it cannot be skipped, it belongs in the body copy instead.">
            <EmbedPlayground
                title="Callout"
                instructions={PASTE}
                mode={args.mode}
                html={buildCalloutEmbed({ title: args.title, text: args.text, accent: args.accent }, args.mode)}
            />
        </Shell>
    ),
}

export const Table: Story = {
    name: 'Editorial table',
    args: { mode: 'light' },
    render: (args: any) => (
        <Shell
            title="Editorial table"
            intro="Scrolls inside its own container, so a wide table never forces the article body to scroll sideways on a phone. The first cell of each row is a row header, which is what lets a screen reader announce the row a number belongs to."
        >
            <EmbedPlayground
                title="Editorial table"
                instructions={PASTE}
                mode={args.mode}
                html={buildTableEmbed(
                    {
                        caption: 'Room nights by trip length, 2025–2026 season',
                        columns: [
                            { header: 'Trip length', type: 'bold' },
                            { header: 'Reservations', type: 'num' },
                            { header: 'Room nights', type: 'num' },
                            { header: 'Share', type: 'pill-teal' },
                            { header: 'Block impact', type: 'check' },
                        ],
                        rows: [
                            ['1–2 nights', '18,400', '29,100', '31%', 'no'],
                            ['3–4 nights', '12,900', '44,600', '47%', 'yes'],
                            ['5–7 nights', '3,100', '18,200', '11%', 'yes'],
                            ['8+ nights', '740', '10,400', '11%', 'yes'],
                        ],
                    },
                    args.mode,
                )}
            />
        </Shell>
    ),
}

export const Checklist: Story = {
    args: {
        heading: 'Before you set the block',
        items: 'Pull last season’s trip-length distribution, not just headcount\nCheck shoulder-night demand three days either side of the event\nConfirm the cutoff date against historical booking curves\nLeave room for crew reservations, which book late and stay long',
        mode: 'light',
    },
    argTypes: {
        heading: { control: 'text' },
        items: { control: 'text', description: 'One item per line.' },
    },
    render: (args: any) => (
        <Shell title="Checklist" intro="A short list of actions the reader can take away. Keep items to one line each — a checklist that wraps is a numbered-steps list wearing the wrong component.">
            <EmbedPlayground
                title="Checklist"
                instructions={PASTE}
                mode={args.mode}
                html={buildChecklistEmbed({ heading: args.heading, items: lines(args.items) }, args.mode)}
            />
        </Shell>
    ),
}

export const Steps: Story = {
    name: 'Numbered steps',
    args: { mode: 'light' },
    render: (args: any) => (
        <Shell title="Numbered steps" intro="For a sequence where order matters. Use the checklist instead when it does not.">
            <EmbedPlayground
                title="Numbered steps"
                instructions={PASTE}
                mode={args.mode}
                html={buildStepsEmbed(
                    [
                        { title: 'Export the reservation data', text: 'Reports → Reservations → full season, including cancellations.' },
                        { title: 'Bucket by trip length', text: 'Group into 1–2, 3–4, 5–7 and 8+ nights rather than by exact night count.' },
                        { title: 'Weight by room nights, not reservations', text: 'This is the step that changes the answer — long trips are rare and heavy.' },
                        { title: 'Compare against the block you actually held', text: 'The gap between the two is your sizing error for next season.' },
                    ],
                    args.mode,
                )}
            />
        </Shell>
    ),
}

export const Faq: Story = {
    name: 'FAQ',
    args: { mode: 'light' },
    render: (args: any) => (
        <Shell
            title="FAQ"
            intro="Built on native <details>, so it needs no JavaScript in Webflow, works from the keyboard, and its answers are still found by in-page search when collapsed."
        >
            <EmbedPlayground
                title="FAQ"
                instructions={PASTE}
                mode={args.mode}
                html={buildFaqEmbed(
                    [
                        { question: 'Does this include cancelled reservations?', answer: 'No. Cancellations are excluded from every figure in this article, including the room-night totals.' },
                        { question: 'What counts as a "trip"?', answer: 'One reservation, from check-in to check-out, regardless of how many rooms it holds.' },
                        { question: 'Can I get this cut for my own events?', answer: 'Yes — the same breakdown is available per event in Reports.' },
                    ],
                    args.mode,
                )}
            />
        </Shell>
    ),
}

export const Tags: Story = {
    args: { mode: 'light' },
    render: (args: any) => (
        <Shell title="Tags" intro="Topic tags for the end of an article or a card footer. Pass an href to make them links into a Webflow collection page.">
            <EmbedPlayground
                title="Tags"
                instructions={PASTE}
                mode={args.mode}
                html={buildTagsEmbed(
                    [
                        { label: 'Room blocks', accent: 'teal' },
                        { label: 'Data', accent: 'harbor' },
                        { label: 'Housing' },
                        { label: '2026 season' },
                    ],
                    args.mode,
                )}
            />
        </Shell>
    ),
}

export const Figure: Story = {
    args: {
        src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
        alt: 'A conference hall filled with attendees seated in rows',
        caption: 'Peak arrival day accounts for a third of all check-ins across the season.',
        mode: 'light',
    },
    argTypes: { src: { control: 'text' }, alt: { control: 'text' }, caption: { control: 'text' } },
    render: (args: any) => (
        <Shell title="Figure" intro="An image with a caption. Alt text is a required argument rather than an optional one — an empty alt on an editorial image is a defect, not a style choice.">
            <EmbedPlayground
                title="Figure"
                instructions={PASTE}
                mode={args.mode}
                html={buildFigureEmbed({ src: args.src, alt: args.alt, caption: args.caption }, args.mode)}
            />
        </Shell>
    ),
}
