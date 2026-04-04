import { defineStore } from 'pinia'

export const useTimingFloatStore = defineStore('timingFloat', {
    state: () => ({
        clockActive: false,
        clockLabel: '',
        /** 倒计时是否暂停（与 Clock isRunStop 一致） */
        clockPaused: false,
        clockPauseTogglePending: false,
        secondActive: false,
        secondLabel: '',
        /** 秒表是否处于暂停（与 SecondWatch isStop 一致） */
        secondPaused: false,
        secondTagPending: false,
    }),
    actions: {
        patchClock(active: boolean, label: string, paused = false) {
            this.clockActive = active
            this.clockLabel = label
            this.clockPaused = active ? paused : false
        },
        requestClockPauseToggle() {
            this.clockPauseTogglePending = true
        },
        clearClockPauseToggleRequest() {
            this.clockPauseTogglePending = false
        },
        patchSecond(active: boolean, label: string, paused: boolean) {
            this.secondActive = active
            this.secondLabel = label
            this.secondPaused = paused
        },
        requestSecondTag() {
            this.secondTagPending = true
        },
        clearSecondTagRequest() {
            this.secondTagPending = false
        },
    },
})
