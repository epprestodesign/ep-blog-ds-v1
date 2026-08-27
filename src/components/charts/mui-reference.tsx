import { createTheme, ThemeProvider } from '@mui/material/styles'
import { axisClasses, chartsGridClasses, legendClasses } from '@mui/x-charts'
import { useMemo, type ReactNode } from 'react'
import { useEpTokens, type EpTokens } from '../../lib/ep-tokens'

/**
 * MUI X Charts, themed with the EventPipe tokens.
 *
 * This is a REFERENCE surface, not a shipping one. MUI X is React + Emotion and
 * cannot run inside a Webflow embed; it lives in devDependencies and never
 * reaches src/webflow-embeds/. Its job is to be the target the shipping
 * Chart.js runtime is tuned against — and because both engines read the same
 * tokens, any remaining difference is a genuine styling gap rather than a
 * palette mismatch.
 */

export function useEpMuiTheme(t: EpTokens | null) {
    return useMemo(
        () =>
            createTheme({
                palette: {
                    text: { primary: t?.text ?? '#0C1B2A', secondary: t?.subtle ?? '#1B3D5D' },
                    background: { paper: t?.surface ?? '#FFFFFF' },
                    divider: t?.border ?? '#C6CED6',
                },
                typography: { fontFamily: t?.fontSans ?? 'Inter, sans-serif' },
            }),
        [t],
    )
}

/**
 * Axis text must be styled through `tickLabelStyle`, never through `sx`.
 * MUI X measures text only from these inline styles — setting a font size via
 * `sx` renders at the new size but measures at the old one, so labels overlap.
 * Documented, and very easy to get wrong.
 */
export function axisTextStyle(t: EpTokens | null) {
    return {
        fill: t?.label ?? '#1B3D5D',
        fontSize: 12,
        fontFamily: t?.fontSans ?? 'Inter, sans-serif',
    }
}

export function chartSx(t: EpTokens | null) {
    return {
        [`& .${chartsGridClasses.line}`]: { stroke: t?.grid ?? '#C6CED6', strokeWidth: 1 },
        [`& .${axisClasses.line}`]: { stroke: t?.grid ?? '#C6CED6' },
        [`& .${axisClasses.tick}`]: { stroke: 'transparent' },
        [`& .${legendClasses.root}`]: { fontFamily: t?.fontSans, fontSize: 12 },
    }
}

/** Wraps a MUI chart in the themed provider and hands down the live tokens. */
export function MuiChartFrame({ children }: { children: (t: EpTokens | null) => ReactNode }) {
    const tokens = useEpTokens()
    const theme = useEpMuiTheme(tokens)
    return <ThemeProvider theme={theme}>{children(tokens)}</ThemeProvider>
}
