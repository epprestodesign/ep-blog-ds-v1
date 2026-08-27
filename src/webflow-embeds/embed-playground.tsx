import { Check, Copy } from 'lucide-react'
import { useRef, useState } from 'react'
import { useEmbedHtml } from './use-charts-runtime'

interface EmbedPlaygroundProps {
    /** The HTML string a builder produced — previewed and copied verbatim. */
    html: string
    title: string
    /** Where this embed goes in Webflow. Shown above the preview. */
    instructions?: string
    /** Preview the embed against the dark editorial canvas. */
    mode?: 'light' | 'dark'
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text)
        } catch {
            // Clipboard access can be denied (insecure origin, permissions).
            // Falling back to a selection still lets the writer press ⌘C.
            const ta = document.createElement('textarea')
            ta.value = text
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            document.body.removeChild(ta)
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
    }

    return (
        <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-sm border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent"
        >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy for Webflow'}
        </button>
    )
}

/**
 * The unit of work for this design system: a live preview of an embed sitting
 * directly above the exact text to paste into Webflow. The preview is rendered
 * from the same string that gets copied, so the two cannot disagree.
 */
export function EmbedPlayground({ html, title, instructions, mode = 'light' }: EmbedPlaygroundProps) {
    const previewRef = useRef<HTMLDivElement>(null)
    useEmbedHtml(previewRef, html)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{title}</h3>
                    {instructions && <p className="mt-0.5 text-sm text-subtle">{instructions}</p>}
                </div>
                <CopyButton text={html} />
            </div>

            <div
                ref={previewRef}
                data-ep-mode={mode}
                className="rounded-lg border border-line p-6"
                style={{ background: mode === 'dark' ? '#09141E' : 'var(--ep-color-surface)' }}
            />

            <details className="group rounded-lg border border-line bg-surface-sunken">
                <summary className="cursor-pointer list-none px-4 py-2.5 text-xs font-semibold tracking-wide text-subtle uppercase">
                    Embed code · {html.length.toLocaleString()} characters
                </summary>
                <pre className="overflow-x-auto border-t border-line px-4 py-3 font-mono text-[11.5px] leading-relaxed text-ink">
                    <code>{html}</code>
                </pre>
            </details>
        </div>
    )
}

/** A read-only code panel, for the one-time stylesheet and runtime pastes. */
export function CodeBlock({ code, title, note }: { code: string; title: string; note?: string }) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{title}</h3>
                    {note && <p className="mt-0.5 max-w-[62ch] text-sm text-subtle">{note}</p>}
                </div>
                <CopyButton text={code} />
            </div>
            <pre className="max-h-[420px] overflow-auto rounded-lg border border-line bg-surface-sunken px-4 py-3 font-mono text-[11.5px] leading-relaxed text-ink">
                <code>{code}</code>
            </pre>
        </div>
    )
}
