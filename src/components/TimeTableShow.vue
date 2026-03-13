<script setup lang="ts">
import Popup from './Popup.vue'
import { ref } from 'vue'

const prop = defineProps({
    htmlContent: String,
    name: String,
})

const emit = defineEmits(['close', 'delete'])

const isShowPopup = ref(false)
const handlePopupSure = () => {
    emit('delete', prop.name)
}
</script>

<template>
    <div class="time-class-show">
        <div class="time-class-head-show">
            <Popup
        width="500px"
        height="250px"
        title="永久删除该表格"
        v-model="isShowPopup"
        @sure="handlePopupSure"
        >
        <h1 class="popup-tip">删除后该表格不可恢复，确认删除吗？</h1>
        <template #close-text>
            取消
        </template>
        </Popup>

        <div class="top">
            <div class="return" @click="emit('close')">
                <svg t="1769431872810" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26120"><path d="M480 64C214.912 64 0 278.912 0 544c0 265.088 214.912 480 480 480 265.088 0 480-214.912 480-480 0-265.088-214.912-480-480-480z m85.12 649.024c12.48 12.48 12.48 32.768 0 45.248-6.272 6.272-14.464 9.344-22.656 9.344s-16.384-3.136-22.656-9.344L328.32 566.656c-12.48-12.48-12.48-32.768 0-45.248l192.768-192.832c12.48-12.48 32.768-12.48 45.248 0s12.48 32.768 0 45.248l-170.112 170.24 168.896 168.96z" p-id="26121"></path></svg>
            </div>

            <div class="next" @click="isShowPopup = true">
                <svg t="1769695779738" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24973"><path d="M798.1 872.6c0 34.3-27.9 62.2-62.1 62.2H288.1c-34.3-0.1-62.1-27.9-62.2-62.2V212.8h572.2v659.8zM350.2 101.2c0-7.2 5.6-12.8 12.8-12.8h298.8c7.2 0 12.7 5.6 12.7 12.8v37.5H350.2v-37.5z m634.3 37.5H748.7v-37.5c0-47.8-39-86.9-86.9-86.9H363c-47.9 0.1-86.8 38.9-86.9 86.9v37.5H39.5C18.7 138.7 2 155.4 2 176.1s16.7 37.5 37.5 37.5H151v659c0 75.7 61.4 137.1 137.1 137.1h447.8c75.7 0 137.1-61.4 137.1-137.1V212.8h111.6c20.7 0 37.5-16.7 37.5-37.5s-16.8-36.6-37.6-36.6zM512 822.4c20.7 0 37.5-16.7 37.5-37.5V386.5c0-20.7-16.7-37.5-37.5-37.5-20.7 0-37.5 16.7-37.5 37.5v398.4c0 20.7 16.8 37.5 37.5 37.5m-174.5 0c20.7 0 37.5-16.7 37.5-37.5V386.5c0-20.7-16.7-37.5-37.5-37.5-20.7 0-37.5 16.7-37.5 37.5v398.4c0.8 20.7 17.6 37.5 37.5 37.5m349 0c20.7 0 37.5-16.7 37.5-37.5V386.5c0-20.7-16.7-37.5-37.5-37.5-20.7 0-37.5 16.7-37.5 37.5v398.4c0.1 20.7 16.8 37.5 37.5 37.5" p-id="24974"></path></svg>
            </div>
        </div>

        <h1 class="title">
            {{prop.name}}
        </h1>
        </div>

        <div class="html-render-container">
            <div v-html="prop.htmlContent"></div>
        </div>
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.time-class-show {
    width: 100%;
    height: 100%;
    padding: 40px;
}

.time-class-head-show {
    height: 20%;
}

.popup-tip {
    font-size: 25px;
}


.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 50%;
    height: 60px;
    margin-bottom: 50px;
}

.top>div { 
    width: 50px;
    height: 100%;
}


.top svg {
    width: 100%;
    height: 100%;
    fill: var(--light-svg-main-fill);
}

.top svg:hover {
    fill: var(--light-svg-main-hover-fill);
    cursor: pointer;
}

.title {   
    width: calc(100% - 225);
    height: 80px;
    font-size: 40px;
    color: var(--light-font-color);
    margin-left: 225px;
}

.html-render-container {
    height: 80%;
    overflow-y: auto;
}
</style>