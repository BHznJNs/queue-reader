import "@fontsource/roboto" // Defaults to weight 400
import "@fontsource/roboto/400.css" // Specify weight
import "@fontsource/roboto/400-italic.css" // Specify weight and style

import './scripts/initialize'
import { createApp } from 'vue'

import { createI18nWith } from "./scripts/i18n"
import IndexWrapper from './wrapper/IndexWrapper.vue'

import 'mdui'
import { setColorScheme } from 'mdui/functions/setColorScheme.js'
import 'mdui/mdui.css'
import './style.css'

setColorScheme("#0f61c5")
createApp(IndexWrapper)
    .use(createI18nWith(globalThis.__CONFIG__.language))
    .mount('#app')
