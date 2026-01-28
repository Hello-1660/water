<script setup lang="ts">
import Button from '../components/Button.vue'
import { useUiConfigStore  } from '../stores/uiConfigStore'
import { useSettingStore } from '../stores/settingStore'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const uiConfigStore = useUiConfigStore()
const { getUIConfig } = storeToRefs(uiConfigStore)

const settingStore = useSettingStore()
const { settingContent } = storeToRefs(settingStore)


const timeFontSize = ref(getUIConfig.value?.mainConfig.time.fontSize)
const timeFontColor = ref(getUIConfig.value?.mainConfig.time.fontColor)
const dataFontSize = ref(getUIConfig.value?.mainConfig.date.fontSize)
const dataFontColor = ref(getUIConfig.value?.mainConfig.date.fontColor) 
const dataContent = ref(getUIConfig.value?.mainConfig.date.content)


const autostart = ref(settingContent.value.setting.autostart)
const handleAuoStart = (data: boolean) => {
    autostart.value = data
}


const dark = ref(settingContent.value.setting.dark)
const handleDark = (data: boolean) => {
    dark.value = data

    if (dark.value) {
        change2NightTheme()
    } else {
        change2LightTheme()
    }

    save()
}


const showClock = ref(settingContent.value.setting.showClock)

const handleShowClock = (data: boolean) => {
    showClock.value = data
}


const writeUiConfig = computed(() => {
    return {
        mainConfig: {
            time: {
                fontSize: timeFontSize.value,
                fontColor: timeFontColor.value
            },
            date: {
                fontSize: dataFontSize.value,
                fontColor: dataFontColor.value,
                content: dataContent.value
            }
        }
    }
})


const writeSetting = computed(() => {
    return {
        setting: {
            autostart: autostart.value,
            dark: dark.value,
            showClock: showClock.value
        }
    }
})


const save = () => {
    window.electronAPI.setConfig('', writeUiConfig.value)
    window.electronAPI.setSetting('', writeSetting.value)
}



const change2LightTheme = () => {
    document.documentElement.style.setProperty('--light-main-bgc', '#f9f9f9')
    document.documentElement.style.setProperty('--light-second-bgc', '#f2f2f2')
    document.documentElement.style.setProperty('--light-item-bgc', '#f5f5f5')
    document.documentElement.style.setProperty('--light-svg-fill', '#999999')
    document.documentElement.style.setProperty('--light-svg-hover-fill', '#484848')
    document.documentElement.style.setProperty('--light-svg-main-fill', '#aaaaaa')
    document.documentElement.style.setProperty('--light-svg-main-hover-fill', '#3d3d3d')
    document.documentElement.style.setProperty('--light-font-color', '#262626')
    document.documentElement.style.setProperty('--light-font-second-color', '#626262')
    document.documentElement.style.setProperty('--light-option-bgc', '#f9f9f9')
    document.documentElement.style.setProperty('--light-option-second-bgc', '#f2f2f2')
    document.documentElement.style.setProperty('--light-todo-bgc', '#dbe4e6')
    document.documentElement.style.setProperty('--light-todo-editor-bgc', '#f9f9f9')
}

const change2NightTheme = () => {
    document.documentElement.style.setProperty('--light-main-bgc', '#161822')
    document.documentElement.style.setProperty('--light-second-bgc', '#1f2330')
    document.documentElement.style.setProperty('--light-item-bgc', '#383f51')
    document.documentElement.style.setProperty('--light-svg-fill', '#929cb8')
    document.documentElement.style.setProperty('--light-svg-hover-fill', '#fefefe')
    document.documentElement.style.setProperty('--light-svg-main-fill', '#aaaaaa')
    document.documentElement.style.setProperty('--light-svg-main-hover-fill', '#ffffff')
    document.documentElement.style.setProperty('--light-font-color', '#ffffff')
    document.documentElement.style.setProperty('--light-font-second-color', '#d7d6df')
    document.documentElement.style.setProperty('--light-option-bgc', '#252632')
    document.documentElement.style.setProperty('--light-option-second-bgc', '#3c3d45')
    document.documentElement.style.setProperty('--light-todo-bgc', '#363330')
    document.documentElement.style.setProperty('--light-todo-editor-bgc', '#27273a')
}
</script>


