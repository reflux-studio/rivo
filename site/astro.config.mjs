import react from '@astrojs/react'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://reflux-studio.github.io',
  base: '/rivo',
  output: 'static',
  integrations: [react()]
})
