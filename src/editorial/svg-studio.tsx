import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { readEpTokens } from '../lib/ep-tokens'
import { toPasteableSvg, wrapEditorialSvg } from './pasteable-svg'

/**
 * Authoring surface for the editorial chart lane.
 *
 * TanStack renders into a live DOM here, but nothing about that runtime ships.
 * What ships is the serialized SVG — which is the point: the library is
 * pre-alpha, and a static SVG cannot regress. If it renders correctly once, it
 * is correct forever, with no dependency on the live blog.
 */

export interface StudioChart {
    id: string
    name: string
    /** What the chart is for, and what it costs the reader. */
    note: string
    /** Marks used, so the page documents its own conversion. */
    marks: string
    height: number
    /** Mounts the chart and returns the ChartHost, whose destroy() we call on
     *  teardown. Typed loosely because each mark specialises the host's
     *  generics differently — see the note in charts.ts. */
    mount: (el: HTMLElement, opts: { width: number; height: number; colors: string[] }) => { destroy: () => void } | void
}

type Status = 'pending' | 'ok' | 'failed'

export function ChartStudio({ chart, mode = 'light' }: { chart: StudioChart; mode?: 'light' | 'dark' }) {
    const hostRef = useRef<HTMLDivElement>(null)
    const [svg, setSvg] = useState('')
    const [status, setStatus] = useState<Status>('pending')
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const hostEl = hostRef.current
        if (!hostEl) return
        hostEl.innerHTML = ''
        let host: { destroy: () => void } | void

        try {
            const tokens = readEpTokens()
            host = chart.mount(hostEl, {
                width: 820,
                height: chart.height,
                colors: tokens.series,
            })
            // Serialization has to wait a frame — the mark runs its enter pass
            // before the SVG has its final geometry.
            const t = setTimeout(() => {
                const el = hostEl.querySelector('svg')
                if (!el) {
                    setStatus('failed')
                    setError('mounted without producing an <svg>')
                    return
                }
                setSvg(
                    toPasteableSvg(el as SVGSVGElement, {
                        ink: tokens.label,
                        fontFamily: tokens.fontSans,
                    }),
                )
                setStatus('ok')
            }, 350)
            return () => {
                clearTimeout(t)
                host?.destroy()
            }
        } catch (e) {
            setStatus('failed')
            setError(e instanceof Error ? e.message : String(e))
        }
        return () => {
            host?.destroy()
        }
    }, [chart, mode])

    const embed = svg
        ? wrapEditorialSvg({ svg, title: chart.name, description: chart.note, mode })
        : ''

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(embed)
        } catch {
            const ta = document.createElement('textarea')
            ta.value = embed
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            document.body.removeChild(ta)
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{chart.name}</h3>
                        <span
                            className={
                                status === 'ok'
                                    ? 'rounded-sm bg-accent-wash px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-accent uppercase'
                                    : status === 'failed'
                                      ? 'rounded-sm bg-danger-wash px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-danger uppercase'
                                      : 'rounded-sm bg-surface-sunken px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-subtlest uppercase'
                            }
                        >
                            {status === 'ok' ? 'converts' : status === 'failed' ? 'failed' : '…'}
                        </span>
                    </div>
                    <p className="mt-0.5 max-w-[70ch] text-sm text-subtle">{chart.note}</p>
                    <code className="mt-1 block text-[11px] text-subtlest">{chart.marks}</code>
                </div>
                {status === 'ok' && (
                    <button
                        type="button"
                        onClick={copy}
                        className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                        {copied ? 'Copied' : 'Copy static SVG'}
                    </button>
                )}
            </div>

            <div
                ref={hostRef}
                className="rounded-lg border border-line p-4"
                style={{
                    background: mode === 'dark' ? '#10163E' : 'var(--ep-color-surface)',
                    minHeight: chart.height + 32,
                }}
            />

            {status === 'failed' && (
                <p className="rounded-lg border border-line bg-danger-wash px-3 py-2 font-mono text-[11.5px] text-danger">
                    {error}
                </p>
            )}

            {status === 'ok' && (
                <details className="rounded-lg border border-line bg-surface-sunken">
                    <summary className="cursor-pointer list-none px-4 py-2.5 text-xs font-semibold tracking-wide text-subtle uppercase">
                        Static SVG · {(embed.length / 1024).toFixed(1)} KB · no runtime, no dependencies
                    </summary>
                    <pre className="max-h-[320px] overflow-auto border-t border-line px-4 py-3 font-mono text-[11px] leading-relaxed text-ink">
                        <code>{embed.slice(0, 4000)}{embed.length > 4000 ? '\n…' : ''}</code>
                    </pre>
                </details>
            )}
        </div>
    )
}
