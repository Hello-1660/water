import { defineStore } from "pinia"
import { ref } from "vue"


export const useTimeStore = defineStore('time', () => {
    const remainTime = ref(0)
    const isRunning = ref(false)

    return {
        remainTime,
        isRunning
    }   
})