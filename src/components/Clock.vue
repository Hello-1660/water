<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

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
const runTimeNum = ref(0)
const isShowRunBtn = ref(true)
const mainRoundP = ref<SVGCircleElement | null> (null)
const runTime = computed(() => { 
    const totalSeconds = Math.floor(runTimeNum.value); 
    const hour = Math.floor(totalSeconds / 3600); 
    const minute = Math.floor((totalSeconds % 3600) / 60); 
    const second = Math.floor(totalSeconds % 60); 

    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
})


let runTimeInterval: NodeJS.Timeout | null = null 

const updateRunTime = () => {
    if (runTimeNum.value <= 0) {
        closeRunTime()
        return
    }

    runTimeNum.value -= 1
}


const closeRunTime = () => { 
    clearInterval(runTimeInterval as NodeJS.Timeout)
    runTimeInterval = null
    isRunStop.value = true
}


const endRunTime = () => { 
    closeRunTime()
    isShowStopwatchSetting.value = true
    isRunStop.value = false
}

const stopRunTime = () => {
    if (isRunStop.value) {
        isRunStop.value = false
        updateRunTime()
        runTimeInterval = setInterval(updateRunTime, 1000)

        mainRoundActiveRunning()
    } else {            
        isRunStop.value = true
        clearInterval(runTimeInterval as NodeJS.Timeout)
        runTimeInterval = null
        mainRoundActiveStop()
    }
}



const mainRoundPActive = (len: string, time: number) => {
    if (!mainRoundP.value) return

    mainRoundP.value.style.setProperty('--l', `${mainRoundP.value.getTotalLength()}`)
    mainRoundP.value.style.setProperty('--len', len)
    mainRoundP.value.style.setProperty('--t', `${time}s`)

    mainRoundP.value.classList.add('svg-active')
}


const mainRoundActiveStop = () => {
    if (!mainRoundP.value) return
    mainRoundP.value.classList.add('svg-paused')
}


const mainRoundActiveRunning = () => {
    if (!mainRoundP.value) return  

    mainRoundP.value.classList.remove('svg-paused')
}


const stopwatchBegin = () => {
    if (formatTimeNum.value <= 0) return  

    runTimeNum.value = formatTimeNum.value
    updateRunTime()
    runTimeInterval = setInterval(updateRunTime, 1000)
    isShowStopwatchSetting.value = false

    nextTick(() => {
        if (!mainRoundP.value) return 
        mainRoundPActive(mainRoundP.value.getTotalLength() + '', runTimeNum.value)
    })
}


window.addEventListener('resize', () => {
    const width = document.documentElement.clientWidth

    if (isShowStopwatchSetting) {
        width > 1400 ? isShowRunBtn.value = true : isShowRunBtn.value = false
    }
})


onMounted(() => { 
    document.documentElement.clientWidth > 1400 ? isShowRunBtn.value = true : isShowRunBtn.value = false
})
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
                            <circle ref="mainRoundP" class="main-round-p" cx="50%" cy="50%" r="365" fill="none"></circle>
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
    --l: 0;
    --len: 0;
    --t: 0s;
    stroke:rgb(68, 143, 255);
    stroke-width: 6;
    transform: rotate(-90deg);
    transform-origin: 375px 375px;
}

.svg-active {
    stroke-dasharray: var(--l);
    stroke-dashoffset: var(--len);
    animation: active var(--t) linear forwards;
    animation-play-state: running;
}

.svg-paused {
    animation-play-state: paused;
}


@keyframes active {
    to {
        stroke-dashoffset: 0;
    }
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