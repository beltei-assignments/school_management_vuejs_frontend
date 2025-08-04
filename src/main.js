/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'

import DataTable from '@/components/DataTable.vue'
import BaseHeader from '@/lib/components/BaseHeader.vue'

// Plugins
import { registerPlugins } from '@/plugins'
// Components
import App from './App.vue'

// Styles
import 'unfonts.css'

const app = createApp(App)

app.component('DataTable', DataTable)
app.component('BaseHeader', BaseHeader)

registerPlugins(app)

app.mount('#app')
