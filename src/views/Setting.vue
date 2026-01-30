<script setup lang="ts">
import Button from '../components/Button.vue'
import { useUiConfigStore  } from '../stores/uiConfigStore'
import { useSettingStore } from '../stores/settingStore'
import { storeToRefs } from 'pinia'
import { computed, ref, nextTick, onMounted } from 'vue'

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


const save = async () => {
    const uiMsg = window.electronAPI.setConfig('', writeUiConfig.value)
    const setMsg = window.electronAPI.setSetting('', writeSetting.value)

    const result = await Promise.all([uiMsg, setMsg])
    
    const msg = result[0] && result[1] ? '保存成功' : '保存失败'
    setResultPopup(msg, result[0] && result[1])

    initDate()
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
    document.documentElement.style.setProperty('--light-active-router-bgc', 'linear-gradient(90deg, #5f5f5f 10%, #5f5f5f 10%, rgba(0, 0, 0, 0) 10%)')
    document.documentElement.style.setProperty('--light-scrollbar-bgc', '#ebebeb')
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
    document.documentElement.style.setProperty('--light-active-router-bgc', 'linear-gradient(90deg, #f6f0ff 10%, #f6f0ff 10%, rgba(0, 0, 0, 0) 10%)')
    document.documentElement.style.setProperty('--light-scrollbar-bgc', '#1e1e2d')
}

const resultColor = ref(false)
const isShowResultPopup = ref(false)
const resultPopupContent = ref('')


const setResultPopup = async (content: string, color: boolean) => {
    isShowResultPopup.value = false

    resultPopupContent.value = content
    resultColor.value = color

    await nextTick()

    isShowResultPopup.value = true
    setTimeout(() => {
        isShowResultPopup.value = false
    }, 2500)
}



const handleSave = (e: KeyboardEvent) => {

    if (e.ctrlKey && (e.key === 's' || e.key === 's' || e.code === 'KeyS')) {
        e.preventDefault()
        e.stopPropagation()
        save()
    }
}

const initDate = async() => {
    const uiConfigStore = useUiConfigStore()
    const { getUIConfig } = storeToRefs(uiConfigStore)

    const settingStore = useSettingStore()
    const { settingContent } = storeToRefs(settingStore)

    await uiConfigStore.loadUiConfig('')
    await settingStore.loadSetting('')

    timeFontSize.value = getUIConfig.value?.mainConfig.time.fontSize
    timeFontColor.value = getUIConfig.value?.mainConfig.time.fontColor
    dataFontSize.value = getUIConfig.value?.mainConfig.date.fontSize
    dataFontColor.value = getUIConfig.value?.mainConfig.date.fontColor 
    dataContent.value = getUIConfig.value?.mainConfig.date.content

    autostart.value = settingContent.value.setting.autostart
    dark.value = settingContent.value.setting.dark
    showClock.value = settingContent.value.setting.showClock
}



onMounted(async () => {
    initDate()
    console.log(111)
})  
</script>


