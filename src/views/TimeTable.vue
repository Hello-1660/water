<script setup lang="ts">
import TimeClassShow from '../components/TimeClassShow.vue'
import TimeTableShow from '../components/TimeTableShow.vue'

import { ref, computed, onMounted } from 'vue'


const TIMETABLE_DIR = 'timeTable'
const TIMETABLE_FILE_TABLE = 'html'




const saveTable = (name: string, content: string) => {
    window.electronAPI.saveFile(name, TIMETABLE_FILE_TABLE, content, TIMETABLE_DIR).then(
        data => console.log('saveTable', data)
    )
}


const delTable = (name: string) => {
    window.electronAPI.deleteFile(name + '.' + TIMETABLE_FILE_TABLE, TIMETABLE_DIR).then(
        data => console.log('delTable', data)
    )
}


const isShow = ref(0)

const itemTitle = ref<string>('')
const itemTimeNum = ref<number>(0)
const itemTimeName = ref<string>('')
const itemTimeValue = ref<string[][]>([])
const itemBeginTime = ref<string>('')
const itemEndTime = ref<string>('')
const itemTimeAdd = (name: string, beginTime: string, endTime: string) => {
    if (!(name && beginTime && endTime)) return

    itemTimeValue.value.push([name, beginTime, endTime])
}
const itemWeekValue = ref<string[]>([])
const itemContentValue = ref<string[]>([])
const itemContent = ref<string>('')
const itemContentAdd = () => {
    if (!itemContentValue.value) return
    if (!itemContent.value) return

    itemContentValue.value.push(itemContent.value); 
    itemContent.value = ''
}


const cleanData = () => {
    itemTitle.value = ''
    itemTimeNum.value = 0
    itemTimeName.value = ''
    itemTimeValue.value = []
    itemBeginTime.value = ''
    itemEndTime.value = ''
    itemWeekValue.value = []
    itemContentValue.value = []
    itemContent.value = ''
}

const add = () => {
    cleanData()
    isShow.value = 1
}

const ret = () => {
    cleanData()
    isShow.value = 0
}

const next = () => {
    if (itemTitle.value === '') return
    if (itemTimeValue.value.length === 0) return
    if (itemWeekValue.value.length === 0) return
    if (itemContentValue.value.length === 0) return

    isShow.value = 2
}


const itemAdd = computed(() => {
    return {
        name: itemTitle.value,
        timeItem: itemTimeValue.value,
        date: itemWeekValue.value,
        item: itemContentValue.value,
    }
})

const handleSave = (data: any) => {
    saveTable(itemAdd.value.name, data.outerHTML)
    getTableList(() => isShow.value = 0)
}

const handleCancel = () => {
    isShow.value = 0
}






const nameList = ref()
const htmlContent = ref<string>('')

const list = computed(() => { 
    return nameList.value
})

const getTableList = async (fun: Function = () => {}) => {
    nameList.value = []
    window.electronAPI.openAllFiles(TIMETABLE_DIR).then(
        data => {
            nameList.value = data
            fun()
        }
    )
}


const currentTable = ref<string>('')

const openTable = (name: string) => {
    currentTable.value = name
    window.electronAPI.openFile(name + '.' + 'html', TIMETABLE_DIR).then(
        data => {
            htmlContent.value = data
            isShow.value = 3
        }
    )
}

const handleClose = () => {
    isShow.value = 0
}


const handleDel = (data: string) => {
    delTable(data)
    getTableList()

    setTimeout(() => {
        isShow.value = 0
    }, 200)
}

const handleSaveView = (payload: { name: string; html: string }) => {
    saveTable(payload.name, payload.html)
    htmlContent.value = payload.html
}

onMounted(() => {
    getTableList()
})
</script>

