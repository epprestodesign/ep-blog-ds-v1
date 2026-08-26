import { Chart, registerables } from 'chart.js'
import { useEffect } from 'react'
import { CHARTS_RUNTIME } from './charts-runtime'

declare global {
    interface Window {
        Chart?: typeof Chart
        epBlogCharts?: { mount: (root?: Element | Document) => void; render: (el: Element) => void }
        __epRuntimeLoaded?: boolean
    }
}

/**
 * Runs the *shipped* chart runtime inside Storybook rather than a React
 * reimplementation of it. If a chart looks right in a story it looks right in
 * Webflow, because it is the same code drawing it — there is no second
 * rendering path that could drift.
 */
export function useChartsRuntime(container: React.RefObject<HTMLElement | null>, deps: unknown[] = []) {
    useEffect(() => {
        if (!window.__epRuntimeLoaded) {
            Chart.register(...registerables)
            window.Chart = Chart
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            new Function(CHARTS_RUNTIME)()
            window.__epRuntimeLoaded = true
        }

        const root = container.current
        if (!root) return

        // A re-render replaces the markup wholesale, so any chart instance the
        // runtime attached to the old nodes is orphaned. Clear the mount flags
        // and let it draw again against the current DOM.
        root.querySelectorAll<HTMLElement & { __epMounted?: boolean }>('.ep-chart').forEach((el) => {
            el.__epMounted = false
        })
        window.epBlogCharts?.mount(root)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}
