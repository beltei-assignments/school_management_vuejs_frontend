/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

import router from '@/router'
import pinia from '@/stores'
// Plugins
import { rulesPlugin, vuetify } from './vuetify'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(rulesPlugin, vuetify.locale)
    .use(router)
    .use(pinia)
}
