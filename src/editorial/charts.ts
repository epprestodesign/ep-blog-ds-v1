import { scaleLinear as scaleLinearD3 } from 'd3-scale'
import { defineChart, dot, link, mountChart, rect, text } from '@tanstack/charts'
import { boxY } from '@tanstack/charts/box'
import { treemap } from '@tanstack/charts/hierarchy/treemap'
import { sunburst } from '@tanstack/charts/hierarchy/sunburst'
import { polar } from '@tanstack/charts/polar'
import { sankeyDiagram } from '@tanstack/charts/network/sankey'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { scalePoint } from '@tanstack/charts/scales/point'
import { violinY } from '@tanstack/charts/violin'
import { ridgelineY } from '@tanstack/charts/ridgeline'
import { waffleY } from '@tanstack/charts/waffle'
import { hexbin } from '@tanstack/charts/spatial/hexbin'
import { linearRegressionY } from '@tanstack/charts/regression'
import { cell } from '@tanstack/charts/rect'
import type { StudioChart } from './svg-studio'
import {
    CHANNEL_FLOW,
    CHANNEL_SHARE,
    HEAT_CELLS,
    LEAD_VS_LENGTH,
    ROOM_NIGHTS_TREE,
    TRIP_DENSITY,
    TRIP_LENGTHS,
} from './data'

/**
 * Every chart TanStack can produce that our Chart.js runtime cannot.
 *
 * Each entry mounts a live chart so the studio can serialize it. Nothing here
 * ships — the output does. The `marks` string on each records which primitives
 * the conversion needed, which is the useful artefact when deciding whether a
 * type is worth packaging later.
 */

