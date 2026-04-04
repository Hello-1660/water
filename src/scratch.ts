import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ScratchPad from './views/ScratchPad.vue'

const app = createApp(ScratchPad)
app.use(createPinia())
app.mount('#scratch')
