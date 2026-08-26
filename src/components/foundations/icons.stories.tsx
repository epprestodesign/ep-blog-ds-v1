import type { Meta, StoryObj } from '@storybook/react-vite'
import { ICONS, type IconName, icon } from '../../webflow-embeds/icons'
import { Section, Shell } from '../story-shell'

const meta: Meta = { title: 'Foundations/Icons', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

const GROUPS: { title: string; note: string; names: IconName[] }[] = [
    {
        title: 'Editorial signals',
        note: 'Each callout accent carries its own glyph. Color alone is not a strong enough signal, and it is invisible to a reader who cannot distinguish teal from amber.',
        names: ['insight', 'info', 'caution', 'quote'],
    },
    {
        title: 'List and table marks',
        note: 'The check and cross in a comparison table are decorative — the builder emits visually-hidden "Yes"/"No" text beside them so the value is announced, not just seen.',
        names: ['checkCircle', 'check', 'cross', 'plus'],
    },
    {
        title: 'Direction and change',
        note: 'Trend arrows describe direction, not judgement. A falling number is not automatically bad — the label has to say which.',
        names: ['arrowRight', 'externalLink', 'trendingUp', 'trendingDown'],
    },
    {
        title: 'Events and housing',
        note: 'The domain set — what EventPipe writes about.',
        names: ['calendar', 'clock', 'mapPin', 'bed', 'users', 'building'],
    },
    { title: 'Data', note: '', names: ['chart', 'download'] },
]

function IconTile({ name }: { name: IconName }) {
    return (
        <div className="flex gap-3 rounded-md border border-line bg-surface p-3">
            <span
                className="mt-0.5 h-6 w-6 shrink-0 text-accent"
                dangerouslySetInnerHTML={{ __html: icon(name, 'w-6 h-6') }}
            />
            <div className="min-w-0">
                <code className="text-[12px] font-medium text-ink">{name}</code>
                <p className="mt-0.5 text-[11.5px] leading-snug text-subtle">{ICONS[name].use}</p>
            </div>
        </div>
    )
}

/**
 * Reads the same map the builders import, so this page documents what actually
 * ships. A list curated separately from the code would drift the first time a
 * builder inlined one more path.
 */
export const Set: Story = {
    name: 'Icon set',
    render: () => (
        <Shell
            title="Icons"
            intro={
                <>
                    Every icon that ships inside an embed, read from the same module the builders
                    import. All are 24×24 on a 2px stroke and inherit <code>currentColor</code>, so
                    one <code>color</code> in the stylesheet themes them.
                </>
            }
        >
            {GROUPS.map((g) => (
                <Section key={g.title} title={g.title} note={g.note || undefined}>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {g.names.map((n) => (
                            <IconTile key={n} name={n} />
                        ))}
                    </div>
                </Section>
            ))}

            <Section
                title="Inline SVG only"
                note="Icons ship as inline SVG — never as an icon font, and never as a <use href> pointing at a sprite. A Webflow embed cannot assume a font has loaded, and a sprite reference breaks the moment the embed is moved to another page. Inline is the only form that survives being pasted anywhere."
            >
                <pre className="overflow-x-auto rounded-lg border border-line bg-surface-sunken px-4 py-3 font-mono text-[11.5px] leading-relaxed text-ink">
                    <code>{`import { icon } from './icons'

icon('insight', 'ep-callout__icon')
// <svg class="ep-callout__icon" viewBox="0 0 24 24" fill="none"
//      stroke="currentColor" stroke-width="2" … aria-hidden="true">…</svg>`}</code>
                </pre>
            </Section>

            <Section
                title="Accessibility"
                note="Every icon is emitted with aria-hidden. An icon is never the only carrier of meaning: it either sits beside real text, or the builder emits a visually-hidden label next to it. Adding an icon to this set means deciding which of the two applies."
            >
                <div />
            </Section>
        </Shell>
    ),
}
