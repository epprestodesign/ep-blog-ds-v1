import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, Shell } from '../components/story-shell'
import embedsCss from './blog-embeds.css?raw'
import { CHARTS_RUNTIME_EMBED } from './charts-runtime'
import { CodeBlock } from './embed-playground'

const meta: Meta = { title: 'Embed Kit/Webflow Setup', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

const REPO = 'epprestodesign/ep-blog-ds-v1'
const CSS_PATH = 'src/webflow-embeds/blog-embeds.css'
const CDN_TAG = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/${REPO}@main/${CSS_PATH}">`

export const Setup: Story = {
    render: () => (
        <Shell
            title="Webflow setup"
            intro={
                <>
                    Three pastes, once per site. After this, publishing a new component is a merge
                    to <code>main</code> — nobody has to touch Webflow again.
                </>
            }
        >
            <Section
                title="1 · Stylesheet — Site Settings → Custom Code → Head"
                note="Link it from the repo rather than pasting the CSS itself. Webflow caps custom code at 50,000 characters and this file will pass that as the kit grows; more importantly, a linked stylesheet means a restyle ships on merge instead of requiring someone to re-paste 19KB of CSS into the Designer."
            >
                <CodeBlock
                    title="jsDelivr link tag"
                    note="The deploy workflow purges the jsDelivr cache on every merge to main, so changes land within seconds rather than at the end of a 12-hour TTL."
                    code={CDN_TAG}
                />
            </Section>

            <Section
                title="2 · Chart runtime — Site Settings → Custom Code → Footer"
                note="Only needed if the blog uses charts. Both tags, in this order. Every chart embed pasted afterwards is found and drawn automatically — no per-chart script."
            >
                <CodeBlock title="Chart.js + EventPipe runtime" code={CHARTS_RUNTIME_EMBED} />
            </Section>

            <Section
                title="3 · Rich Text class — in the Designer"
                note={
                    <>
                        Select the Rich Text element on the blog post template and give it the class{' '}
                        <code>ep-prose</code>, inside a parent with the class <code>ep-blog</code>.
                        Every element a writer can produce in the editor then renders on-brand with
                        no per-element styling. See <strong>Content Style Guide</strong> for what
                        that covers.
                    </>
                }
            >
                <CodeBlock
                    title="Structure"
                    code={`<div class="ep-blog">
  <div class="ep-prose w-richtext">
    <!-- Webflow CMS Rich Text field binds here -->
  </div>
</div>`}
                />
            </Section>

            <Section
                title="Full stylesheet"
                note="For reference, or to paste inline if you would rather not depend on a CDN. Note the size against Webflow's 50,000-character cap before choosing that route."
            >
                <CodeBlock
                    title={`blog-embeds.css · ${embedsCss.length.toLocaleString()} characters`}
                    code={embedsCss}
                />
            </Section>
        </Shell>
    ),
}
