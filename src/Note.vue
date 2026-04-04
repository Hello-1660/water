<script setup lang="ts">
import Top from './components/Top.vue'
import TimingFloatPanel from './components/TimingFloatPanel.vue'
import UpdatePrompt from './components/UpdatePrompt.vue'
import { useSettingStore } from './stores/settingStore'
import { useUiConfigStore } from './stores/uiConfigStore'
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

const uiConfigStore = useUiConfigStore()
const settingStore = useSettingStore()


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
    document.documentElement.style.setProperty('--light-caret-color', '#d7d6df')
}

onMounted(async () => {
    await uiConfigStore.loadUiConfig('')
    await settingStore.loadSetting('')

    const { settingContent } = storeToRefs(settingStore)

    if (settingContent.value.setting.dark) {
        change2NightTheme()
    }
})  

const route = useRoute()

const routeNameToNav: Record<string, string> = {
    Todo: 'todo',
    StickyNote: 'stickyNote',
    Timing: 'timing',
    TimeTable: 'timeTable',
    Setting: 'setting',
}

const currentRouter = computed(() => {
    const name = route.name
    if (typeof name === 'string' && routeNameToNav[name]) {
        return routeNameToNav[name]
    }
    return 'todo'
})
</script>

<template>
    <div class="container">
        <Top />
        <div class="main">
            <div class="option">
                <router-link to="/todo" class="nav-link" :class="{ 'active' : currentRouter === 'todo' }">
                    <svg  t="1769091621907" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                        p-id="26286">
                        <path
                            d="M806.912 0H217.088C131.072 0 63.488 69.632 63.488 155.648v782.336c0 30.72 16.384 59.392 43.008 75.776 12.288 6.144 26.624 10.24 40.96 10.24 16.384 0 30.72-4.096 45.056-12.288l307.2-194.56c4.096-2.048 8.192-4.096 12.288-4.096 4.096 0 8.192 2.048 10.24 4.096l307.2 194.56c14.336 8.192 28.672 12.288 45.056 12.288 14.336 0 28.672-4.096 40.96-10.24 26.624-16.384 43.008-45.056 43.008-75.776V155.648c2.048-86.016-65.536-153.6-151.552-155.648z m67.584 956.416c-4.096 0-8.192-2.048-10.24-4.096l-307.2-194.56c-14.336-8.192-28.672-12.288-45.056-12.288-16.384 0-30.72 4.096-45.056 12.288L161.792 952.32c-4.096 2.048-6.144 4.096-10.24 4.096-6.144 0-10.24-2.048-14.336-6.144-4.096-4.096-6.144-8.192-6.144-14.336V155.648c0-47.104 38.912-86.016 86.016-88.064h589.824c47.104 0 86.016 38.912 86.016 88.064v780.288c0 10.24-8.192 18.432-18.432 20.48z"
                            p-id="26287"></path>
                        <path
                            d="M667.648 262.144H356.352c-18.432 0-32.768 14.336-32.768 32.768 0 18.432 14.336 32.768 32.768 32.768h311.296c18.432 0 32.768-14.336 32.768-32.768 0-16.384-14.336-30.72-32.768-32.768z"
                            p-id="26288"></path>
                    </svg>
                    <div class="link">便签</div>
                </router-link>

                <router-link to="/stickyNote" class="nav-link" :class="{ 'active' : currentRouter === 'stickyNote' }">
                    <svg t="1769091801240" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                        p-id="33274">
                        <path
                            d="M806.925117 0H217.074883c-85.438307 0-154.960655 69.51235-154.960654 154.960655V868.889384c0 85.448304 69.522348 154.960655 154.960654 154.960654h98.884893q1.559604 0.149962 3.1492 0.149962c1.069728 0 2.119462 0 3.159198-0.149962H806.925117c85.438307 0 154.960655-69.51235 154.960654-154.960654V154.960655c0-85.448304-69.522348-154.960655-154.960654-154.960655z m-260.833773 69.982231h185.952785v228.432l-77.300373-38.810146a34.991116 34.991116 0 0 0-31.352039 0l-77.35036 38.690176zM132.09646 868.889384V154.960655a85.078398 85.078398 0 0 1 84.978423-84.978424h67.042978V953.867807H217.074883a85.078398 85.078398 0 0 1-84.978423-84.978423z m759.80708 0a85.078398 85.078398 0 0 1-84.978423 84.978423H354.100092V69.982231h121.969031v284.927655a34.991116 34.991116 0 0 0 50.64714 31.302052L639.067737 330.026204l112.321481 56.385684a34.991116 34.991116 0 0 0 50.68713-31.27206V69.982231H806.925117a85.078398 85.078398 0 0 1 84.978423 84.978424z"
                            p-id="33275"></path>
                    </svg>
                    <div class="link">笔记</div>
                </router-link>

                <router-link to="/timing" class="nav-link" :class="{ 'active' : currentRouter === 'timing' }">
                    <svg  t="1769091968129" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                        p-id="34643">
                        <path
                            d="M521.142857 576h242.285714a36.571429 36.571429 0 0 1 0 73.142857H484.571429a36.571429 36.571429 0 0 1-36.278858-41.142857 36.937143 36.937143 0 0 1-0.292571-4.571429V228.571429a36.571429 36.571429 0 0 1 73.142857 0v347.428571zM512 1024C229.229714 1024 0 794.770286 0 512S229.229714 0 512 0s512 229.229714 512 512-229.229714 512-512 512z m0-73.142857c242.358857 0 438.857143-196.498286 438.857143-438.857143S754.358857 73.142857 512 73.142857 73.142857 269.641143 73.142857 512s196.498286 438.857143 438.857143 438.857143z"
                            p-id="34644"></path>
                    </svg>
                    <div class="link">计时</div>
                </router-link>

                <router-link to="/timeTable" class="nav-link" :class="{ 'active' : currentRouter === 'timeTable' }">
                    <svg t="1769683885393"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7555"><path d="M873.658182 50.688h-73.355637a35.328 35.328 0 0 0 0 70.609455h73.309091c18.013091 0 32.674909 14.661818 32.674909 32.674909v123.345454H117.76v-123.345454c0-18.013091 14.661818-32.674909 32.674909-32.674909h73.262546a35.328 35.328 0 0 0 0-70.609455H150.481455c-56.971636 0-103.330909 46.312727-103.33091 103.330909v730.624c0 56.925091 46.359273 103.237818 103.33091 103.237818h723.130181c56.971636 0 103.330909-46.312727 103.330909-103.237818V153.972364c0-56.971636-46.359273-103.284364-103.330909-103.284364z m0 866.583273H150.434909a32.674909 32.674909 0 0 1-32.674909-32.628364V347.927273h788.48v536.669091a32.674909 32.674909 0 0 1-32.674909 32.674909z m-437.806546-795.927273h152.855273a35.328 35.328 0 0 0 0-70.656H435.851636a35.328 35.328 0 0 0 0 70.609455zM330.007273 171.333818c19.502545 0 35.281455-19.130182 35.281454-42.682182V43.287273c0-23.598545-15.825455-42.682182-35.281454-42.682182-19.549091 0-35.374545 19.083636-35.374546 42.682182v85.364363c0 23.552 15.825455 42.682182 35.374546 42.682182z m364.683636 0c19.502545 0 35.281455-19.130182 35.281455-42.682182V43.287273c0-23.598545-15.825455-42.682182-35.281455-42.682182-19.549091 0-35.328 19.083636-35.328 42.682182v85.364363c0 23.552 15.825455 42.682182 35.328 42.682182z m64.605091 312.599273H264.843636a35.328 35.328 0 1 0 0 70.656h494.405819a35.328 35.328 0 0 0 0-70.656z m0 214.109091H264.843636a35.328 35.328 0 1 0 0 70.609454h494.405819a35.328 35.328 0 0 0 0-70.609454z" p-id="7556"></path></svg>
                    <div class="link">课表</div>
                </router-link>

                <router-link to="/setting" id="setting" class="nav-link" :class="{ 'active' : currentRouter === 'setting' }">
                    <svg t="1769092206653" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                        p-id="38767">
                        <path
                            d="M85.717333 463.061333A7.850667 7.850667 0 0 0 85.333333 465.493333v93.098667c0 0.853333 0.128 1.621333 0.384 2.389333l94.464 13.610667 17.194667 48.64c3.925333 11.093333 8.448 21.973333 13.525333 32.597333l22.272 46.592-57.173333 76.458667c0.341333 0.725333 0.810667 1.365333 1.408 1.962667L243.2 846.592a7.850667 7.850667 0 0 0 1.962667 1.450667l76.458666-57.216 46.592 22.272c10.624 5.12 21.504 9.6 32.597334 13.525333l48.64 17.194667 13.653333 94.464a7.850667 7.850667 0 0 0 2.346667 0.384h93.098666c0.853333 0 1.621333-0.128 2.389334-0.384l13.610666-94.464 48.64-17.194667c11.093333-3.925333 21.973333-8.448 32.597334-13.525333l46.592-22.272 76.458666 57.173333a7.850667 7.850667 0 0 0 1.962667-1.408l65.792-65.792a7.850667 7.850667 0 0 0 1.450667-1.962667l-57.216-76.458666 22.272-46.592c5.12-10.624 9.6-21.504 13.525333-32.597334l17.194667-48.64 94.464-13.653333a7.850667 7.850667 0 0 0 0.384-2.346667v-93.098666a7.850667 7.850667 0 0 0-0.384-2.389334l-94.464-13.610666-17.194667-48.64a330.922667 330.922667 0 0 0-13.525333-32.597334l-22.272-46.592 57.173333-76.458666a7.850667 7.850667 0 0 0-1.408-1.962667L780.8 177.408a7.850667 7.850667 0 0 0-1.962667-1.450667l-76.458666 57.216-46.592-22.272a330.922667 330.922667 0 0 0-32.597334-13.525333l-48.64-17.194667-13.653333-94.464A7.850667 7.850667 0 0 0 558.592 85.333333h-93.098667a7.850667 7.850667 0 0 0-2.389333 0.384l-13.610667 94.464-48.64 17.194667c-11.093333 3.925333-21.973333 8.448-32.597333 13.525333l-46.592 22.272-76.458667-57.173333a7.850667 7.850667 0 0 0-1.962666 1.408L177.408 243.2a7.850667 7.850667 0 0 0-1.450667 1.962667l57.216 76.458666-22.272 46.592a330.922667 330.922667 0 0 0-13.525333 32.597334l-17.194667 48.64-94.464 13.653333z m9.216-183.808a93.098667 93.098667 0 0 1 22.101334-96.384l65.834666-65.834666a93.098667 93.098667 0 0 1 96.426667-22.101334l52.096 38.997334c13.269333-6.4 26.965333-12.032 40.96-17.024l9.301333-64.426667A93.098667 93.098667 0 0 1 465.450667 0h93.098666c36.864 0 68.693333 21.418667 83.797334 52.48l9.301333 64.426667c13.994667 4.992 27.690667 10.666667 40.96 17.024l52.138667-38.997334a93.098667 93.098667 0 0 1 96.384 22.101334l65.834666 65.834666c26.026667 26.069333 33.450667 63.744 22.101334 96.426667l-38.997334 52.096c6.4 13.269333 12.032 26.965333 17.024 40.96l64.426667 9.301333c31.061333 15.061333 52.48 46.933333 52.48 83.797334v93.098666c0 36.864-21.418667 68.693333-52.48 83.797334l-64.426667 9.301333c-4.992 13.994667-10.666667 27.690667-17.024 40.96l38.997334 52.138667a93.098667 93.098667 0 0 1-22.101334 96.384l-65.834666 65.834666a93.098667 93.098667 0 0 1-96.426667 22.101334l-52.096-38.997334a416.256 416.256 0 0 1-40.96 17.024l-9.301333 64.426667A93.098667 93.098667 0 0 1 558.549333 1024h-93.098666c-36.864 0-68.693333-21.418667-83.797334-52.48l-9.301333-64.426667a416.256 416.256 0 0 1-40.96-17.024l-52.138667 38.997334a93.098667 93.098667 0 0 1-96.384-22.101334l-65.834666-65.834666a93.098667 93.098667 0 0 1-22.101334-96.426667l38.997334-52.096a416.256 416.256 0 0 1-17.024-40.96l-64.426667-9.301333A93.098667 93.098667 0 0 1 0 558.549333v-93.098666c0-36.864 21.418667-68.693333 52.48-83.797334l64.426667-9.301333c4.992-13.994667 10.666667-27.690667 17.024-40.96l-38.997334-52.138667zM512 640a128 128 0 1 0 0-256 128 128 0 0 0 0 256z m0 85.333333a213.333333 213.333333 0 1 1 0-426.666666 213.333333 213.333333 0 0 1 0 426.666666z"
                            p-id="38768"></path>
                    </svg>
                    <div class="link">设置</div>
                </router-link>
            </div>
            <div class="show">
                <router-view v-slot="{ Component }">
                    <!-- 缓存页面 -->
                    <keep-alive include="StickyNote,Todo,Timing">
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
            </div>
        </div>
        <TimingFloatPanel />
        <UpdatePrompt />
    </div>
