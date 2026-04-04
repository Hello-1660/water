<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, onActivated, nextTick, watch } from 'vue'

defineProps({
    model: {
        type: String,
        default: 'stopwatch'
    }
})

const timeHour = ref(0)
const timeMinute = ref(0)
const timeSecond = ref(0)


const formatTimeNumber = (value: number, max: number, min: number): number => {
    if (value < min) {
        return min
    } else if (value > max) {
        return max
    } else {
        return value
    }
}


const formatHour = computed(() => {
    const number = formatTimeNumber(timeHour.value, 99, 0)
    timeHour.value = number
    return number
})

const formatMinute = computed(() => {
    const number = formatTimeNumber(timeMinute.value, 59, 0)
    timeMinute.value = number
    return number
})

const formatSecond = computed(() => {
    const number = formatTimeNumber(timeSecond.value, 59, 0)
    timeSecond.value = number
    return number
})


const formatTimeNum = computed(() => {
    return formatHour.value * 3600 + formatMinute.value * 60 + formatSecond.value
})

const time = computed(() => {
    return `
        ${formatHour.value.toString().padStart(2, '0')}:
        ${formatMinute.value.toString().padStart(2, '0')}:
        ${formatSecond.value.toString().padStart(2, '0')}`
})  

const blur = (e: FocusEvent) => {
    const value = (e.target as HTMLInputElement)?.value
    const id = (e.target as HTMLInputElement)?.dataset?.id

    if (value !== '') return 

    if (id === '1') {
        timeHour.value = 0
    } else if (id === '2') {
        timeMinute.value = 0
    } else if (id === '3') {
        timeSecond.value = 0
    }
}


const hourNumInput = ref<HTMLInputElement | undefined>()
const minuteNumInput = ref<HTMLInputElement | undefined>()
const secondNumInout = ref<HTMLInputElement | undefined>()

const handleNumberInputEnter = (e: KeyboardEvent) => {
    const id = (e.target as HTMLInputElement)?.dataset?.id

    if (id === '1') {
        hourNumInput.value?.blur()
        minuteNumInput.value?.focus()
    } else if (id === '2') {
        minuteNumInput.value?.blur()
        secondNumInout.value?.focus()
    } else {
        secondNumInout.value?.blur()
        stopwatchBegin()
    }
}

const isShowStopwatchSetting = ref(true)







const isRunStop = ref(false)
/** 剩余秒数（小数），由 rAF 按墙钟时间更新，圆环连续变化 */
const runTimeNumFloat = ref(0)
/** 用户在设置里填写的总秒数 T；数字倒计时跑满 T 秒，圆环进度比时间少「视觉上的 1 秒」（提前一圈收完） */
const countdownTotal = ref(0)
/** 倒计时结束时刻（ms），暂停时置 null 并把剩余记在 pausedRemainMs */
const countdownDeadlineMs = ref<number | null>(null)
const pausedRemainMs = ref(0)
const pathLengthPx = ref(0)
const isShowRunBtn = ref(true)
const mainRoundP = ref<SVGCircleElement | null>(null)

const runTime = computed(() => {
    const totalSeconds = Math.max(0, Math.floor(runTimeNumFloat.value + 1e-6))
    const hour = Math.floor(totalSeconds / 3600)
    const minute = Math.floor((totalSeconds % 3600) / 60)
    const second = Math.floor(totalSeconds % 60)

    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
})

let rafId = 0

function stopTickLoop() {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = 0
}

function tickLoop() {
    const deadline = countdownDeadlineMs.value
    if (deadline == null || isRunStop.value) {
        return
    }
    const now = Date.now()
    const remSec = Math.max(0, (deadline - now) / 1000)
    runTimeNumFloat.value = remSec

    if (remSec <= 0) {
        runTimeNumFloat.value = 0
        closeRunTime()
        return
    }

    rafId = requestAnimationFrame(tickLoop)
}

function startTickLoop() {
    stopTickLoop()
    rafId = requestAnimationFrame(tickLoop)
}

const closeRunTime = () => {
    stopTickLoop()
    countdownDeadlineMs.value = null
    isRunStop.value = true
}


const endRunTime = () => {
    closeRunTime()
    isShowStopwatchSetting.value = true
    isRunStop.value = false
    countdownTotal.value = 0
    pathLengthPx.value = 0
    pausedRemainMs.value = 0
    runTimeNumFloat.value = 0
}

const stopRunTime = () => {
    if (isRunStop.value) {
        if (runTimeNumFloat.value <= 0) return

        isRunStop.value = false
        countdownDeadlineMs.value = Date.now() + pausedRemainMs.value
        startTickLoop()
    } else {
        isRunStop.value = true
        if (countdownDeadlineMs.value != null) {
            pausedRemainMs.value = Math.max(0, countdownDeadlineMs.value - Date.now())
            runTimeNumFloat.value = pausedRemainMs.value / 1000
        }
        stopTickLoop()
    }
}

