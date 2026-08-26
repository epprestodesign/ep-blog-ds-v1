import { Chart, registerables } from 'chart.js'
import { useEffect, type RefObject } from 'react'
import { CHARTS_RUNTIME } from './charts-runtime'

declare global {
    interface Window {
        Chart?: typeof Chart
        epBlogCharts?: { mount: (root?: Element | Document) => void; render: (el: Element) => void }
        __epRuntimeLoaded?: boolean
    }
}

type ChartHost = HTMLElement & { __epMounted?: boolean; __epChart?: { destroy: () => void } }

function ensureRuntime() {
    if (window.__epRuntimeLoaded) return
    Chart.register(...registerables)
    window.Chart = Chart
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    new Function(CHARTS_RUNTIME)()
    window.__epRuntimeLoaded = true
}

/**
 * Renders an embed's HTML and hands the subtree to the shipped chart runtime.
 *
 * The container's contents are set imperatively rather than through
 * `dangerouslySetInnerHTML`, and the element React renders stays empty. That
 * boundary is the whole point: the runtime mutates this DOM — sizing canvases,
 * attaching Chart.js instances — and React knows nothing about any of it. When
 * React owned the subtree, an unrelated re-render elsewhere on the page (a
 * theme token resolving, a parent context updating) replaced the markup and
 * silently discarded every rendered chart, leaving blank 300×150 canvases
 * behind. Nothing here reads as broken until you look at the page.
 *
 * Using the shipped runtime rather than a React chart component is deliberate:
 * a story that renders through a different code path than production can pass
 * while production is broken.
 */
export function useEmbedHtml(container: RefObject<HTMLElement | null>, html: string) {
    useEffect(() => {
        ensureRuntime()

        const root = container.current
        if (!root) return

        root.innerHTML = html
        window.epBlogCharts?.mount(root)

        return () => {
            // Chart.js keeps its instances in a global registry keyed by canvas.
            // Dropping the markup without destroying them leaks a chart per
            // render, and each one keeps its resize and pointer listeners alive.
            root.querySelectorAll<ChartHost>('.ep-chart').forEach((el) => {
                el.__epChart?.destroy()
                el.__epMounted = false
            })
            root.innerHTML = ''
        }
    }, [container, html])
}