<template>
    <div class="container">
        <div v-if="isShow === 0" class="show-table-list">
            <ul>
                <li class="add" @click="add">
                    <svg t="1769686661854" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17314"><path d="M722.944 544.768h-178.176v178.176c0 17.92-14.336 32.256-32.256 32.256s-32.256-14.336-32.256-32.256v-178.176h-179.2c-17.92 0-32.256-14.336-32.256-32.256s14.336-32.256 32.256-32.256h178.176V301.568c0-17.92 14.336-32.256 32.256-32.256s32.256 14.336 32.256 32.256v178.176H721.92c17.92 0 32.256 14.336 32.256 32.256 1.024 17.92-13.824 32.768-31.232 32.768zM336.896 64c-3.584 0-7.68 0.512-11.264 2.048-7.168 3.072-14.848 6.144-22.016 9.728-0.512 0-0.512 0-1.024 0.512-7.68 3.584-15.872 7.68-23.552 11.776-14.336 7.68-19.456 25.6-11.776 39.424 5.12 9.728 15.36 15.36 25.6 15.36 4.608 0 9.728-1.024 13.824-3.584 13.824-7.68 28.16-14.336 42.496-20.48 14.848-6.144 22.016-23.04 15.872-37.888-5.632-10.24-16.896-16.896-28.16-16.896zM189.44 161.792c-7.168 0-14.848 2.56-20.48 8.192-12.8 12.288-24.576 25.6-35.84 39.424-10.24 12.288-8.192 30.72 4.096 40.96 5.632 4.608 11.776 6.656 18.432 6.656 8.704 0 16.896-3.584 22.528-10.752 9.728-12.288 20.48-24.064 31.744-34.816 11.264-11.264 11.776-29.696 0-41.472-5.632-5.12-13.312-8.192-20.48-8.192zM89.6 308.224c-11.264 0-22.016 6.656-26.624 17.92-4.096 9.216-7.68 18.432-10.752 28.16 0 0.512-0.512 1.024-0.512 1.024v0.512c-2.048 6.144-4.096 12.8-6.144 18.944-4.608 15.36 4.096 31.744 19.456 36.352 2.56 1.024 5.632 1.024 8.192 1.024 12.8 0 24.064-8.192 28.16-20.992 4.608-14.848 9.728-29.696 15.872-44.032 6.144-14.848-0.512-31.744-15.36-38.4-4.608 0.512-8.192-0.512-12.288-0.512z m-35.84 173.568c-15.872 0-29.184 12.8-29.184 28.672v10.24c0 8.704 0.512 17.408 1.536 26.112 0 2.048 0.512 4.096 0.512 6.144 1.536 14.848 14.336 26.112 29.184 26.112h3.072c15.872-1.536 27.648-15.872 26.112-31.744-1.536-13.824-2.048-28.16-2.048-42.496v-4.608c0-5.12-12.8-17.92-29.184-18.432z m32.256 174.592c-3.584 0-7.168 0.512-10.752 2.048-14.848 6.144-22.528 23.04-16.384 37.888 6.144 15.36 12.8 30.208 20.48 44.544 0.512 0.512 1.024 1.536 1.024 2.048 5.12 9.728 15.36 15.36 25.6 15.36 4.608 0 9.216-1.024 13.824-3.584 14.336-7.68 19.456-25.088 11.776-39.424-7.168-13.824-13.824-28.16-19.968-42.496-3.072-9.728-14.336-16.384-25.6-16.384z m96.256 148.48c-7.168 0-14.848 2.56-20.48 8.192-11.776 11.264-11.776 29.696-0.512 41.472 5.12 5.12 10.24 10.24 15.872 15.36l0.512 0.512c6.656 6.144 13.312 12.288 20.48 17.92 5.632 4.608 11.776 6.656 18.432 6.656 8.192 0 16.896-3.584 22.528-10.752 10.24-12.288 8.704-30.72-3.584-40.96s-23.552-20.992-34.304-32.256c-3.584-3.072-11.264-6.144-18.944-6.144zM327.68 906.24c-11.264 0-22.016 6.656-26.624 17.408-6.656 14.848 0 31.744 14.848 38.4 16.384 7.168 33.28 13.312 50.176 18.944 3.072 1.024 5.632 1.536 8.704 1.536 12.288 0 24.064-8.192 27.648-20.48 4.608-15.36-3.584-31.744-18.944-36.352-14.848-4.608-29.696-10.24-44.032-16.384-4.096-2.56-7.68-3.072-11.776-3.072z m223.232 36.352h-2.56c-12.288 1.024-25.088 1.536-37.888 1.536h-9.216-0.512c-15.872 0-28.672 12.8-29.184 28.672-0.512 15.872 12.288 29.696 28.672 29.696H523.264c9.216-0.512 18.432-1.024 27.136-1.536 15.872-1.536 27.648-15.36 26.624-31.744 1.536-15.36-11.264-26.624-26.112-26.624z m169.984-49.664c-4.608 0-9.216 1.024-13.312 3.072-13.824 7.168-28.16 13.824-43.008 19.456-14.848 5.632-22.528 22.528-16.896 37.888 4.608 11.776 15.36 18.432 27.136 18.432 3.584 0 7.168-0.512 10.752-2.048 3.072-1.024 6.656-2.56 9.728-4.096h1.024c0.512 0 0.512 0 1.024-0.512 5.12-2.048 10.752-4.608 15.872-7.168 0.512 0 1.024-0.512 1.536-0.512 0.512 0 0.512 0 1.024-0.512h1.024s0.512 0 0.512-0.512l9.216-4.608c14.336-7.68 19.968-25.088 12.288-39.424 3.072-13.824-7.168-19.456-17.92-19.456z m138.752-110.592c-8.192 0-16.384 3.584-22.528 10.24-10.24 11.776-20.992 23.552-32.256 34.304-11.776 11.264-12.288 29.696-1.024 41.472 5.632 6.144 13.312 9.216 20.992 9.216 7.168 0 14.336-2.56 19.968-7.68 12.8-12.288 25.088-25.088 36.864-38.912 10.24-12.288 8.704-30.72-3.584-40.96-5.12-5.12-11.776-7.68-18.432-7.68z m86.016-154.624c-12.288 0-23.552 7.68-27.648 19.968-4.608 14.848-10.24 29.696-16.896 44.032-6.656 14.848 0 31.744 14.848 38.4 4.096 1.536 8.192 2.56 11.776 2.56 11.264 0 21.504-6.144 26.624-17.408 3.584-7.68 6.656-15.872 10.24-24.064 0-0.512 0-0.512 0.512-1.024 0-0.512 0-0.512 0.512-1.024v-0.512-0.512-0.512-0.512c0-0.512 0-0.512 0.512-1.024l4.608-13.824c5.12-15.36-3.584-31.744-18.944-36.864 0-7.168-3.072-7.68-6.144-7.68z m20.992-176.128h-2.048c-15.872 1.024-28.16 15.36-27.136 31.232 1.024 10.752 1.024 22.016 1.024 32.768v14.336c-0.512 15.872 12.288 29.696 28.16 30.208h1.024c15.872 0 28.672-12.288 29.184-28.16v-5.632-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512c0-7.68-0.512-14.848-1.024-22.016v-0.512-0.512c-1.024-33.28-13.824-45.056-29.184-45.056z m-47.616-170.496c-4.608 0-8.704 1.024-13.312 3.072-14.336 7.168-19.968 24.576-12.8 39.424 7.168 13.824 13.312 28.672 18.944 43.008 4.608 11.776 15.36 18.944 27.136 18.944 3.584 0 6.656-0.512 10.24-2.048 14.848-5.632 22.528-22.528 17.408-37.376-6.144-16.896-13.312-33.28-21.504-49.152-5.12-10.24-15.36-15.872-26.112-15.872z m-109.056-139.776c-8.192 0-16.384 3.584-22.016 10.24-10.752 12.288-9.216 30.72 3.072 40.96 11.776 10.24 23.04 21.504 33.792 32.768 5.632 6.144 13.824 9.216 21.504 9.216 7.168 0 14.336-2.56 19.968-7.68 11.776-10.752 12.288-29.184 1.536-41.472-1.024-1.024-2.048-2.048-3.072-3.584l-0.512-0.512v-0.512-0.512l-0.512-0.512c-9.728-10.24-19.968-19.968-30.72-29.184-9.216-6.656-16.384-9.216-23.04-9.216z m-153.6-88.064c-12.288 0-23.552 7.68-27.648 19.968-5.12 15.36 3.072 31.744 18.432 36.864 14.848 5.12 29.696 10.752 43.52 17.408 4.096 2.048 8.192 2.56 12.288 2.56 11.264 0 21.504-6.144 26.624-16.896 6.656-14.848 0.512-31.744-14.336-38.912-16.384-7.68-32.768-14.336-49.664-19.968-3.072-0.512-6.144-1.024-9.216-1.024zM510.976 29.696c-0.512 0-0.512 0 0 0-0.512 0-0.512 0 0 0-0.512 0-0.512 0 0 0-0.512 0-0.512 0 0 0h-0.512-4.096c-11.776 0.512-23.552 1.536-34.816 2.56-15.872 1.536-27.648 16.384-25.6 32.256 1.536 14.848 14.336 26.112 29.184 26.112h3.072c15.36-1.536 31.232-2.56 47.104-2.56 6.144 0 12.8 0 18.944 0.512h1.536c15.36 0 28.672-12.288 29.184-28.16 0.512-15.872-11.776-29.696-27.648-30.208h-6.144-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512c-16.896-0.512-17.408-0.512-17.408-0.512z" p-id="17315"></path></svg>
                    新建
                </li>

                <li  v-for="(tableName, index) in list" :key="index" @click="openTable(tableName.name)">
                    {{ tableName.name }}
                </li>   
            </ul>
        </div>

        <div v-if="isShow === 1" class="create-table">
            <div class="create-table-main">
                <div class="top">
                    <div class="return" @click="ret">
                        <svg t="1769431872810" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26120"><path d="M480 64C214.912 64 0 278.912 0 544c0 265.088 214.912 480 480 480 265.088 0 480-214.912 480-480 0-265.088-214.912-480-480-480z m85.12 649.024c12.48 12.48 12.48 32.768 0 45.248-6.272 6.272-14.464 9.344-22.656 9.344s-16.384-3.136-22.656-9.344L328.32 566.656c-12.48-12.48-12.48-32.768 0-45.248l192.768-192.832c12.48-12.48 32.768-12.48 45.248 0s12.48 32.768 0 45.248l-170.112 170.24 168.896 168.96z" p-id="26121"></path></svg>
                    </div>

                    <div class="next" @click="next">
                        <svg t="1769689393425" viewBox="0 0 1365 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21189"><path d="M96.426667 1001.472l-10.496-9.045333c-11.093333-9.386667-17.749333-15.189333 26.624-199.850667 76.544-319.658667 380.928-526.08 721.664-556.885333V0L1365.333333 412.501333 834.218667 825.002667V589.226667c-220.757333-16.725333-414.72 2.56-544.768 141.994666-64.085333 69.034667-141.312 205.397333-159.829334 245.589334-2.645333 5.717333-7.424 16.213333-19.114666 20.138666l-14.08 4.522667z" p-id="21190"></path></svg>                   
                    </div>
                </div>

                <div class="table-option">
                    <div class="table-option-title option option-title">
                        <span>表格名称：</span>
                        <input v-model="itemTitle" type="text">
                    </div>

                    <div class="table-option-time option">
                        <div>
                            时间段
                        </div>

                        <div class="current current-time"> 
                            <div class="current-item item-time" v-for="(value, index) in itemTimeValue" :key="index">
                                <div class="time-content">
                                    {{ value[0] }}
                                </div>

                                <div class="time-editor">
                                    {{ value[1] + ' — ' + value[2] }}
                                </div>

                                <div class="time-btn" @click="itemTimeValue.splice(index, 1)">
                                    <svg t="1769695779738" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24973"><path d="M798.1 872.6c0 34.3-27.9 62.2-62.1 62.2H288.1c-34.3-0.1-62.1-27.9-62.2-62.2V212.8h572.2v659.8zM350.2 101.2c0-7.2 5.6-12.8 12.8-12.8h298.8c7.2 0 12.7 5.6 12.7 12.8v37.5H350.2v-37.5z m634.3 37.5H748.7v-37.5c0-47.8-39-86.9-86.9-86.9H363c-47.9 0.1-86.8 38.9-86.9 86.9v37.5H39.5C18.7 138.7 2 155.4 2 176.1s16.7 37.5 37.5 37.5H151v659c0 75.7 61.4 137.1 137.1 137.1h447.8c75.7 0 137.1-61.4 137.1-137.1V212.8h111.6c20.7 0 37.5-16.7 37.5-37.5s-16.8-36.6-37.6-36.6zM512 822.4c20.7 0 37.5-16.7 37.5-37.5V386.5c0-20.7-16.7-37.5-37.5-37.5-20.7 0-37.5 16.7-37.5 37.5v398.4c0 20.7 16.8 37.5 37.5 37.5m-174.5 0c20.7 0 37.5-16.7 37.5-37.5V386.5c0-20.7-16.7-37.5-37.5-37.5-20.7 0-37.5 16.7-37.5 37.5v398.4c0.8 20.7 17.6 37.5 37.5 37.5m349 0c20.7 0 37.5-16.7 37.5-37.5V386.5c0-20.7-16.7-37.5-37.5-37.5-20.7 0-37.5 16.7-37.5 37.5v398.4c0.1 20.7 16.8 37.5 37.5 37.5" p-id="24974"></path></svg>
                                </div>
                            </div>

                            
                            <div class="current-item item-time" v-for="index in itemTimeNum" :key="index">
                                <div class="time-content">
                                    <input type="text" v-model="itemTimeName">
                                </div>

                                <div class="time-editor">
                                    <input type="time" class="time" v-model="itemBeginTime">

                                    —

                                    <input type="time" class="time" v-model="itemEndTime">
                                </div>

                                <div class="time-btn" @click="itemTimeAdd(itemTimeName, itemBeginTime, itemEndTime); itemTimeNum--">
                                    <svg t="1769694560181" viewBox="0 0 1027 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23967"><path d="M983.838803 313.362669A511.938806 511.938806 0 1 0 1023.96018 512.025787a508.619448 508.619448 0 0 0-40.121377-198.663118z m-58.751651 372.475902A448.143324 448.143324 0 1 1 960.164699 512.025787a445.132975 445.132975 0 0 1-35.077547 173.812784z" p-id="23968"></path><path d="M724.330744 359.614394a95.802871 95.802871 0 0 0-135.326166 0L476.226128 472.392844l-22.557684-22.557683a95.693223 95.693223 0 1 0-135.326166 135.326166l90.220767 90.220766a95.802871 95.802871 0 0 0 135.326166 0l180.421597-180.421597a95.802871 95.802871 0 0 0 0-135.326166z m-45.105399 90.220767l-180.421597 180.421597a31.897741 31.897741 0 0 1-45.105399 0L363.477582 540.035991a31.897741 31.897741 0 0 1 45.115367-45.105399l45.1054 45.115367a31.897741 31.897741 0 0 0 45.105399 0L634.109978 404.719793a31.897741 31.897741 0 0 1 45.115367 45.115368z" p-id="23969"></path></svg>
                                </div>
                            </div>

                            <div class="time-add" @click="itemTimeNum++">
                                  <svg t="1769686661854" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17314"><path d="M722.944 544.768h-178.176v178.176c0 17.92-14.336 32.256-32.256 32.256s-32.256-14.336-32.256-32.256v-178.176h-179.2c-17.92 0-32.256-14.336-32.256-32.256s14.336-32.256 32.256-32.256h178.176V301.568c0-17.92 14.336-32.256 32.256-32.256s32.256 14.336 32.256 32.256v178.176H721.92c17.92 0 32.256 14.336 32.256 32.256 1.024 17.92-13.824 32.768-31.232 32.768zM336.896 64c-3.584 0-7.68 0.512-11.264 2.048-7.168 3.072-14.848 6.144-22.016 9.728-0.512 0-0.512 0-1.024 0.512-7.68 3.584-15.872 7.68-23.552 11.776-14.336 7.68-19.456 25.6-11.776 39.424 5.12 9.728 15.36 15.36 25.6 15.36 4.608 0 9.728-1.024 13.824-3.584 13.824-7.68 28.16-14.336 42.496-20.48 14.848-6.144 22.016-23.04 15.872-37.888-5.632-10.24-16.896-16.896-28.16-16.896zM189.44 161.792c-7.168 0-14.848 2.56-20.48 8.192-12.8 12.288-24.576 25.6-35.84 39.424-10.24 12.288-8.192 30.72 4.096 40.96 5.632 4.608 11.776 6.656 18.432 6.656 8.704 0 16.896-3.584 22.528-10.752 9.728-12.288 20.48-24.064 31.744-34.816 11.264-11.264 11.776-29.696 0-41.472-5.632-5.12-13.312-8.192-20.48-8.192zM89.6 308.224c-11.264 0-22.016 6.656-26.624 17.92-4.096 9.216-7.68 18.432-10.752 28.16 0 0.512-0.512 1.024-0.512 1.024v0.512c-2.048 6.144-4.096 12.8-6.144 18.944-4.608 15.36 4.096 31.744 19.456 36.352 2.56 1.024 5.632 1.024 8.192 1.024 12.8 0 24.064-8.192 28.16-20.992 4.608-14.848 9.728-29.696 15.872-44.032 6.144-14.848-0.512-31.744-15.36-38.4-4.608 0.512-8.192-0.512-12.288-0.512z m-35.84 173.568c-15.872 0-29.184 12.8-29.184 28.672v10.24c0 8.704 0.512 17.408 1.536 26.112 0 2.048 0.512 4.096 0.512 6.144 1.536 14.848 14.336 26.112 29.184 26.112h3.072c15.872-1.536 27.648-15.872 26.112-31.744-1.536-13.824-2.048-28.16-2.048-42.496v-4.608c0-5.12-12.8-17.92-29.184-18.432z m32.256 174.592c-3.584 0-7.168 0.512-10.752 2.048-14.848 6.144-22.528 23.04-16.384 37.888 6.144 15.36 12.8 30.208 20.48 44.544 0.512 0.512 1.024 1.536 1.024 2.048 5.12 9.728 15.36 15.36 25.6 15.36 4.608 0 9.216-1.024 13.824-3.584 14.336-7.68 19.456-25.088 11.776-39.424-7.168-13.824-13.824-28.16-19.968-42.496-3.072-9.728-14.336-16.384-25.6-16.384z m96.256 148.48c-7.168 0-14.848 2.56-20.48 8.192-11.776 11.264-11.776 29.696-0.512 41.472 5.12 5.12 10.24 10.24 15.872 15.36l0.512 0.512c6.656 6.144 13.312 12.288 20.48 17.92 5.632 4.608 11.776 6.656 18.432 6.656 8.192 0 16.896-3.584 22.528-10.752 10.24-12.288 8.704-30.72-3.584-40.96s-23.552-20.992-34.304-32.256c-3.584-3.072-11.264-6.144-18.944-6.144zM327.68 906.24c-11.264 0-22.016 6.656-26.624 17.408-6.656 14.848 0 31.744 14.848 38.4 16.384 7.168 33.28 13.312 50.176 18.944 3.072 1.024 5.632 1.536 8.704 1.536 12.288 0 24.064-8.192 27.648-20.48 4.608-15.36-3.584-31.744-18.944-36.352-14.848-4.608-29.696-10.24-44.032-16.384-4.096-2.56-7.68-3.072-11.776-3.072z m223.232 36.352h-2.56c-12.288 1.024-25.088 1.536-37.888 1.536h-9.216-0.512c-15.872 0-28.672 12.8-29.184 28.672-0.512 15.872 12.288 29.696 28.672 29.696H523.264c9.216-0.512 18.432-1.024 27.136-1.536 15.872-1.536 27.648-15.36 26.624-31.744 1.536-15.36-11.264-26.624-26.112-26.624z m169.984-49.664c-4.608 0-9.216 1.024-13.312 3.072-13.824 7.168-28.16 13.824-43.008 19.456-14.848 5.632-22.528 22.528-16.896 37.888 4.608 11.776 15.36 18.432 27.136 18.432 3.584 0 7.168-0.512 10.752-2.048 3.072-1.024 6.656-2.56 9.728-4.096h1.024c0.512 0 0.512 0 1.024-0.512 5.12-2.048 10.752-4.608 15.872-7.168 0.512 0 1.024-0.512 1.536-0.512 0.512 0 0.512 0 1.024-0.512h1.024s0.512 0 0.512-0.512l9.216-4.608c14.336-7.68 19.968-25.088 12.288-39.424 3.072-13.824-7.168-19.456-17.92-19.456z m138.752-110.592c-8.192 0-16.384 3.584-22.528 10.24-10.24 11.776-20.992 23.552-32.256 34.304-11.776 11.264-12.288 29.696-1.024 41.472 5.632 6.144 13.312 9.216 20.992 9.216 7.168 0 14.336-2.56 19.968-7.68 12.8-12.288 25.088-25.088 36.864-38.912 10.24-12.288 8.704-30.72-3.584-40.96-5.12-5.12-11.776-7.68-18.432-7.68z m86.016-154.624c-12.288 0-23.552 7.68-27.648 19.968-4.608 14.848-10.24 29.696-16.896 44.032-6.656 14.848 0 31.744 14.848 38.4 4.096 1.536 8.192 2.56 11.776 2.56 11.264 0 21.504-6.144 26.624-17.408 3.584-7.68 6.656-15.872 10.24-24.064 0-0.512 0-0.512 0.512-1.024 0-0.512 0-0.512 0.512-1.024v-0.512-0.512-0.512-0.512c0-0.512 0-0.512 0.512-1.024l4.608-13.824c5.12-15.36-3.584-31.744-18.944-36.864 0-7.168-3.072-7.68-6.144-7.68z m20.992-176.128h-2.048c-15.872 1.024-28.16 15.36-27.136 31.232 1.024 10.752 1.024 22.016 1.024 32.768v14.336c-0.512 15.872 12.288 29.696 28.16 30.208h1.024c15.872 0 28.672-12.288 29.184-28.16v-5.632-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512c0-7.68-0.512-14.848-1.024-22.016v-0.512-0.512c-1.024-33.28-13.824-45.056-29.184-45.056z m-47.616-170.496c-4.608 0-8.704 1.024-13.312 3.072-14.336 7.168-19.968 24.576-12.8 39.424 7.168 13.824 13.312 28.672 18.944 43.008 4.608 11.776 15.36 18.944 27.136 18.944 3.584 0 6.656-0.512 10.24-2.048 14.848-5.632 22.528-22.528 17.408-37.376-6.144-16.896-13.312-33.28-21.504-49.152-5.12-10.24-15.36-15.872-26.112-15.872z m-109.056-139.776c-8.192 0-16.384 3.584-22.016 10.24-10.752 12.288-9.216 30.72 3.072 40.96 11.776 10.24 23.04 21.504 33.792 32.768 5.632 6.144 13.824 9.216 21.504 9.216 7.168 0 14.336-2.56 19.968-7.68 11.776-10.752 12.288-29.184 1.536-41.472-1.024-1.024-2.048-2.048-3.072-3.584l-0.512-0.512v-0.512-0.512l-0.512-0.512c-9.728-10.24-19.968-19.968-30.72-29.184-9.216-6.656-16.384-9.216-23.04-9.216z m-153.6-88.064c-12.288 0-23.552 7.68-27.648 19.968-5.12 15.36 3.072 31.744 18.432 36.864 14.848 5.12 29.696 10.752 43.52 17.408 4.096 2.048 8.192 2.56 12.288 2.56 11.264 0 21.504-6.144 26.624-16.896 6.656-14.848 0.512-31.744-14.336-38.912-16.384-7.68-32.768-14.336-49.664-19.968-3.072-0.512-6.144-1.024-9.216-1.024zM510.976 29.696c-0.512 0-0.512 0 0 0-0.512 0-0.512 0 0 0-0.512 0-0.512 0 0 0-0.512 0-0.512 0 0 0h-0.512-4.096c-11.776 0.512-23.552 1.536-34.816 2.56-15.872 1.536-27.648 16.384-25.6 32.256 1.536 14.848 14.336 26.112 29.184 26.112h3.072c15.36-1.536 31.232-2.56 47.104-2.56 6.144 0 12.8 0 18.944 0.512h1.536c15.36 0 28.672-12.288 29.184-28.16 0.512-15.872-11.776-29.696-27.648-30.208h-6.144-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512-0.512c-16.896-0.512-17.408-0.512-17.408-0.512z" p-id="17315"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div class="table-option-date option">
                        <div>
                            星期
                        </div>

                        <div class="current">
                            <div class="current-item current-date" v-for="(value, index) in itemWeekValue" :key="index">
                                {{ value }}

                                <div class="current-item-del" @click="itemWeekValue.splice(index, 1)">
                                    <svg t="1769695779738" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24973"><path d="M798.1 872.6c0 34.3-27.9 62.2-62.1 62.2H288.1c-34.3-0.1-62.1-27.9-62.2-62.2V212.8h572.2v659.8zM350.2 101.2c0-7.2 5.6-12.8 12.8-12.8h298.8c7.2 0 12.7 5.6 12.7 12.8v37.5H350.2v-37.5z m634.3 37.5H748.7v-37.5c0-47.8-39-86.9-86.9-86.9H363c-47.9 0.1-86.8 38.9-86.9 86.9v37.5H39.5C18.7 138.7 2 155.4 2 176.1s16.7 37.5 37.5 37.5H151v659c0 75.7 61.4 137.1 137.1 137.1h447.8c75.7 0 137.1-61.4 137.1-137.1V212.8h111.6c20.7 0 37.5-16.7 37.5-37.5s-16.8-36.6-37.6-36.6zM512 822.4c20.7 0 37.5-16.7 37.5-37.5V386.5c0-20.7-16.7-37.5-37.5-37.5-20.7 0-37.5 16.7-37.5 37.5v398.4c0 20.7 16.8 37.5 37.5 37.5m-174.5 0c20.7 0 37.5-16.7 37.5-37.5V386.5c0-20.7-16.7-37.5-37.5-37.5-20.7 0-37.5 16.7-37.5 37.5v398.4c0.8 20.7 17.6 37.5 37.5 37.5m349 0c20.7 0 37.5-16.7 37.5-37.5V386.5c0-20.7-16.7-37.5-37.5-37.5-20.7 0-37.5 16.7-37.5 37.5v398.4c0.1 20.7 16.8 37.5 37.5 37.5" p-id="24974"></path></svg>
                                </div>
                            </div>
                        </div>

                        <ul>
                            <li @click="itemWeekValue.push('星期一')">星期一</li>
                            <li @click="itemWeekValue.push('星期二')">星期二</li>
                            <li @click="itemWeekValue.push('星期三')">星期三</li>
                            <li @click="itemWeekValue.push('星期四')">星期四</li>
                            <li @click="itemWeekValue.push('星期五')">星期五</li>
                            <li @click="itemWeekValue.push('星期六')">星期六</li>
                            <li @click="itemWeekValue.push('星期日')">星期日</li>
                        </ul>
                    </div>

                    <div class="table-item option">
                        <div >
                            事项
                        </div>

                        <div class="current">
                            <div class="current-item current-data" v-for="(value, index) in itemContentValue" :key="index">
                                {{ value }}
                                <div class="current-item-del" @click="itemContentValue.splice(index, 1)">
                                    <svg t="1769695779738" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24973"><path d="M798.1 872.6c0 34.3-27.9 62.2-62.1 62.2H288.1c-34.3-0.1-62.1-27.9-62.2-62.2V212.8h572.2v659.8zM350.2 101.2c0-7.2 5.6-12.8 12.8-12.8h298.8c7.2 0 12.7 5.6 12.7 12.8v37.5H350.2v-37.5z m634.3 37.5H748.7v-37.5c0-47.8-39-86.9-86.9-86.9H363c-47.9 0.1-86.8 38.9-86.9 86.9v37.5H39.5C18.7 138.7 2 155.4 2 176.1s16.7 37.5 37.5 37.5H151v659c0 75.7 61.4 137.1 137.1 137.1h447.8c75.7 0 137.1-61.4 137.1-137.1V212.8h111.6c20.7 0 37.5-16.7 37.5-37.5s-16.8-36.6-37.6-36.6zM512 822.4c20.7 0 37.5-16.7 37.5-37.5V386.5c0-20.7-16.7-37.5-37.5-37.5-20.7 0-37.5 16.7-37.5 37.5v398.4c0 20.7 16.8 37.5 37.5 37.5m-174.5 0c20.7 0 37.5-16.7 37.5-37.5V386.5c0-20.7-16.7-37.5-37.5-37.5-20.7 0-37.5 16.7-37.5 37.5v398.4c0.8 20.7 17.6 37.5 37.5 37.5m349 0c20.7 0 37.5-16.7 37.5-37.5V386.5c0-20.7-16.7-37.5-37.5-37.5-20.7 0-37.5 16.7-37.5 37.5v398.4c0.1 20.7 16.8 37.5 37.5 37.5" p-id="24974"></path></svg>
                                </div>
                            </div>
                        </div>

                        <ul>
                            <input type="text" v-model="itemContent" @keydown.enter="itemContentAdd">    
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isShow === 2" class="show-table">
            <TimeClassShow 
            @save="handleSave"
            @cancel="handleCancel"
            :form-data="itemAdd"
            />
        </div>

        <div v-if="isShow === 3" class="show-current-table">
            <TimeTableShow
            :name="currentTable"
            :html-content="htmlContent"
            @close="handleClose"
            @delete="handleDel"
            @save="handleSaveView"
            />
        </div>
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
}