function syncPathLength() {
    nextTick(() => {
        if (mainRoundP.value) pathLengthPx.value = mainRoundP.value.getTotalLength()
    })
}

/**
 * 圆环：在剩余时间还剩 1 秒时已走完（比数字早「一圈」约 1 秒），避免原先动画偏长；
 * 数字仍按 runTimeNumFloat 跑满 T 秒。
 */
const circleStrokeStyle = computed(() => {
    if (isShowStopwatchSetting.value || countdownTotal.value <= 0) return {}
    const L = pathLengthPx.value
    if (L <= 0) return {}
    const T = countdownTotal.value
    const rem = Math.max(0, runTimeNumFloat.value)
    let ratio: number
    if (T <= 1) {
        ratio = rem / T
    } else {
        const ringRem = Math.max(0, rem - 1)
        ratio = ringRem / (T - 1)
    }
    return {
        strokeDasharray: L,
        strokeDashoffset: ratio * L,
    }
})

watch(isShowStopwatchSetting, (showSetting) => {
    if (!showSetting && countdownTotal.value > 0) syncPathLength()
})

const stopwatchBegin = () => {
    const T = formatTimeNum.value
    if (T <= 0) return

    stopTickLoop()
    countdownTotal.value = T
    const totalMs = T * 1000
    countdownDeadlineMs.value = Date.now() + totalMs
    pausedRemainMs.value = totalMs
    runTimeNumFloat.value = T
    isRunStop.value = false
    isShowStopwatchSetting.value = false

    syncPathLength()
    startTickLoop()
}

function onWindowResize() {
    const width = document.documentElement.clientWidth
    if (isShowStopwatchSetting.value) {
        width > 1400 ? (isShowRunBtn.value = true) : (isShowRunBtn.value = false)
    } else {
        syncPathLength()
        width > 1400 ? (isShowRunBtn.value = true) : (isShowRunBtn.value = false)
    }
}

onMounted(() => {
    document.documentElement.clientWidth > 1400 ? (isShowRunBtn.value = true) : (isShowRunBtn.value = false)
    window.addEventListener('resize', onWindowResize)
    document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
    window.removeEventListener('resize', onWindowResize)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    stopTickLoop()
})

onActivated(() => {
    if (!isShowStopwatchSetting.value && countdownTotal.value > 0) {
        syncPathLength()
        // 切回页面后 rAF 可能停过，正在计时时补一轮
        if (!isRunStop.value && countdownDeadlineMs.value != null) {
            startTickLoop()
        }
    }
})

function onVisibilityChange() {
    if (document.visibilityState !== 'visible') return
    if (
        !isShowStopwatchSetting.value &&
        !isRunStop.value &&
        countdownDeadlineMs.value != null
    ) {
        startTickLoop()
    }
}
</script>


