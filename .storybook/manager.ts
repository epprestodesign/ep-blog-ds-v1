import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'EventPipe Blog Design System',
    brandUrl: 'https://github.com/epprestodesign/ep-blog-ds-v1',
    colorPrimary: '#00ADB3',
    colorSecondary: '#10163E',
    appBg: '#F4F7F9',
    appBorderRadius: 4,
    fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }),
})
