import { createApp } from 'vue'
import ThemeWrapper from './ThemeWrapper.vue'
import 'mdui'
import { setColorScheme } from 'mdui/functions/setColorScheme.js';
import 'mdui/mdui.css'
import './style.css'

setColorScheme("#0f61c5")
createApp(ThemeWrapper).mount('#app')
