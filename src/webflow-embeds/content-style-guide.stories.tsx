import type { Meta, StoryObj } from '@storybook/react-vite'
import { Shell } from '../components/story-shell'

const meta: Meta = { title: 'Embed Kit/Content Style Guide', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

/**
 * Everything a writer can produce with Webflow's native Rich Text toolbar,
 * rendered through `.ep-prose`. If an element appears here it is styled; if a
 * writer can make it and it is NOT here, that is a gap in blog-embeds.css.
 */
export const StyleGuide: Story = {
    render: () => (
        <Shell
            title="Content style guide"
            intro={
                <>
                    Apply <code>.ep-prose</code> to the Webflow Rich Text element and every native
                    element below renders on-brand — no per-element styling in the Designer, and
                    nothing for a writer to remember. Switch Brand and Mode in the toolbar to check
                    both registers.
                </>
            }
        >
            <div className="ep-blog rounded-lg border border-line bg-surface p-8">
                <div className="ep-prose">
                    <h2>What the trip-length data shows</h2>
                    <p>
                        Attendees booked 41,000 room nights across 340 events last season. The
                        headline number is unremarkable. The distribution behind it is not — and it
                        is the distribution, not the total, that determines whether a room block is
                        sized correctly.
                    </p>
                    <p>
                        Most reservations are short. <strong>Nearly half run three or four nights</strong>,
                        which is roughly what you would expect for an event with a two-day core
                        program and a shoulder night either side. The interesting part is at the tail.
                    </p>

                    <h3>The long tail is heavier than it looks</h3>
                    <p>
                        Trips of eight nights or more account for under 2% of reservations. They
                        account for <strong>11% of room nights</strong>. That ratio is what makes
                        headcount-based block sizing fail: it counts the reservation, not the nights.
                    </p>

                    <blockquote>
                        We stopped guessing at room block sizes the first season we had the
                        trip-length data in front of us.
                    </blockquote>

                    <h4>Where the long trips come from</h4>
                    <ul>
                        <li>Production and crew, who arrive before load-in and leave after strike</li>
                        <li>Exhibitors running multiple booths across adjacent events</li>
                        <li>International attendees combining the event with regional travel</li>
                    </ul>

                    <p>
                        Each of these books on a different curve. Crew reservations in particular
                        tend to land late — often after the cutoff date — which means they are
                        frequently absent from the very forecast that is supposed to account for them.
                    </p>

                    <ol>
                        <li>Export the season's reservations, including cancellations</li>
                        <li>Bucket by trip length rather than exact night count</li>
                        <li>Weight by room nights, not by reservation count</li>
                    </ol>

                    <p>
                        The third step is the one that changes the answer. In code terms, the fix is
                        replacing <code>count(reservations)</code> with{' '}
                        <code>sum(nights)</code> in the aggregate:
                    </p>

                    <pre>
                        <code>{`SELECT trip_length_bucket,
       COUNT(*)        AS reservations,
       SUM(room_nights) AS room_nights
FROM reservations
WHERE status <> 'cancelled'
GROUP BY 1
ORDER BY 1;`}</code>
                    </pre>

                    <hr />

                    <p>
                        The full breakdown is available per event in{' '}
                        <a href="#reports">Reports → Reservations</a>, and the methodology behind
                        these figures is described in the appendix.
                    </p>
                </div>
            </div>
        </Shell>
    ),
}