<template>
    <div class="container">
        <div class="setting-main">
            <div class="item">
                <div class="item-title">桌面时钟</div>
                <div class="option" >
                    <label for="clock" class="clock">
                        <div>
                            <svg t="1769521912372" class="option-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9878"><path d="M512 64.437073c-247.158634 0-447.562927 200.404293-447.562927 447.562927 0 247.258537 200.404293 447.562927 447.562927 447.562927s447.463024-200.404293 447.562927-447.562927c-0.099902-247.158634-200.404293-447.463024-447.562927-447.562927z m0 777.940293c-182.421854-0.39961-330.077659-147.955512-330.377366-330.277464 0.39961-182.321951 147.955512-329.877854 330.377366-330.277463 182.321951 0.39961 329.877854 147.955512 330.277463 330.277463-0.39961 182.321951-147.955512 329.977756-330.277463 330.277464zM292.814049 270.635707L534.877659 449.560976l161.142634-104.697756L567.445854 534.178341l-4.295805 6.293854c-3.096976 3.69639-6.493659 6.993171-10.589659 9.590634-6.993171 4.595512-15.384976 7.192976-24.476097 7.192976-15.884488 0-29.770927-8.192-37.962927-20.579903l-0.39961 0.39961-196.907707-266.439805z" p-id="9879"></path></svg>
                            桌面时钟显示
                        </div>
                        <Button id="clock"
                        :theme="showClock"
                        @update="handleShowClock"
                        >
                            <template #label1>关</template>
                            <template #label2>开</template>
                        </Button>
                    </label>

                    <label for="time-font-size">
                        <div>
                            <svg t="1769521615116" class="option-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4873"><path d="M557.213538 771.268923l-46.631384-122.722461h-230.793846l-45.804308 122.722461H148.440615L357.612308 239.340308h76.091077l165.494153 421.139692 81.250462-216.536615h54.547692l122.761846 327.325538h-54.547692l-30.838154-81.841231h-129.575384l-15.714462 41.984 15.714462 39.857231h-85.543385z m150.449231-254.503385l-44.189538 118.153847h88.379077l-44.189539-118.153847z m-312.044307-175.931076l-84.716308 225.870769h169.393231l-84.676923-225.870769z" p-id="4874"></path></svg>
                            时间字体大小
                        </div>
                        <input id="time-font-size" type="number" v-model="timeFontSize">
                    </label>

                    <label for="time-size-color">
                        <div>
                            <svg t="1769522055175" class="option-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10915"><path d="M512 85.333333c235.605333 0 426.666667 169.728 426.666667 379.264a237.141333 237.141333 0 0 1-237.056 237.013334h-83.882667c-39.338667 0-71.125333 31.786667-71.125333 71.125333 0 18.005333 7.125333 34.602667 18.005333 46.933333 11.392 12.8 18.517333 29.397333 18.517333 47.872C583.125333 906.922667 550.4 938.666667 512 938.666667 276.394667 938.666667 85.333333 747.605333 85.333333 512S276.394667 85.333333 512 85.333333z m-50.730667 687.402667a156.330667 156.330667 0 0 1 156.458667-156.458667h83.882667A151.808 151.808 0 0 0 853.333333 464.64C853.333333 304.597333 702.634667 170.666667 512 170.666667a341.333333 341.333333 0 0 0-28.842667 681.472 155.648 155.648 0 0 1-21.888-79.36zM320 512a64 64 0 1 1 0-128 64 64 0 0 1 0 128z m384 0a64 64 0 1 1 0-128 64 64 0 0 1 0 128zM512 384a64 64 0 1 1 0-128 64 64 0 0 1 0 128z"  p-id="10916"></path></svg>
                            时间字体颜色
                        </div>
                        <input id="time-size-color" type="color" v-model="timeFontColor">
                    </label>

                    <label for="custom-font-size">
                        <div>
                            <svg t="1769522238009" class="option-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13257"><path d="M24.380952 560.761905h97.52381v-58.514286h112.152381v438.857143h97.523809v-438.857143H438.857143v58.514286h97.523809V404.72381H24.380952z" p-id="13258"></path><path d="M273.066667 78.019048v175.542857h97.523809V175.542857H585.142857v770.438095h97.52381V175.542857h219.428571v82.895238h97.52381V78.019048z" p-id="13259"></path></svg>
                            自定义文本字体大小
                        </div>
                        <input id="custom-font-size" type="number" v-model="dataFontSize">
                    </label>

                    <label for="custom-font-color">
                        <div>
                            <svg t="1769522147346" class="option-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12070"><path d="M972.18 411.1c-2.06-9.41-10.51-16-20.16-15.72-4.23 0.13-8.16 0.2-12.04 0.2-192.68 0-354.92-144.08-377.38-335.14-1.13-9.58-8.93-16.99-18.56-17.62A480.93 480.93 0 0 0 513 41.81c-63.44 0-124.99 12.43-182.95 36.94-55.97 23.67-106.23 57.56-149.39 100.72-43.16 43.16-77.04 93.42-100.72 149.39C55.43 386.8 43 448.36 43 511.8s12.43 124.99 36.94 182.95c23.67 55.97 57.56 106.23 100.72 149.39 43.16 43.16 93.42 77.04 149.39 100.72C388.01 969.37 449.56 981.8 513 981.8c63.44 0 124.99-12.43 182.95-36.94 55.97-23.67 106.23-57.56 149.39-100.72 43.16-43.16 77.04-93.42 100.72-149.39C970.57 636.79 983 575.24 983 511.8c0-33.94-3.64-67.82-10.82-100.7zM513 941.8c-237.1 0-430-192.9-430-430s192.9-430 430-430c4.05 0 8.13 0.06 12.21 0.17 15.1 94.92 62.52 181.96 134.71 246.6 76.14 68.17 174.14 106.08 276.34 106.98 4.48 25.05 6.74 50.62 6.74 76.24C943 748.9 750.1 941.8 513 941.8z" fill="#333333" p-id="12071"></path><path d="M353.35 353.67m-75 0a75 75 0 1 0 150 0 75 75 0 1 0-150 0Z" fill="#333333" p-id="12072"></path><path d="M309.64 600.37m-50 0a50 50 0 1 0 100 0 50 50 0 1 0-100 0Z" fill="#333333" p-id="12073"></path><path d="M475.59 730.76m-50 0a50 50 0 1 0 100 0 50 50 0 1 0-100 0Z" p-id="12074"></path></svg>
                            自定义文本字体颜色
                        </div>
                        <input id="custom-font-color" type="color" v-model="dataFontColor">
                    </label>

                    <label for="custom-font-content">
                        <div>
                            <svg t="1769522292601" class="option-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14309" width="200" height="200"><path d="M1024 0H0v1024h1024V0z" fill="#FFFFFF" fill-opacity=".01" p-id="14310"></path><path d="M149.333333 213.333333a128 128 0 0 1 128-128h554.666667a42.666667 42.666667 0 0 1 42.666667 42.666667v768a42.666667 42.666667 0 0 1-42.666667 42.666667H277.333333a128 128 0 0 1-128-128V213.333333z m128-42.666666a42.666667 42.666667 0 0 0-42.666666 42.666666v597.333334a42.666667 42.666667 0 0 0 42.666666 42.666666h512V170.666667H277.333333z" fill="#000000" p-id="14311"></path><path d="M149.333333 789.333333a149.333333 149.333333 0 0 1 149.333334-149.333333h576v256a42.666667 42.666667 0 0 1-42.666667 42.666667H298.666667a149.333333 149.333333 0 0 1-149.333334-149.333334z m149.333334-64a64 64 0 1 0 0 128h490.666666v-128H298.666667z" p-id="14312"></path></svg>
                            自定义文本内容
                        </div>
                        <input id="custom-font-content" type="text" v-model="dataContent">
                    </label>
                </div>  
            </div>

            <div class="item">
                <div class="item-title">通用设置</div>
                <div class="option">
                    <label>
                        <div>
                            <svg t="1769522365831" class="option-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15349"><path d="M512 938.666667C276.352 938.666667 85.333333 747.648 85.333333 512S276.352 85.333333 512 85.333333s426.666667 191.018667 426.666667 426.666667-191.018667 426.666667-426.666667 426.666667z m205.653333-210.090667a298.666667 298.666667 0 1 0-79.061333 54.016l-41.557333-74.88A213.333333 213.333333 0 1 1 725.333333 512h-128l120.32 216.576z"  p-id="15350"></path></svg>
                            开机自启
                        </div>
                        <Button
                        :theme="autostart"
                        @update="handleAuoStart"
                        >
                            <template #label1>关</template>
                            <template #label2>开</template>
                        </Button>
                    </label>

                    <label>
                        <div>
                            <svg t="1769522402341" class="option-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16367"><path d="M511.3 62.5c20.1 0 40.1 1.4 60.2 4.3-112.5 99.6-123.2 270.7-23.7 383.9s271.4 123.2 383.8 23.6c8.6-7.2 16.5-15 23.6-23.6 2.9 19.3 4.3 39.4 4.3 60.2 0 247.1-200.5 447.6-447.6 447.6S64.4 757.9 64.4 510.8 264.2 62.5 511.3 62.5z" p-id="16368"></path></svg>
                            暗色模式
                        </div>
                        <Button
                        :theme="dark"
                        @update="handleDark"
                        >
                            <template #label1>关</template>
                            <template #label2>开</template>
                        </Button>
                    </label>

                    <label>
                        <div>
                            <svg t="1769522449475" class="option-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17599"><path d="M508.2112 917.248a411.4432 411.4432 0 1 1 411.4944-411.4432 411.904 411.904 0 0 1-411.4944 411.4432z m0-751.2064a339.7632 339.7632 0 1 0 339.8144 339.7632 340.1728 340.1728 0 0 0-339.8144-339.7632z" fill="#545863" p-id="17600"></path><path d="M661.1456 458.7008H342.3744a35.84 35.84 0 0 1 0-71.68h238.4384l-36.1984-40.2944a35.84 35.84 0 1 1 53.3504-47.872l89.856 100.096a35.84 35.84 0 0 1-26.6752 59.7504zM432.2304 693.2992a35.5328 35.5328 0 0 1-26.6752-11.9296l-89.856-100.096a35.84 35.84 0 0 1 26.6752-59.7504h318.7712a35.84 35.84 0 0 1 0 71.68H422.7072l36.1984 40.3456a35.84 35.84 0 0 1-26.6752 59.7504z"  p-id="17601"></path></svg>
                            兑换码
                        </div>
                        <input type="text">
                    </label>
                </div>
            </div>

            <div class="item">
                <div class="item-title">关于</div>
                <div class="option">
                    <label>
                        <div>
                            <svg t="1769522500641" class="option-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18620"><path d="M512 960A448 448 0 1 1 512 64a448 448 0 0 1 0 896zM512 153.6a358.4 358.4 0 1 0 0 716.8A358.4 358.4 0 0 0 512 153.6z m0 627.2a44.8 44.8 0 0 1-44.8-44.8V422.4a44.8 44.8 0 1 1 89.6 0v313.6a44.8 44.8 0 0 1-44.8 44.8z m0-448a44.8 44.8 0 1 1-0.064-89.536A44.8 44.8 0 0 1 512 332.8z" p-id="18621"></path></svg>
                            更多详情
                        </div> 
                        <a href="https://github.com/xiaoyao-xiaoyao/xiaoyao-xiaoyao.github.io">Github</a>
                    </label>
                </div>

                <button @click="save">保存</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: var(--light-main-bgc);
    color: var(--light-font-color) !important;
}

