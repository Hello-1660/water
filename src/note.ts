import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Note from './Note.vue'

const note = createApp(Note)
const pinia = createPinia()

note.use(pinia)
note.mount('#note')