.container {
    width: 100%;
    height: 100%;
    background-color: var(--light-main-bgc);
}

.show-table-list {
    padding: 40px;
    width: 100%;
    height: 100%;
}

.show-table-list>ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start; 
    align-items: flex-start; 
    align-content: flex-start;
    gap: 16px 20px;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}

.show-table-list>ul>li {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc((100% - 3 * 30px) / 4);
    height: 20%;
    color: var(--light-font-color);
    font-size: 25px;
    user-select: none;
    border-radius: 10px;
    background-color: var(--light-option-bgc);
    box-shadow: 0 5px 13px rgba(0, 0, 0, 0.126);
    cursor: pointer;
}

.show-table-list>ul>.add {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--light-svg-main-fill);
}

.show-table-list>ul>.add:hover {
    cursor: pointer;
    color: var(--light-svg-main-hover-fill);
}

.show-table-list>ul>.add>svg { 
    width: 50%;
    height: 50%;
    fill: var(--light-svg-main-fill);
    margin-bottom: 20px;
}

.show-table-list>ul>.add:hover >svg {
    fill: var(--light-svg-main-hover-fill);
}

.create-table {
    padding: 40px;
    width: 100%;
    height: 100%;
}

.create-table>.create-table-main {
    width: 100%;
    height: 100%;
}

