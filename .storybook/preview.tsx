import type { Decorator, Preview } from '@storybook/react-vite'
import { useEffect } from 'react'
import '../src/styles/globals.css'
// The shipped Webflow stylesheet, loaded as-is. Stories render against the
// same CSS the live blog does, so a story cannot pass on styles that Webflow
// will never receive.
import '../src/webflow-embeds/blog-embeds.css'

/**
 * Brand and mode are set as attributes on <html> rather than on a wrapper
 * div, because that is exactly how they are set on a real page — and because
 * the Webflow embed stylesheet resolves its own scoped copy the same way.
 * Setting them anywhere else would let a story pass while production fails.
 */
const withTheme: Decorator = (Story, context) => {
  const { brand, mode } = context.globals as { brand: string; mode: string }

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-ep-brand', brand)
    root.setAttribute('data-ep-mode', mode)
  }, [brand, mode])

  return <Story />
}

const preview: Preview = {
  globalTypes: {
    brand: {
      description: 'EventPipe brand foundation',
      defaultValue: 'marketing',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'marketing', title: 'Marketing — Midnight / Teal' },
          { value: 'product', title: 'Product — Azure / Graphite' },
        ],
        dynamicTitle: true,
      },
    },
    mode: {
      description: 'Light or dark surface',
      defaultValue: 'light',
      toolbar: {
        title: 'Mode',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        order: [
          'Getting Started',
          // Mirrors the Foundations order in the EventPipe product design
          // system, so someone moving between the two libraries finds the
          // same page in the same place.
          'Foundations',
          [
            'Colors',
            'Border Radius',
            'Breakpoints',
            'Elevation',
            'Icons',
            'Imagery',
            'Logos',
            'Motion',
            'Palette',
            'Spacing',
            'Typography',
          ],
          'Color Explorations',
          ['Overview', "Justin's Exploration"],
          'Embed Kit',
          ['Webflow Setup', 'Content Style Guide', 'Components', 'Charts'],
          'Editorial',
        ],
      },
    },
  },
}

export default preview
