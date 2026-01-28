<script setup lang="ts"> 
import { ref, computed } from 'vue'

const isShowLog = ref(false)
const isReadyShowLog = ref(false)
const time = ref(0)


interface Log {
    id: number
    updateTime: number
    logTime: number
    formatId: string
    formatUpdateTime: string
    formatTime: string
}

const logs = ref<Log[]>([])


const formateTimeFunc = (time: number): string[] => {
    let millisecond = time % 1000 + ''
    const second = Math.floor(time / 1000) % 60 + ''
    const minute = Math.floor(time / 60000) % 60 + ''

    millisecond = millisecond.slice(0, 2)

    return [millisecond.padStart(2, '0'), second.padStart(2, '0'), minute.padStart(2, '0')]
}


const formatTime = computed(() => {
    return formateTimeFunc(time.value)
})


let timeInterval: NodeJS.Timeout | null = null
const isStop = ref(false)
const isRun = ref(false)

const updateTime = () => {
    time.value += 10
}


const run = () => {
    isRun.value = true
    timeInterval = setInterval(updateTime, 10)
}


const tag = () => {
    const temp = time.value
    const id = logs.value.length
    let updateTime

    if (logs.value.length === 0) {
        updateTime = temp
    } else { 
        updateTime = (temp - (logs.value[0].logTime))
    }

    const formatTemp = formatTime.value[2] + ":" + formatTime.value[1] + "." + formatTime.value[0]
    const formatUpdateTimeArray = formateTimeFunc(updateTime)
    const formatUpdateTime = '+' + formatUpdateTimeArray[2] + ":" + formatUpdateTimeArray[1] + "." + formatUpdateTimeArray[0]


    logs.value.unshift({
        id: id,
        updateTime: updateTime,
        logTime: temp,
        formatId: id.toString().padStart(2, '0'),
        formatUpdateTime: formatUpdateTime,
        formatTime: formatTemp
    })
}


const stop = () => {
    if (isStop.value) {
        timeInterval = setInterval(updateTime, 10)
        isStop.value = false
    } else {            
        isStop.value = true
        clearInterval(timeInterval as NodeJS.Timeout)
        timeInterval = null
    }
}


const end = () => {
    if (isStop.value) {
        clearInterval(timeInterval as NodeJS.Timeout)
        timeInterval = null
        time.value = 0
        isStop.value = false
        isReadyShowLog.value = false
        isShowLog.value = false
        logs.value = []
        isRun.value = false
    } else {            
        isReadyShowLog.value = true
        if (document.documentElement.clientWidth > 1500) isShowLog.value = true
        tag()
    }
}


window.addEventListener('resize', () => {
    if (document.documentElement.clientWidth < 1500) {
        isShowLog.value = false
    } else {            
        if (isReadyShowLog.value) {
            isShowLog.value = true
        }
    }
})

</script>