.create-table>.create-table-main>.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 50%;
    height: 60px;
    margin-bottom: 50px;
}

.create-table>.create-table-main>.top>div {
    width: 60px;
    height: 60px;
}

.create-table>.create-table-main>.top svg {
    width: 100%;
    height: 100%;
    fill: var(--light-svg-main-fill);
}

.create-table>.create-table-main>.top svg:hover {
    fill: var(--light-svg-main-hover-fill);
    cursor: pointer;
}

.create-table>.create-table-main>.table-option { 
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: calc(100% - 110px);
    overflow-x: hidden;
    overflow-y: auto;
    background-color: var(--light-option-bgc);
}

.table-option>.option {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0 20px;
    width: 100%;
    font-size: 30px;
    margin-bottom: 30px;
    color: var(--light-font-color);
}

.table-option>.option-title {
    flex-direction: row;
}

.table-option>.option>div {
    margin-bottom: 10px;
}

.table-option>.option>.current {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 0 30px;
}

.table-option>.option>.current-time { 
    flex-direction: column;
}

.table-option>.option>.current>.current-item { 
    padding: 10px 25px;
    margin: 20px 0;
    border-radius: 10px;
    background-color: var(--light-option-second-bgc);
}

.table-option>.option>.current>.current-data,  .table-option>.option>.current>.current-date{
    display: flex;
    gap: 0 20px;
}