<template>
    <div class="clock">
        <div class="stopwatch" v-if="model === 'stopwatch'">
            <div class="stopwatch-setting" v-if="isShowStopwatchSetting">
                <div class="stopwatch-setting-main">
                    <div>{{ time }}</div>
                </div>

                <div class="stopwatch-setting-status">
                    <div class="setting-time">
                        <input type="number" maxlength="2" ref="hourNumInput" @blur="blur" v-model="timeHour" :data-id="1" @keydown.enter="handleNumberInputEnter">
                        <input type="number" maxlength="2" ref="minuteNumInput" @blur="blur" v-model="timeMinute" :data-id="2" @keydown.enter="handleNumberInputEnter">
                        <input type="number" maxlength="2" ref="secondNumInout" @blur="blur" v-model="timeSecond" :data-id="3" @keydown.enter="handleNumberInputEnter">  
                    </div>

                    <div class="setting-btn btn" @click="stopwatchBegin">
                        <svg class="btn-icon" t="1769273433490" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12369" ><path d="M195.4 89.6l677.7 383c30.6 17.3 30.6 61.4 0 78.6l-677.7 383c-30.1 17-67.4-4.7-67.4-39.3L128 129C128 94.4 165.3 72.6 195.4 89.6z" p-id="12370"></path></svg>
                    </div>
                </div>
            </div>

            <div class="stopwatch-work" v-else>
                <div class="stopwatch-work-main">
                    <div class="main-round">
                        <svg> 
                            <circle
                                ref="mainRoundP"
                                class="main-round-p"
                                cx="50%"
                                cy="50%"
                                r="365"
                                fill="none"
                                :style="circleStrokeStyle"
                            ></circle>
                        </svg>
                        <div class="main-round-time">
                            {{ runTime }} 
                        </div>
                    </div>

                    <div class="main-round-btn" v-if="isShowRunBtn">
                        <div class="btn" @click="endRunTime">
                            <svg class="btn-icon" t="1769350028793" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5989"><path d="M512 32a480 480 0 1 1 0 960 480 480 0 0 1 0-960zM512 128a384 384 0 1 0 0 768A384 384 0 0 0 512 128zM368 352h288a16 16 0 0 1 16 16v288a16 16 0 0 1-16 16h-288a16 16 0 0 1-16-16v-288a16 16 0 0 1 16-16z" p-id="5990"></path></svg>     
                        </div>
                        
                        <div class="btn" @click="stopRunTime">
                            <svg v-if="isRunStop" class="btn-icon" t="1769273433490" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12369" ><path d="M195.4 89.6l677.7 383c30.6 17.3 30.6 61.4 0 78.6l-677.7 383c-30.1 17-67.4-4.7-67.4-39.3L128 129C128 94.4 165.3 72.6 195.4 89.6z" p-id="12370"></path></svg>
                            <svg v-else class="btn-icon" t="1769349581476" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4785"><path d="M512 977.454545C255.301818 977.454545 46.545455 768.651636 46.545455 512S255.301818 46.545455 512 46.545455s465.454545 208.802909 465.454545 465.454545-208.802909 465.454545-465.454545 465.454545z m0-861.090909c-218.158545 0-395.636364 177.477818-395.636364 395.636364 0 218.158545 177.477818 395.636364 395.636364 395.636364s395.636364-177.477818 395.636364-395.636364c0-218.158545-177.477818-395.636364-395.636364-395.636364zM414.999273 673.000727V351.045818a34.909091 34.909091 0 0 0-69.818182 0v321.954909a34.909091 34.909091 0 0 0 69.818182 0z m263.773091 0V351.045818a34.909091 34.909091 0 0 0-69.818182 0v321.954909a34.909091 34.909091 0 0 0 69.818182 0z"  p-id="4786"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
* {
    margin: 0;
    padding: 0;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0; 
}

input[type="number"]:focus {
    outline: none;
}


.clock {
    width: 100%;
    height: 100%;
    color: var(--light-font-color);
    background-color: var(--light-option-bgc);
}

.stopwatch {
    width: 100%;
    height: 100%;
}

.stopwatch-setting {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}


.stopwatch-setting>.stopwatch-setting-main {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70%;
    font-family: 'Montserrat', sans-serif;
    font-size: 200px;
    border-radius: 20px;
    box-shadow: 0 5px 13px rgba(0, 0, 0, 0.126);
    user-select: none;
}

.stopwatch-setting>.stopwatch-setting-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 30%;
}

.setting-time {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 600px;
    height: 100px;
}


.setting-time>input[type="number"] { 
    width: 100px;
    height: 80px;
    font-size: 45px;
    margin: 0 10px;
    padding: 0 10px;
    border: none;
    border-radius: 10px;
    background-color: var(--light-option-second-bgc);
    color: var(--light-font-color);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.126);
}


.btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 80px;
    margin-right: 200px;
    border-radius: 40px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.126);
    background-color: var(--light-option-second-bgc);
    cursor: pointer;
}


.btn-icon {
    width: 50px;
    height: 50px;
    fill: rgb(68, 143, 255);
}


.stopwatch-work {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    width: 100%;
    height: 100%;
}

.stopwatch-work>.stopwatch-work-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-family: 'Montserrat', sans-serif;
    border-radius: 20px;
    box-shadow: 0 5px 13px rgba(0, 0, 0, 0.126);
    user-select: none;
}

.stopwatch-work>.stopwatch-work-main>.main-round { 
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750px;
    height: 750px;
    border-radius: 50%;
    box-shadow: 0 5px 13px rgba(0, 0, 0, 0.126);
}



.main-round>svg {
    position: absolute;
    width: 100%;
    height: 100%;
}

.main-round>svg>.main-round-p {
    stroke: rgb(68, 143, 255);
    stroke-width: 6;
    transform: rotate(-90deg);
    transform-origin: 375px 375px;
}

.main-round>.main-round-time { 
    font-size: 100px;
}



.stopwatch-work>.stopwatch-work-main>.main-round-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 15%;
}


.stopwatch-work>.stopwatch-work-main>.main-round-btn>div {
    width: 150px;
    height: 80px;
    margin-right: 0;
}

.stopwatch-work>.stopwatch-work-main>.main-round-btn>div:first-child {
    margin-right: 450px;
}

.stopwatch-work>.stopwatch-work-main>.main-round-btn svg {
    width: 50px;
    height: 50px;
    fill: rgb(68, 143, 255);
}

</style>