<template>
    <div class="second-watch"> 
        <div class="second-watch-main">
            <div class="time">
                <div>{{ formatTime[2] }}</div>
                <div>:</div>
                <div>{{ formatTime[1] }}</div>
                <div>.</div>
                <div>{{ formatTime[0] }}</div>
            </div>

            <div v-show="isShowLog" class="log">
                <div class="log-item" v-for="item in logs" :key="item.id">
                    <div class="log-item-id">
                        {{ item.formatId}}
                    </div>

                    <div class="log-item-add">
                        {{ item.formatUpdateTime }}
                    </div>

                    <div class="log-item-time">
                        {{ item.formatTime }}
                    </div>
                </div>
            </div>
        </div>
        
        
        <div class="second-watch-btn">
            <div v-if="!isRun">
                <div class="btn" @click="run">
                    <svg class="btn-icon" t="1769273433490" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12369" ><path d="M195.4 89.6l677.7 383c30.6 17.3 30.6 61.4 0 78.6l-677.7 383c-30.1 17-67.4-4.7-67.4-39.3L128 129C128 94.4 165.3 72.6 195.4 89.6z" p-id="12370"></path></svg>
                </div>
            </div>

            <div v-else>
                <div @click="end" class="btn tag">
                    <svg v-show="!isStop" class="btn-icon" t="1769423859814" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13809"><path d="M826.8 416.2c-5.1 8.1-18.6 14.8-29.8 19.1L270.1 701.9V922c0 21.2-17.5 38.4-39 38.4s-39-17.2-39-38.4V102.3c0-21.2 17.5-38.4 39-38.4 7.9 0 15.1 2.3 21.1 6.3 4.9 3.2 185.9 97.8 543 283.7 13.4 6.3 25.9 10.7 32.6 22.2 3.8 6.5 4.8 13.5 4.5 20.4 0.3 6.9-0.4 11.5-5.5 19.7z"  p-id="13810"></path></svg>         
                    <svg v-show="isStop" class="btn-icon" t="1769350028793" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5989"><path d="M512 32a480 480 0 1 1 0 960 480 480 0 0 1 0-960zM512 128a384 384 0 1 0 0 768A384 384 0 0 0 512 128zM368 352h288a16 16 0 0 1 16 16v288a16 16 0 0 1-16 16h-288a16 16 0 0 1-16-16v-288a16 16 0 0 1 16-16z" p-id="5990"></path></svg>     
                </div>

                <div class="btn" @click="stop">
                    <svg v-show="isStop" class="btn-icon" t="1769273433490" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12369" ><path d="M195.4 89.6l677.7 383c30.6 17.3 30.6 61.4 0 78.6l-677.7 383c-30.1 17-67.4-4.7-67.4-39.3L128 129C128 94.4 165.3 72.6 195.4 89.6z" p-id="12370"></path></svg>
                    <svg v-show="!isStop" class="btn-icon" t="1769349581476" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4785"><path d="M512 977.454545C255.301818 977.454545 46.545455 768.651636 46.545455 512S255.301818 46.545455 512 46.545455s465.454545 208.802909 465.454545 465.454545-208.802909 465.454545-465.454545 465.454545z m0-861.090909c-218.158545 0-395.636364 177.477818-395.636364 395.636364 0 218.158545 177.477818 395.636364 395.636364 395.636364s395.636364-177.477818 395.636364-395.636364c0-218.158545-177.477818-395.636364-395.636364-395.636364zM414.999273 673.000727V351.045818a34.909091 34.909091 0 0 0-69.818182 0v321.954909a34.909091 34.909091 0 0 0 69.818182 0z m263.773091 0V351.045818a34.909091 34.909091 0 0 0-69.818182 0v321.954909a34.909091 34.909091 0 0 0 69.818182 0z"  p-id="4786"></path></svg>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.second-watch {
    width: 100%;
    height: 100%;
    color: var(--light-font-color);
    background-color: var(--light-option-bgc);
}

.second-watch>.second-watch-main {
    display: flex;
    justify-self: start;
    align-items: center;
    width: 100%;
    height: 70%;
    border-radius: 20px;
    box-shadow: 0 5px 13px rgba(0, 0, 0, 0.126);
}


.second-watch>.second-watch-main>.time {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-family: 'Montserrat', sans-serif;
    font-size: 200px;
    user-select: none;
}

.second-watch>.second-watch-main>.time> div:nth-child(2n + 1) {
    margin: 0 5px;
    width: 270px;
}



.second-watch>.second-watch-main>.log {
    box-sizing: border-box;
    flex: 1;
    width: 100%;
    height: 100%;
    padding: 10px 20px;
    overflow-x: hidden;
    overflow-y: auto;
}

.log>.log-item {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 80px;
}

.log>.log-item>div {
    padding: 0 40px;
    font-size: 40px;
    line-height: 80px;
    color: #828282;
    height: 100%;
}

.second-watch>.second-watch-btn{
    width: 100%;
    height: 30%;
}

.second-watch>.second-watch-btn>div {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;
}


.btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 80px;
    border-radius: 40px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.126);
    background-color: var(--light-option-second-bgc);
    cursor: pointer;
}

.tag {
    margin-right: 200px;
}


.btn-icon {
    width: 50px;
    height: 50px;
    fill: rgb(68, 143, 255);
}
</style>