.table-option>.option>.current>.current-data>.current-item-del>svg, .table-option>.option>.current>.current-date>.current-item-del>svg { 
    width: 25px;
    height: 100%;
    fill: var(--light-svg-main-fill);
}

.table-option>.option>.current>.current-data>.current-item-del:hover >svg {
    fill: var(--light-svg-main-hover-fill);
    cursor: pointer;
}

.table-option>.option>.current>.current-date>.current-item-del:hover >svg {
    fill: var(--light-svg-main-hover-fill);
    cursor: pointer;
}

.table-option>.option>ul {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0 20px;
}

.table-option>.option>ul>li {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 130px;
    height: 60px;
    border-radius: 10px;
    cursor: pointer;
    background: var(--light-option-second-bgc);
    user-select: none;
}



.table-option>.option>.current-time>.time-add {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 300px;
    width: calc(100% - 20px);
    height: 80px;
    border-radius: 10px;
    background-color: var(--light-option-second-bgc);
}

.table-option>.option>.current-time>.time-add>svg {
    width: 50px;
    height: 100%;
    fill: var(--light-svg-main-fill)
}

.table-option>.option>.current-time>.time-add:hover >svg {
    fill: var(--light-svg-main-hover-fill);
    cursor: pointer;
}

.item-time {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0 100px;
    height: 70px;
}

