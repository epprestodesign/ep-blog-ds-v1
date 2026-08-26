/** Shared display pieces for the Foundations stories. */

/** Renders the live computed value, so every swatch reflects whichever
 *  brand/mode the toolbar is set to rather than a hex copied at author time. */
export function Swatch({ name, token }: { name: string; token: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="h-14 rounded-md border border-line" style={{ background: `var(${token})` }} />
            <div>
                <div className="text-[12.5px] font-medium text-ink">{name}</div>
                <code className="text-[10.5px] text-subtlest">{token}</code>
            </div>
        </div>
    )
}

export function SwatchGrid({ items }: { items: [string, string][] }) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map(([name, token]) => (
                <Swatch key={token} name={name} token={token} />
            ))}
        </div>
    )
}

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

export function Ramp({ hue, label }: { hue: string; label: string }) {
    return (
        <div>
            <div className="mb-1.5 text-[12.5px] font-medium text-ink">{label}</div>
            <div className="flex overflow-hidden rounded-md border border-line">
                {STEPS.map((s) => (
                    <div
                        key={s}
                        className="flex h-12 flex-1 items-end justify-center pb-1 text-[9px] font-medium"
                        style={{
                            background: `var(--ep-palette-${hue}-${s})`,
                            color: s >= 500 ? 'rgba(255,255,255,.85)' : 'rgba(16,22,62,.55)',
                        }}
                        title={`--ep-palette-${hue}-${s}`}
                    >
                        {s}
                    </div>
                ))}
            </div>
        </div>
    )
}

/** A labelled specimen tile — one value from a scale, shown at its real size. */
export function Specimen({
    token,
    label,
    detail,
    children,
}: {
    token: string
    label: string
    detail?: string
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col items-center gap-2">
            {children}
            <div className="text-center">
                <div className="text-[12px] font-medium text-ink">{label}</div>
                <code className="text-[10px] text-subtlest">{token}</code>
                {detail && <div className="text-[10.5px] text-subtle">{detail}</div>}
            </div>
        </div>
    )
}