/**
 * `defineChart` returns a definition whose generics are specialised by the
 * marks it was given, and `mountChart` wants those same generics on its
 * container type. Threading them through a shared helper defeats inference and
 * TypeScript rejects every call, so the definition is widened here at the one
 * boundary rather than each chart being typed individually. The definitions
 * themselves stay fully checked — only this hand-off is loosened.
 *
 * The library ships an API-FRICTION.md acknowledging this class of problem; it
 * is pre-alpha, and this is the kind of edge that implies.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mount = (el: HTMLElement, definition: any, width: number, height: number, ariaLabel: string) =>
    mountChart(el, { definition, width, height, ariaLabel })

export const editorialCharts: StudioChart[] = [
    {
        id: 'sankey',
        name: 'Sankey',
        note: 'Flow between stages, with band width carrying the quantity. The one chart that shows where volume is lost rather than only what remains.',
        marks: "sankeyDiagram + link + rect + text — @tanstack/charts/network/sankey",
        height: 420,
        mount: (el, { width, height, colors }) =>
            mount(
                el,
                defineChart({
                    marks: [
                        sankeyDiagram({
                            nodes: CHANNEL_FLOW.nodes,
                            links: CHANNEL_FLOW.links,
                            nodeKey: 'id',
                            source: 'source',
                            target: 'target',
                            value: 'value',
                            align: 'left',
                            nodeWidth: ({ width: w }) => Math.max(12, w * 0.02),
                            nodePadding: ({ height: h }) => Math.max(14, h * 0.05),
                            inset: 90,
                            marks: ({ nodes, links }) => [
                                link(links, {
                                    x1: 'x1', y1: 'y1', x2: 'x2', y2: 'y2', key: 'key',
                                    strokeWidth: (f: any) => Math.max(1, f.width),
                                    stroke: colors[0],
                                    strokeOpacity: 0.28,
                                    lineCap: 'butt',
                                }),
                                rect(nodes, {
                                    x1: 'x0', x2: 'x1', y1: 'y0', y2: 'y1', key: 'key',
                                    fill: colors[1], inset: 0,
                                }),
                                text(nodes, {
                                    x: 'x1', y: 'y', key: 'key',
                                    text: (n: any) => n.data.label,
                                    textAnchor: 'start',
                                    dx: 8,
                                }),
                            ],
                        }),
                    ],
                }),
                width, height, 'Booking flow by channel',
            ),
    },
    {
        id: 'treemap',
        name: 'Treemap',
        note: 'Nested proportion. Reads area, which people judge less precisely than length — so it suits showing that one branch dwarfs another, not exact comparison.',
        marks: 'treemap — @tanstack/charts/hierarchy/treemap',
        height: 420,
        mount: (el, { width, height, colors }) =>
            mount(
                el,
                defineChart({
                    marks: [
                        treemap(ROOM_NIGHTS_TREE, {
                            path: 'name',
                            delimiter: '.',
                            value: 'size',
                            label: (n: any) => n.id?.split('.').pop() ?? '',
                            color: (n: any) => n.ancestorIds?.at(-1) ?? n.id,
                            inset: 2,
                            stroke: '#fff',
                        }),
                    ],
                    // x and y are required even for a layout with no axes.
                    scales: { x: null, y: null },
                    color: { range: colors },
                }),
                width, height, 'Room nights by region and market',
            ),
    },
    {
        id: 'sunburst',
        name: 'Sunburst',
        note: 'The same hierarchy read radially. Better than a treemap at showing depth, worse at comparing siblings.',
        marks: 'sunburst — @tanstack/charts/hierarchy/sunburst',
        height: 440,
        mount: (el, { width, height, colors }) =>
            mount(
                el,
                defineChart({
                    // A sunburst is a PolarMark, so it cannot sit directly in a
                    // cartesian chart — it needs a polar container supplying
                    // angle and radius scales.
                    marks: [
                        polar({
                            startAngle: Math.PI / 2,
                            endAngle: Math.PI / 2 - Math.PI * 2,
                            marks: [
                                sunburst(ROOM_NIGHTS_TREE, {
                                    path: 'name',
                                    delimiter: '.',
                                    value: 'size',
                                    innerRadius: ({ radius }: any) => radius * 0.24,
                                    ringPadding: 2,
                                    color: 'branchId',
                                    stroke: '#fff',
                                }),
                            ],
                            scales: { angle: null, radius: null },
                        }),
                    ],
                    scales: { x: null, y: null },
                    color: { range: colors },
                }),
                width, height, 'Room nights, nested by region',
            ),
    },
    {
        id: 'boxplot',
        name: 'Box plot',
        note: 'Median, quartiles and outliers per category. Shows the spread a bar chart of averages hides — the single most under-used chart in editorial data work.',
        marks: 'boxY — @tanstack/charts/box',
        height: 380,
        mount: (el, { width, height, colors }) =>
            mount(
                el,
                defineChart({
                    marks: [
                        boxY(TRIP_LENGTHS, {
                            x: 'group',
                            y: 'value',
                            fill: colors[0],
                            stroke: colors[1],
                        }),
                    ],
                    scales: {
                        x: { scale: () => scaleBand().padding(0.35) },
                        y: { scale: scaleLinear, nice: true, grid: true, axis: { label: 'Nights' } },
                    },
                }),
                width, height, 'Trip length distribution by event type',
            ),
    },
    {
        id: 'violin',
        name: 'Violin',
        note: 'The full density rather than five summary numbers. Use when the shape matters — a bimodal distribution is invisible in a box plot.',
        marks: 'violinY — @tanstack/charts/violin',
        height: 380,
        mount: (el, { width, height, colors }) =>
            mount(
                el,
                defineChart({
                    marks: [violinY(TRIP_DENSITY, { x: 'group', y: 'value', width: 'density', fill: colors[0] })],
                    scales: {
                        x: { scale: () => scaleBand().padding(0.3) },
                        y: { scale: scaleLinear, nice: true, grid: true, axis: { label: 'Nights' } },
                    },
                }),
                width, height, 'Trip length density by event type',
            ),
    },
    {
        id: 'ridgeline',
        name: 'Ridgeline',
        note: 'Stacked densities with deliberate overlap. Good for many distributions at once where the trend across them is the story.',
        marks: 'ridgelineY — @tanstack/charts/ridgeline',
        height: 400,
        mount: (el, { width, height, colors }) =>
            mount(
                el,
                defineChart({
                    marks: [ridgelineY(TRIP_DENSITY, { x: 'value', y: 'group', height: 'density', overlap: 1.6, fill: colors[0] })],
                    scales: {
                        x: { scale: scaleLinear, nice: true, axis: { label: 'Nights' } },
                        y: { scale: () => scalePoint().padding(0.6) },
                    },
                }),
                width, height, 'Trip length by event type',
            ),
    },
    {
        id: 'heatmap',
        name: 'Heatmap',
        note: 'A matrix of two categorical dimensions. Needs a sequential colour scale, not the categorical series order — the value is the hue, not the category.',
        marks: 'cell — @tanstack/charts/rect',
        height: 340,
        mount: (el, { width, height, colors }) =>
            mount(
                el,
                defineChart({
                    marks: [
                        cell(HEAT_CELLS, {
                            x: 'month',
                            y: 'market',
                            color: 'nights',
                            inset: 1.5,
                        }),
                    ],
                    scales: {
                        x: { scale: () => scaleBand().padding(0.06) },
                        y: { scale: () => scaleBand().padding(0.06) },
                    },
                    color: { scale: scaleLinearD3 as never, range: ['#EAF5F6', colors[0]] },
                }),
                width, height, 'Room nights by market and month',
            ),
    },
    {
        id: 'hexbin',
        name: 'Hexbin',
        note: 'A scatter plot with too many points to read, binned into hexagons so density becomes visible instead of a solid blob. Geometry converts; binding the bin count to the colour ramp is still unresolved, so every hexagon currently paints at the low end.',
        marks: 'hexbin — @tanstack/charts/spatial/hexbin',
        height: 400,
        mount: (el, { width, height, colors }) =>
            mount(
                el,
                defineChart({
                    marks: [hexbin(LEAD_VS_LENGTH, { x: 'lead', y: 'nights', binWidth: 22 })],
                    scales: {
                        x: { scale: scaleLinear, nice: true, axis: { label: 'Days before arrival' } },
                        y: { scale: scaleLinear, nice: true, grid: true, axis: { label: 'Nights' } },
                    },
                    color: { scale: scaleLinearD3 as never, range: ['#EAF5F6', colors[0]] },
                }),
                width, height, 'Lead time against trip length',
            ),
    },
    {
        id: 'regression',
        name: 'Scatter with regression',
        note: 'A trend line fitted in the chart rather than precomputed. The band is the confidence interval, which is what stops a reader over-reading a weak relationship.',
        marks: 'dot + linearRegressionY — @tanstack/charts/regression',
        height: 400,
        mount: (el, { width, height, colors }) =>
            mount(
                el,
                defineChart({
                    marks: [
                        dot(LEAD_VS_LENGTH, { x: 'lead', y: 'nights', fill: colors[0], fillOpacity: 0.45, r: 3 }),
                        linearRegressionY(LEAD_VS_LENGTH, { x: 'lead', y: 'nights', stroke: colors[2] }),
                    ],
                    scales: {
                        x: { scale: scaleLinear, nice: true, axis: { label: 'Days before arrival' } },
                        y: { scale: scaleLinear, nice: true, grid: true, axis: { label: 'Nights' } },
                    },
                }),
                width, height, 'Lead time against trip length, with fitted trend',
            ),
    },
    {
        id: 'waffle',
        name: 'Waffle',
        note: 'Proportion as counted squares. Slower to read than a bar, but it makes "one in five" literal, which suits a general audience.',
        marks: 'waffleY — @tanstack/charts/waffle',
        height: 360,
        mount: (el, { width, height, colors }) =>
            mount(
                el,
                defineChart({
                    marks: [waffleY(CHANNEL_SHARE, { y: 'share', color: 'channel', unit: 1, gap: 2 })],
                    scales: {
                        x: null,
                        y: { scale: scaleLinear, nice: true },
                    },
                    color: { range: colors },
                }),
                width, height, 'Share of reservations by channel',
            ),
    },
]