.item-time>.time-btn>svg {
    width: 80px;
    height: 50px;
    margin-top: 7px;
    fill: var(--light-svg-main-fill);
    cursor: pointer;
}

.item-time>.time-btn>svg:hover {
    fill: var(--light-svg-main-hover-fill); 
}


.table-option>.option .time {
    width: 130px;
    padding: 5px;
    font-size: 25px;
    color: var(--light-font-color);
}

input {
    background-color: var(--light-option-bgc);
    color: var(--light-font-color);
    border-radius: 10px;
    border: 2px solid rgb(200, 200, 200);
}


input[type="text"] {
    width: 200px;
    height: 100%;
    padding: 5px;
    font-size: 25px;
    border: 2px solid rgb(200, 200, 200);
}

input[type="text"]:focus {
    outline: none;
}

input[type="time"]:focus { 
    outline: none;
}

input[type="time"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  display: none; 
}

input[type="time"]::-webkit-calendar-picker-indicator {
  font-size: 25px; 
  margin-right: 4px; 
  cursor: pointer;
}

input[type="time"]::-webkit-calendar-picker-indicator {
    background: none;
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>');
    mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>');
    mask-size: contain;
    -webkit-mask-size: contain;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    background-color: var(--light-font-color);
}

input[type="time"]::-webkit-datetime-edit-text {
  color: var(--light-font-color); 
  font-size: 18px; 
  padding: 0 4px;
}


input[type="time"]::-webkit-datetime-edit-hour-field {
  color: var(--light-font-color); 
  font-weight: 500;
}


input[type="time"]::-webkit-datetime-edit-minute-field {
  color: var(--light-font-color); 
  font-weight: 500;
}

.show-table {
    width: 100%;
    height: 100%;
}

.show-current-table {
    width: 100%;
    height: 100%;
}
</style>