<template>
    <div class="container" tabindex="0" @keydown="handleSave($event)">
        <div :id="resultColor ? 'green' : 'red'"  class="popup-container" :class="{'tip' : isShowResultPopup}" v-if="isShowResultPopup">
            <div class="img"></div>
            <div class="content">{{ resultPopupContent }}</div>
        </div>

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
                        <input id="time-font-size" type="number" :disabled="!showClock" v-model="timeFontSize">
                    </label>

                    <label for="time-size-color">
                        <div>
                            <svg t="1769522055175" class="option-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10915"><path d="M512 85.333333c235.605333 0 426.666667 169.728 426.666667 379.264a237.141333 237.141333 0 0 1-237.056 237.013334h-83.882667c-39.338667 0-71.125333 31.786667-71.125333 71.125333 0 18.005333 7.125333 34.602667 18.005333 46.933333 11.392 12.8 18.517333 29.397333 18.517333 47.872C583.125333 906.922667 550.4 938.666667 512 938.666667 276.394667 938.666667 85.333333 747.605333 85.333333 512S276.394667 85.333333 512 85.333333z m-50.730667 687.402667a156.330667 156.330667 0 0 1 156.458667-156.458667h83.882667A151.808 151.808 0 0 0 853.333333 464.64C853.333333 304.597333 702.634667 170.666667 512 170.666667a341.333333 341.333333 0 0 0-28.842667 681.472 155.648 155.648 0 0 1-21.888-79.36zM320 512a64 64 0 1 1 0-128 64 64 0 0 1 0 128z m384 0a64 64 0 1 1 0-128 64 64 0 0 1 0 128zM512 384a64 64 0 1 1 0-128 64 64 0 0 1 0 128z"  p-id="10916"></path></svg>
                            时间字体颜色
                        </div>
                        <input id="time-size-color" type="color" :disabled="!showClock" v-model="timeFontColor">
                    </label>

                    <label for="custom-font-size">
                        <div>
                            <svg t="1769522238009" class="option-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13257"><path d="M24.380952 560.761905h97.52381v-58.514286h112.152381v438.857143h97.523809v-438.857143H438.857143v58.514286h97.523809V404.72381H24.380952z" p-id="13258"></path><path d="M273.066667 78.019048v175.542857h97.523809V175.542857H585.142857v770.438095h97.52381V175.542857h219.428571v82.895238h97.52381V78.019048z" p-id="13259"></path></svg>
                            自定义文本字体大小
                        </div>
                        <input id="custom-font-size" type="number" :disabled="!showClock" v-model="dataFontSize">
                    </label>

                    <label for="custom-font-color">
                        <div>
                            <svg t="1769601930619" class="option-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13455"><path d="M1020.787 654.461L834.256 158.37c-9.719-25.846-38.551-38.922-64.398-29.203L336.91 291.957c-31.268-9.151-64.464-8.121-98.739 3.092-32.541 10.645-64.667 30.07-95.487 57.737-60.845 54.618-111 136.45-141.226 230.422-5.1 15.855 3.619 32.843 19.474 37.942a30.143 30.143 0 0 0 9.241 1.457c12.746 0 24.589-8.146 28.701-20.931 43.169-134.211 131.064-235.336 210.672-252.851a49.788 49.788 0 0 0 3.099 20.713l186.532 496.09c9.719 25.849 38.551 38.923 64.398 29.204l468.01-175.974c25.847-9.717 38.922-38.548 29.202-64.397zM376.219 416.509c-9.719-25.848 3.356-54.68 29.204-64.398l317.464-119.368c25.848-9.719 54.68 3.356 64.398 29.204l45.152 120.083a24.336 24.336 0 0 1-1.918 1.761c-11.463 9.374-29.669 6.036-36.965 4.164-5.426-1.392-14.463-12.381-21.725-21.21-18.431-22.412-46.28-56.284-94.657-43.501-14.117 3.73-32.007 14.203-37.059 42.916-2.799 15.909-1.128 34.073 0.488 51.639 1.464 15.903 2.978 32.348 0.61 43.378-1.842 8.58-4.955 10.489-11.235 11.524-15.589 2.561-27.844-22.612-43.489-58.458-8.835-20.24-17.97-41.169-30.138-55.997-23.148-28.207-49.033-23.469-62.4-18.135-20.797 8.299-33.148 22.515-36.713 42.253-2.717 15.048 0.249 30.618 3.118 45.676 6.43 33.751 6.73 47.643-15.838 59.709-17.91 9.576-30.171 9.548-41.195 0.842l-27.102-72.082zM888.008 671.89L570.544 791.257c-25.848 9.719-54.68-3.355-64.398-29.203l-85.314-226.898c12.302-0.035 26.525-3.329 42.646-11.948 50.771-27.145 42.108-72.608 36.377-102.692-6.073-31.88-4.896-37.514 8.999-43.059 4.359-1.74 8.475-3.38 16.415 6.296 8.631 10.517 16.632 28.847 24.369 46.575 8.524 19.53 17.339 39.727 29.002 55.181 16.212 21.481 35.682 30.528 57.873 26.866 16.475-2.713 37.484-12.335 44.015-42.761 3.656-17.035 1.856-36.59 0.116-55.501-1.374-14.933-2.795-30.374-0.928-40.985 1.654-9.404 4.743-10.22 7.729-11.009 21.117-5.578 33.005 5.452 53.33 30.166 12.115 14.731 24.643 29.964 42.792 34.619 14.507 3.721 40.584 7.298 63.532-5.88l70.113 186.469c9.719 25.846-3.357 54.678-29.204 64.397z" p-id="13456"></path></svg>                     自定义文本字体颜色
                        </div>
                        <input id="custom-font-color" type="color" :disabled="!showClock" v-model="dataFontColor">
                    </label>

                    <label for="custom-font-content">
                        <div>
                           <svg t="1769602048255" class="option-icon" viewBox="0 0 1069 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18262" ><path d="M746.027944 190.083832q-11.241517 0-18.906188-7.664671t-12.774451-17.884232-7.664671-20.9501-2.55489-17.884232l0-125.700599 2.043912 0q9.197605 0 17.373253 2.043912t19.928144 9.708583 28.61477 21.461078 42.411178 36.279441q27.592814 24.526946 43.944112 41.389222t25.037924 28.61477 10.730539 19.928144 2.043912 14.307385l0 16.351297-150.227545 0zM1063.856287 671.42515q3.065868 8.175649 4.087824 20.439122t-10.219561 23.50499q-5.10978 5.10978-9.197605 9.708583t-7.153693 7.664671q-4.087824 4.087824-7.153693 6.131737l-86.866267-85.844311q6.131737-5.10978 13.796407-12.263473t12.774451-11.241517q12.263473-11.241517 26.570858-9.708583t23.50499 6.642715q10.219561 5.10978 21.972056 17.884232t17.884232 27.081836zM703.105788 766.467066q22.483034 0 37.812375-12.263473l-198.259481 206.43513-282.05988 0q-19.417166 0-42.411178-11.241517t-42.922156-29.636727-33.213573-42.411178-13.285429-49.56487l0-695.952096q0-21.461078 9.708583-44.966068t26.570858-42.411178 38.323353-31.680639 44.966068-12.774451l391.409182 0 0 127.744511q0 19.417166 6.131737 41.9002t18.906188 41.389222 33.213573 31.680639 49.053892 12.774451l149.205589 0 0 338.267465-140.007984 145.117764q11.241517-16.351297 11.241517-35.768463 0-26.570858-18.906188-45.477046t-45.477046-18.906188l-383.233533 0q-26.570858 0-44.966068 18.906188t-18.39521 45.477046 18.39521 44.966068 44.966068 18.39521l383.233533 0zM319.872255 383.233533q-26.570858 0-44.966068 18.906188t-18.39521 45.477046 18.39521 44.966068 44.966068 18.39521l383.233533 0q26.570858 0 45.477046-18.39521t18.906188-44.966068-18.906188-45.477046-45.477046-18.906188l-383.233533 0zM705.149701 895.233533l13.285429-13.285429 25.548902-25.548902q15.329341-15.329341 33.724551-34.235529t36.790419-37.301397q43.944112-43.944112 99.129741-98.107784l85.844311 85.844311-99.129741 99.129741-36.790419 36.790419-33.724551 33.724551q-14.307385 14.307385-24.015968 24.526946t-10.730539 11.241517q-5.10978 4.087824-11.241517 8.686627t-12.263473 7.664671-18.906188 7.664671-26.05988 8.686627-25.548902 7.153693-18.39521 4.087824q-12.263473 2.043912-16.351297-3.065868t-2.043912-17.373253q1.021956-6.131737 4.087824-18.39521t7.153693-25.037924 7.664671-24.015968 5.620758-15.329341q6.131737-13.285429 16.351297-23.50499z" p-id="18263"></path></svg>          自定义文本内容
                        </div>
                        <input id="custom-font-content" type="text" :disabled="!showClock" v-model="dataContent">
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
                           <svg t="1769602103757" class="option-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22125"><path d="M512 16.756364c273.352145 0 495.243636 221.891491 495.243636 495.243636 0 273.352145-221.891491 495.243636-495.243636 495.243636C238.647855 1007.243636 16.756364 785.352145 16.756364 512 16.756364 238.647855 238.647855 16.756364 512 16.756364z m0 79.760291C282.549527 96.516655 96.516655 282.8288 96.516655 512c0 228.854691 186.628655 415.483345 415.483345 415.483345S927.483345 740.854691 927.483345 512c0-229.1712-186.032873-415.483345-415.483345-415.483345zM734.561745 556.683636c18.990545 0 34.760145 19.586327 29.584291 43.994764l-0.726109 2.960291c-1.303273 7.707927-10.910255 19.958691-18.580945 27.424582l-97.056582 89.125236c-9.122909 8.229236-39.172655 11.803927-52.168145 0.781964-11.599127-10.4448-16.197818-32.209455-7.745164-43.324509l1.6384-1.861819 49.617454-45.4656h-362.123636c-14.671127 0-31.855709-13.665745-35.877236-28.113454l-0.558546-2.550691-0.279272-2.420364c-1.694255-16.849455 18.134109-38.558255 34.49949-40.420072l2.215564-0.130328h457.560436zM419.84 284.318255l2.792727 1.93629 2.345891 2.048c15.639273 14.596655 14.429091 35.746909 2.345891 49.282328l-1.880436 1.973527-50.753164 51.553745 355.458327-0.018618 1.563928-0.037236c8.973964-0.186182 14.336-0.018618 20.48 0.930909 19.902836 3.072 31.632291 13.814691 31.632291 35.523491 0 18.357527-9.141527 29.882182-24.333964 35.709673a64.9216 64.9216 0 0 1-22.825891 4.133236l-3.202327-0.093091-463.499637-0.055854c-25.711709-5.864727-33.866473-27.089455-28.318254-48.556219 1.899055-7.968582 10.612364-19.362909 18.692654-27.703854l2.6624-2.6624 94.673455-92.625455c18.096873-17.538327 40.866909-25.171782 62.184727-11.338472z"  p-id="22126"></path></svg>                            
                           开发者
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
                        <a href="javascript:void(0)" class="a">https://github.com/Hello-1660/water</a>
                    </label>
                </div>
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

