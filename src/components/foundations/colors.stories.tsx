import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, Shell } from '../story-shell'
import { SwatchGrid } from './parts'

const meta: Meta = { title: 'Foundations/Colors', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

/**
 * Tier 2 — the only tier anything downstream may use. Components, embeds and
 * charts consume these roles; reaching past them into a raw ramp is how a
 * design system stops being themeable.
 */
export const Roles: Story = {
    render: () => (
        <Shell
            title="Colors"
            intro={
                <>
                    Semantic roles — the only color tier components, embeds and charts may use.
                    Reaching past these into a raw ramp (see <strong>Palette</strong>) is what stops
                    a system being themeable. The Webflow embed stylesheet carries a resolved copy
                    of everything below, scoped to <code>.ep-blog</code>. Switch Brand and Mode in
                    the toolbar — every swatch reads its live computed value.
                </>
            }
        >
            <Section title="Surface" note="Canvas is the page. Surface is anything sitting on it — cards, callouts, chart panels. Sunken is for wells: code blocks, table pills, inset panels.">
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

            <Section title="Text" note="Body copy uses Text. Subtle carries captions, labels and metric descriptions; Subtlest is reserved for eyebrow-scale metadata, where it still clears 4.5:1 against the canvas.">
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

            <Section title="Accent" note="The teal that carries eyebrows, rules, active states and the first chart series. Wash is the tinted background for callouts and pills — never for text.">
                <SwatchGrid
                    items={[
                        ['Accent', '--ep-color-accent'],
                        ['Accent hover', '--ep-color-accent-hover'],
                        ['Accent contrast', '--ep-color-accent-contrast'],
                        ['Accent wash', '--ep-color-accent-wash'],
                        ['Link', '--ep-color-link'],
                        ['Link hover', '--ep-color-link-hover'],
                    ]}
                />
            </Section>

            <Section title="Line" note="Border is the default hairline. Subtle is for rules inside a component, where a full-strength line would over-divide; Bold is for a rule that has to hold against a busy surface.">
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

            <Section title="Status" note="Each pairs with a wash for tinted backgrounds. Color is never the only signal — the callout component pairs each status with its own glyph.">
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

            <Section
                title="Data visualization"
                note="Ordered by legibility against this theme's canvas rather than by hue family, so a two-series chart gets the strongest available pair without anyone picking colors by hand. The chart runtime reads these from the computed style of each chart element — it holds no palette of its own."
            >
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
                        ['Grid', '--ep-chart-grid'],
                        ['Axis', '--ep-chart-axis'],
                        ['Label', '--ep-chart-label'],
                        ['Tooltip', '--ep-chart-tooltip-bg'],
                    ]}
                />
            </Section>
        </Shell>
    ),
}
