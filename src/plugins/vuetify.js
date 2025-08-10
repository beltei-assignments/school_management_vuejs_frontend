import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'

import * as directives from 'vuetify/directives'
import { createRulesPlugin } from 'vuetify/labs/rules'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { VIconBtn } from 'vuetify/labs/VIconBtn'

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const customTheme = {
  dark: false,
  colors: {
    primary: '#006CBB',
    secondary: '#F93549',
    success: '#4CAF50',
    info: '#02BDFE',
    warning: '#FCBE01',
    error: '#D32F2F',
    surface: '#FFFFFF',
  },
}

export const vuetify = createVuetify({
  components: {
    VIconBtn,
    VDateInput,
    VFileUpload,
    ...components,
  },
  directives,
  theme: {
    options: {
      customProperties: true,
    },
    defaultTheme: 'customTheme',
    themes: {
      customTheme,
    },
  },
})

export const rulesPlugin = createRulesPlugin({ rules: {
  aliases: {
    // Create a new rule named "pinCode"
    pinCode: err => {
      return v => (/^[\d]{4}$/.test(v)) || err || 'Field must contain a 4-digit PIN'
    },
    // Overwrite an existing rule by redefining it
    integer: err => {
      return v => Number.isInteger(v) || err || 'Field must contain an integer value'
    },
  },
} }, vuetify.locale)
