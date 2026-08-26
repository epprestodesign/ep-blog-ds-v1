import type { ReactNode } from 'react'

/**
 * Standard padding and measure for documentation stories. Stories render
 * `layout: 'fullscreen'` so that page-level examples get the real viewport;
 * everything else wraps in this.
 */
export function Shell({
    title,
    intro,
    children,
    wide,
}: {
    title: string
    intro?: ReactNode
    children: ReactNode
    wide?: boolean
}) {
    return (
        <div className="min-h-screen bg-canvas px-8 py-10">
            <div className={wide ? 'mx-auto max-w-[1180px]' : 'mx-auto max-w-[860px]'}>
                <header className="mb-8">
                    <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{title}</h1>
                    {intro && <div className="mt-2 max-w-[68ch] text-[15px] leading-relaxed text-subtle">{intro}</div>}
                </header>
                {children}
            </div>
        </div>
    )
}

export function Section({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
    return (
        <section className="mt-10 border-t border-line pt-7 first:mt-0 first:border-0 first:pt-0">
            <h2 className="text-[11px] font-semibold tracking-[0.14em] text-subtle uppercase">{title}</h2>
            {note && <p className="mt-1.5 max-w-[68ch] text-sm leading-relaxed text-subtle">{note}</p>}
            <div className="mt-5">{children}</div>
        </section>
    )
}