</template>

<style>
:root {
    --light-main-bgc: #f9f9f9;
    --light-second-bgc: #f2f2f2;
    --light-item-bgc: #f5f5f5;
    --light-svg-fill: #999999;
    --light-svg-hover-fill: #484848;
    --light-svg-main-fill: #aaaaaa;
    --light-svg-main-hover-fill: #3d3d3d;
    --light-font-color: #262626;
    --light-font-second-color: #626262;
    --light-option-bgc: #f9f9f9;
    --light-option-second-bgc: #f2f2f2;
    --light-todo-bgc: #dbe4e6;
    --light-todo-editor-bgc: #f9f9f9;
    --light-active-router-bgc: linear-gradient(90deg, #5f5f5f 10%, #5f5f5f 10%, rgba(0, 0, 0, 0) 10%);
    --light-scrollbar-bgc: #ebebeb;
    --light-caret-color: #3d4a6b;
}


::-webkit-scrollbar {
    width: 10px;
    border-radius: 20px;
    background-color: transparent;
}


::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 20px;
}

::-webkit-scrollbar-thumb {
    background: var(--light-scrollbar-bgc);
    border-radius: 20px;
}

a:focus {
    outline: none;
}

.container {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    padding: 0;
    width: 100%;
    height: 100%;
    max-height: 100%;
    background-color: var(--light-main-bgc);
}

.main {
    display: flex;
    justify-content: start;
    align-items: start;
    height: calc(100% - 40px);
    box-sizing: border-box;
}

.main>.option {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    width: 80px;
    height: 100%;
    background-color: var(--light-second-bgc);
    user-select: none;
}

.main>.option .active {
    background: var(--light-active-router-bgc);
}


.main>.option>.nav-link {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
    text-decoration: none;
}

.main>.option>#setting {
    position: absolute;
    bottom: 0;
    left: 0;
}

.main>.option>.nav-link:hover svg {
    fill: var(--light-svg-hover-fill);
}

.main>.option>.nav-link:hover .link {
    color: var(--light-svg-hover-fill);
}

.main>.option>.nav-link>svg {
    width: 35px;
    height: 35px;
    margin-bottom: 5px;
    fill:  var(--light-svg-fill);
}

.main>.option>.nav-link>.link {
    font-size: 20px;
    color: var(--light-svg-fill);
}

.main>.show {
    width: calc(100% - 80px);
    height: 100%;
}
</style>
