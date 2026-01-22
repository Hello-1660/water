import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Note from './Note.vue'
import router from './router'

const note = createApp(Note)
const pinia = createPinia()

note.use(pinia)
note.use(router) 
note.mount('#note')