.setting-main {
    width: 95%;
    height: 95%;
    overflow-x: hidden;
    overflow-y: auto;
}   

.setting-main>.item {
    width: 100%;
    padding: 10px;
    margin-bottom: 50px;
    user-select: none;
}

.setting-main>.item>.item-title {
    font-size: 35px;
    font-weight: bold;
    padding: 0 20px;
    margin-bottom: 20px;
    color: var(--light-font-second-color);
}

.setting-main>.item>.option {
    display: flex;
    flex-direction: column;
    width: 1000px;
    padding: 10px 20px;
    font-size: 25px;
    border-radius: 20px;
    background-color: var(--light-item-bgc);
}

.setting-main>.item>.option>label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1000px;
    padding: 10px 0;
}

.setting-main>.item>.option>label>div {
    display: flex;
    align-items: center;
}

.setting-main>.item>.option>label>div>.option-icon {
    width: 40px;
    height: 40px;
    margin-right: 15px;
    fill: var(--light-font-second-color);
}

.setting-main>.item>.option>label>input[type="number"] {
    height: 40px;
    width: 150px;
    padding: 5px 10px;
    font-size: 25px;
    border-radius: 10px;
    border: 1px solid rgb(200, 200, 200);
}


.setting-main>.item>.option>label>input[type="text"] {
    height: 40px;
    width: 200px;
    padding: 5px 10px;
    font-size: 25px;
    border-radius: 10px;
    border: 1px solid rgb(200, 200, 200);
}

.setting-main>.item>.option>label>a {
    text-decoration: none;
    color: rgb(84, 117, 117);
}

.setting-main>.item>.option>label>a:hover {
    color: rgb(0, 0, 0);
}

input {
    background-color: var(--light-option-bgc);
    color: var(--light-font-color);
}


input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0; 
}

input[type="number"]:focus {
    outline: none;
}


input[type="text"]:focus {
    outline: none;
}
</style>