.a {
    user-select: auto;
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

.container:focus {
  outline: none;
}

.container>.popup-container {
    position: fixed;
    left: 50%;
    bottom: 20%;
    z-index: 10000;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    border-radius: 8px;
    height: 60px;
    background-color: rgb(251, 246, 246);
    padding: 5px;
    opacity: 0;
    user-select: none;
}

.tip {
    animation: up 2.5s ease;
}

@keyframes up {
    0% {
        opacity: 1;
        transform: translateX(-50%) translateY(0%);
    }

    100% {
        opacity: 0;
        transform: translateX(-50%) translateY(-400%);
    }
}

#red {
    background-color: rgb(255, 141, 131);
}

#green {
    background-color: rgb(152, 243, 207);
}


.container>.popup-container>.img {
    width: 45px;
    height: 45px;
    background-image: url(../../public/water.jpg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 15px;
    margin-left: 5px;
}

.container>.popup-container>.content {
    margin: 0 10px 0 20px;
    font-size: 24px;
    color: white;
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
    cursor: pointer;
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
    border: 1px solid rgb(200, 200,     200);
}

.setting-main>.item>.option>label>a {
    text-decoration: none;
    color: var(--light-svg-main-fill);
}

.setting-main>.item>.option>label>a:hover {
    color: var(--light-svg-main-hover-fill);
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