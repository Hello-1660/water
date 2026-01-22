<script setup lang="ts">
import { ref, Ref } from 'vue'

const isMaximize: Ref<boolean> = ref(false)

const closeWindow = (): void => {
    window.electronAPI.closeNoteWindow()
}

const minWindow = (): void => {
    window.electronAPI.minNoteWindow()
}

const maxWindow = (): void => { 
    if (isMaximize.value) return 

    window.electronAPI.maxNoteWindow()
    isMaximize.value = true
}

const restoreWindow = (): void => { 
    if (!isMaximize.value) return

    window.electronAPI.restoreNoteWindow()
    isMaximize.value = false
}


</script>
	

<template>
    <div class="top">
        <div>
            <div class="title">
                <img src="../../public/tip.png" alt="">
                <span>待办事项</span>
            </div>
        </div>

        <div>
            <svg @click="minWindow" t="1768828683714" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4788"><path d="M923 571H130.7c-27.6 0-50-22.4-50-50s22.4-50 50-50H923c27.6 0 50 22.4 50 50s-22.4 50-50 50z"p-id="4789"></path></svg>
            <svg v-show="!isMaximize" @click="maxWindow" t="1768829373412" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7577"><path d="M896.212978 0h-234.276206a42.595674 42.595674 0 0 0 0 85.191348h234.276206a42.595674 42.595674 0 0 1 42.595674 42.595674v234.276206a42.595674 42.595674 0 0 0 85.191348 0v-234.276206a127.787022 127.787022 0 0 0-127.787022-127.787022zM362.063228 0H129.490849a127.787022 127.787022 0 0 0-127.787022 127.787022v234.276206a42.595674 42.595674 0 0 0 85.191348 0v-234.276206a42.595674 42.595674 0 0 1 42.595674-42.595674h234.276206a42.595674 42.595674 0 0 0 0-85.191348zM362.063228 937.104825H129.490849a42.595674 42.595674 0 0 1-42.595674-42.595674v-234.276206a42.595674 42.595674 0 0 0-85.191348 0v234.276206a127.787022 127.787022 0 0 0 127.787022 127.787022h234.276206a42.595674 42.595674 0 1 0 0-85.191348zM981.404326 619.341098a42.595674 42.595674 0 0 0-42.595674 42.595674v232.572379a42.595674 42.595674 0 0 1-42.595674 42.595674h-234.276206a42.595674 42.595674 0 0 0 0 85.191348h234.276206a127.787022 127.787022 0 0 0 127.787022-127.787022v-234.276206a42.595674 42.595674 0 0 0-42.595674-40.891847z" p-id="7578"></path></svg>
            <svg v-show="isMaximize" @click="restoreWindow" t="1768830674046" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9532"><path d="M332.4 64H97.8C79.1 64 64 79.1 64 97.8v236.7c0 9.3 7.6 16.9 16.9 16.9h50.7c9.3 0 16.9-7.6 16.9-16.9v-186h183.8c9.3 0 16.9-7.6 16.9-16.9V80.9c0.1-9.3-7.5-16.9-16.8-16.9z m610.7 608.6h-50.7c-9.3 0-16.9 7.6-16.9 16.9v186H691.6c-9.3 0-16.9 7.6-16.9 16.9v50.7c0 9.3 7.6 16.9 16.9 16.9h234.6c18.7 0 33.8-15.1 33.8-33.8V689.5c0-9.3-7.6-16.9-16.9-16.9zM332.4 875.5H148.5v-186c0-9.3-7.6-16.9-16.9-16.9H80.9c-9.3 0-16.9 7.6-16.9 16.9v236.7c0 18.7 15.1 33.8 33.8 33.8h234.6c9.3 0 16.9-7.6 16.9-16.9v-50.7c0-9.3-7.6-16.9-16.9-16.9zM926.2 64H691.6c-9.3 0-16.9 7.6-16.9 16.9v50.7c0 9.3 7.6 16.9 16.9 16.9h183.8v186c0 9.3 7.6 16.9 16.9 16.9H943c9.3 0 16.9-7.6 16.9-16.9V97.8c0.1-18.7-15-33.8-33.7-33.8z" p-id="9533"></path><path d="M782.5 782.5h-541v-541h541v541z m-459.8-81.1h378.7V322.7H322.7v378.7z" p-id="9534"></path></svg>
            <svg @click="closeWindow" id="close" t="1768827697152" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2640"><path d="M561.17013333 509.06026667L858.02666667 213.73973333c14.03733333-13.968 14.1088-36.60053333 0.1408-50.63786666-13.99893333-14.06826667-36.592-14.10773333-50.62933334-0.1408L510.6048 458.31466667 216.256 163.06986667c-13.9328-13.96693333-36.59733333-14.03733333-50.63466667-0.07146667-14.00426667 13.96586667-14.03733333 36.63146667-0.0704 50.6688l294.27733334 295.1744-296.71466667 295.14026667c-14.0384 13.968-14.1088 36.59733333-0.14293333 50.63786666a35.7216 35.7216 0 0 0 25.3856 10.56c9.13066667 0 18.26666667-3.4688 25.25013333-10.4192l296.78613333-295.2128L807.4304 857.48266667c6.9824 7.02186667 16.15253333 10.53013333 25.35253333 10.53013333a35.72906667 35.72906667 0 0 0 25.28213334-10.45973333c13.99893333-13.96586667 14.03733333-36.592 0.07146666-50.62933334L561.17013333 509.06026667z m0 0" p-id="2641"></path></svg> 
        </div>
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(235, 234, 234);
    user-select: none;
    -webkit-app-region: drag;   
    min-height: 0;
}


.title {
    padding: 10px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

img {
    width: 20px;
    height: 20px;
}

.icon {
    width: 20px;
    height: 20px;
    padding: 10px 20px;
    fill: rgb(112, 112, 112);
    -webkit-app-region: no-drag
}

.icon:hover {
    background-color: rgb(219, 219, 219);
    fill: black;
}

#close:hover {
    background-color: rgb(255, 0, 0);
}
</style>
