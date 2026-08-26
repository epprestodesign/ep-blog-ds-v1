/**
 * Placeholder imagery.
 *
 * Every photograph in this design system comes from the shared EventPipe image
 * host rather than from unsplash.com directly:
 *
 *   https://github.com/epprestodesign/presentation-imagery
 *
 * Two reasons that matters. Attribution travels with the files in
 * `credits.json`, which is what the Unsplash API guidelines require and what a
 * bare `images.unsplash.com/photo-…` URL throws away. And the images are shared
 * with the slide design system, so a placeholder here is the same photograph a
 * reader has already seen in a deck — which is the point of a placeholder
 * library rather than a pile of ad-hoc URLs.
 *
 * Credits load at runtime, so photographs added to the host appear here without
 * rebuilding this repo.
 */

export const IMAGERY_BASE = 'https://epprestodesign.github.io/presentation-imagery'

export const IMAGERY_REPO = 'https://github.com/epprestodesign/presentation-imagery'

/** Categories in the host's `imagery/unsplash/` tree, with what each is for. */
export const IMAGERY_CATEGORIES = {
    'hotels-housing': 'Lobbies, reception, guest rooms. The default for room-block and housing posts.',
    'live-events': 'Stadium and arena crowds, stages, show floors.',
    'youth-sports': 'Tournaments and youth competition — the largest category on the host.',
    travel: 'Airports, transit, arrivals. For posts about how attendees get there.',
    people: 'Teams, meetings, working sessions.',
    portraits: 'Single-subject headshots. Author bylines and quote attributions.',
    'hotel-operations': 'Front desk, housekeeping, back of house.',
    platform: 'Screens, terminals, product in use.',
    documentation: 'Onboarding and training sessions.',
    abstract: 'Textures and architectural detail, including teal gradients that sit well under the brand.',
} as const

export type ImageryCategory = keyof typeof IMAGERY_CATEGORIES

export interface ImageCredit {
    id: string
    description: string
    photographer: string
    photographerUrl: string
    photoUrl: string
    query: string
}

/** Credits are keyed `unsplash/<category>/<slug>`; files live one level deeper
 *  under `imagery/`. Keeping the two in one function means a caller never has
 *  to know that the key and the path differ. */
export function imageUrl(key: string): string {
    const k = key.startsWith('unsplash/') ? key : `unsplash/${key}`
    return `${IMAGERY_BASE}/imagery/${k}.jpg`
}

export function categoryOf(key: string): string {
    return key.replace(/^unsplash\//, '').split('/')[0]
}

/** Attribution string in the form the Unsplash guidelines ask for. */
export function creditLine(credit: ImageCredit): string {
    return `Photo by ${credit.photographer} on Unsplash`
}

let cache: Promise<Record<string, ImageCredit>> | null = null

/** Fetched once per session. GitHub Pages serves this with
 *  `access-control-allow-origin: *`, so it loads from localhost and from the
 *  deployed Storybook alike. */
export function loadCredits(): Promise<Record<string, ImageCredit>> {
    cache ??= fetch(`${IMAGERY_BASE}/credits.json`)
        .then((r) => {
            if (!r.ok) throw new Error(`credits.json → HTTP ${r.status}`)
            return r.json() as Promise<Record<string, ImageCredit>>
        })
        .catch((err) => {
            // Offline, or the host is down. Callers render their own empty
            // state rather than the page failing outright.
            console.warn('[imagery] could not load credits:', err)
            return {}
        })
    return cache
}

/**
 * A stable pick from a category — same index always returns the same image.
 * Deliberately not random: a story that shuffles its photographs on every
 * render makes visual review impossible.
 */
export function pick(credits: Record<string, ImageCredit>, category: ImageryCategory, index = 0): string | null {
    const keys = Object.keys(credits).filter((k) => categoryOf(k) === category).sort()
    return keys.length ? keys[index % keys.length] : null
}
