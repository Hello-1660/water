<script setup lang="ts">
import TextEditor from '../components/TextEditor.vue'
import Button from '../components/Button.vue'
import Popup from '../components/Popup.vue'
import Select from '../components/Select.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const TEXT = 'txt'
const HTML = 'html'
const JSON = 'json'
const SELECTWIDTHSIZE = 0.25

const theme = ref('light')
const initTheme = computed(() => theme.value !== 'light')
const initSelectValue = computed(() => currentFile.value.name)
const isShowAll = ref(false)

const editor = ref<HTMLDivElement | undefined>()
const func = ref<HTMLDivElement | undefined>()
const currentFile = ref<any>({
    name: '',
    type: HTML,
})


const fileData = ref<any>({
    type: 'text',
    content: ''
})





const updateShowAll = () => {
    if (!func.value) return
    if (!editor.value) return

    func.value.style.height = isShowAll.value ? '10%' : '30px'
    editor.value.style.height = isShowAll.value ? '90%' : '100%'

    isShowAll.value = !isShowAll.value
}

const updateTheme = (value: boolean) => {
    if (value) {
        theme.value = 'dark'
    } else {
        theme.value = 'light'
    }
}

const handleSave = (save: any) => {
    if (save.msg === 'success') {
        let saveData = ''
        if (currentFile.value.type === HTML) {
            saveData = save.data.html
        } else if (currentFile.value.type === JSON) { 
            saveData = save.data.json
        } else if (currentFile.value.type === TEXT) { 
            saveData = save.data.text
        } else { 
            saveData = save.data.text
        }

        fileData.value.content = saveData
        if (currentFile.value.name !== '') {
            saveFile(currentFile.value.name, currentFile.value.type, (data: any) => console.log(data))
            return 
        }

        isShowSavePopup.value = true
    }
}


const saveFile = (name: string, type: string, func: Function) => {
    console.log('saveFile', name, type, fileData.value.content)
    return window.electronAPI.saveFile(name, type, fileData.value.content).then(
        data => func(data)
    )
}


const openFile = (name: string, type: string, func: Function) => {
    const file = name + '.' + type
    window.electronAPI.openFile(file).then(
        data => func(data)
    )
}


const deleteFile = (name: string, type: string, func: Function) => {
    window.electronAPI.deleteFile(name + '.' + type).then(
        data => func(data)
    )
}


const openAllFiles = () => {
    window.electronAPI.openAllFiles().then(
        data => selectValues.value = data
    )
}


const selectWith = ref('350px')

const handleWidthChange = () => {
    if (func.value) {
        const newWidth = func.value.style.width || getComputedStyle(func.value).width
        selectWith.value = parseInt(newWidth, 10) * SELECTWIDTHSIZE + 'px'
    }
}

const handleCurrentFile = (data: SelectValue) => {
    currentFile.value.name = data.name
    currentFile.value.type = data.type

    openFile(currentFile.value.name, currentFile.value.type, (data: string) => {
        fileData.value.type = currentFile.value.type
        fileData.value.content = data
    })
}

let resizeObserver: ResizeObserver | null = null
onMounted(() => {
    if (func.value) {
        resizeObserver = new ResizeObserver(handleWidthChange)
        resizeObserver.observe(func.value)

        handleWidthChange()
    }
})

interface SelectValue {
    name: string,
    type: string
}


const addFile = () => {
    currentFile.value.name = ''
    fileData.value.content = ''
}

const deleteFileEvent = () => {
    isShowDeletePopup.value = true
}


const selectValues = ref<SelectValue[]>()
onMounted(() => {
    openAllFiles()
})

onUnmounted(() => {
    if (resizeObserver) {
        resizeObserver.disconnect()
        resizeObserver = null
    }
})




const isShowDeletePopup = ref(false)
const isShowSavePopup = ref(false)


const handleDeletePopupSure = () => {
    deleteFile(currentFile.value.name, currentFile.value.type, (data: boolean) => {
        console.log(data)
        openAllFiles()
        addFile()
    })
}


const savePopupFileName = ref('')
const savePopupFileType = ref('txt')
const handleSavePopupSure = () => {
    saveFile(savePopupFileName.value, savePopupFileType.value, (data: boolean) => {
        console.log(data)
        openAllFiles()
    })
}

</script>


<template>
    <div class="sticky-note">
        <Popup ref="popupRef" v-model="isShowDeletePopup" title="永久删除文件" width="500px" height="210px"
            @sure="handleDeletePopupSure">
            <h3>删除后，该文件将不可恢复。确认删除吗？</h3>
            <template #sure-text>
                确认
            </template>
            <template #close-text>
                取消
            </template>
        </Popup>



        <Popup ref="popupRef" v-model="isShowSavePopup" 
        title="保存文件" 
        width="600px" 
        height="380px"
        @sure="handleSavePopupSure"
        @close="savePopupFileName = ''"
        >
            <form class="popup-form">
                <label for="fileName">
                    文件名称：
                    <input type="text" v-model="savePopupFileName" id="fileName" placeholder="请输入文件名"></input>
                </label>

                <label for="fileType">
                    文件类型：
                    <input type="text" v-model="savePopupFileType" id="fileType" placeholder="请输入文件类型"></input>
                </label>
            </form>
            <template #sure-text>
                确认
            </template>
            <template #close-text>
                取消
            </template>
        </Popup>

        <div class="func" ref="func">
            <div v-if="!isShowAll" class="func-main">
                <div class="search">
                    <Select :width="selectWith" :select-values="selectValues" @data="handleCurrentFile"
                        :initSelectValue="initSelectValue" />
                </div>

                <div class="delete option" v-show="currentFile.name !== ''" @click="deleteFileEvent">
                    <svg t="1769254219486" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="10396">
                        <path
                            d="M781.28 851.36a58.56 58.56 0 0 1-58.56 58.56H301.28a58.72 58.72 0 0 1-58.56-58.56V230.4h538.56z m-421.6-725.92a11.84 11.84 0 0 1 12-12h281.28a11.84 11.84 0 0 1 12 12V160H359.68zM956.8 160H734.72v-34.56a81.76 81.76 0 0 0-81.76-81.76H371.68a82.08 82.08 0 0 0-81.76 81.76V160H67.2a35.36 35.36 0 0 0 0 70.56h105.12v620.8a128.96 128.96 0 0 0 128.96 128.96h421.44a128.96 128.96 0 0 0 128.96-128.96V230.4H956.8a35.2 35.2 0 0 0 35.2-35.2 34.56 34.56 0 0 0-35.2-35.2zM512 804.16a35.2 35.2 0 0 0 35.2-35.36V393.92a35.2 35.2 0 1 0-70.4 0V768.8a35.2 35.2 0 0 0 35.2 35.36m-164.32 0a35.36 35.36 0 0 0 35.36-35.36V393.92a35.36 35.36 0 1 0-70.56 0V768.8a36.32 36.32 0 0 0 35.2 35.36m328.64 0a35.36 35.36 0 0 0 35.2-35.36V393.92a35.36 35.36 0 1 0-70.56 0V768.8a35.36 35.36 0 0 0 35.36 35.36"
                            p-id="10397"></path>
                    </svg>
                </div>

                <div class="add option" @click="addFile">
                    <svg t="1769252361102" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                        p-id="9390">
                        <path
                            d="M594.04 959.5H142.31c-41.14 0-74.6-33.46-74.6-74.6V367.47c0-21.18 17.17-38.36 38.36-38.36s38.36 17.17 38.36 38.36v515.32h449.62c21.18 0 38.36 17.17 38.36 38.36-0.01 21.18-17.18 38.35-38.37 38.35zM783.71 569.26c-21.18 0-38.36-17.17-38.36-38.36V141.21H365.4c-21.18 0-38.36-17.17-38.36-38.36S344.22 64.5 365.4 64.5h382.07c41.14 0 74.6 33.46 74.6 74.6v391.8c0 21.19-17.18 38.36-38.36 38.36z m-36.24-428.05h0.12-0.12z"
                            p-id="9391"></path>
                        <path
                            d="M360.67 438.06H130.53c-21.18 0-38.36-17.17-38.36-38.36s17.17-38.36 38.36-38.36h230.14c21.18 0 38.36 17.17 38.36 38.36s-17.18 38.36-38.36 38.36zM917.93 824.76h-268.5c-21.18 0-38.36-17.17-38.36-38.36 0-21.18 17.17-38.36 38.36-38.36h268.5c21.18 0 38.36 17.17 38.36 38.36 0 21.19-17.18 38.36-38.36 38.36z"
                            p-id="9392"></path>
                        <path
                            d="M783.68 959.01c-21.18 0-38.36-17.17-38.36-38.36v-268.5c0-21.18 17.17-38.36 38.36-38.36 21.18 0 38.36 17.17 38.36 38.36v268.5c0 21.19-17.18 38.36-38.36 38.36zM364.04 437.23c-21.18 0-38.36-17.17-38.36-38.36V110.64c0-21.18 17.17-38.36 38.36-38.36 21.18 0 38.36 17.17 38.36 38.36v288.23c0 21.19-17.17 38.36-38.36 38.36z"
                            p-id="9393"></path>
                        <path
                            d="M106.24 398.98c-9.85 0-19.7-3.77-27.19-11.31-14.94-15.02-14.88-39.31 0.14-54.25L338.35 75.66c15.02-14.93 39.3-14.88 54.25 0.14 14.94 15.02 14.88 39.31-0.14 54.25L133.3 387.81c-7.49 7.45-17.27 11.17-27.06 11.17z"
                            p-id="9394"></path>
                    </svg>
                </div>
                <div class="btn">
                    <Button @update="updateTheme" :theme="initTheme">
                        <template #label1>
                            <svg name="label1" t="1769078205047" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="14801" width="100%" height="100%"
                                fill="#cccccc">
                                <path
                                    d="M513.123 795.991c-76.156 0-147.753-29.658-201.603-83.508-53.849-53.849-83.504-125.444-83.504-201.596 0-76.153 29.657-147.749 83.504-201.598 53.85-53.851 125.446-83.508 201.603-83.508 76.147 0 147.742 29.658 201.593 83.508 53.853 53.852 83.511 125.447 83.511 201.598s-29.659 147.747-83.511 201.597c-53.852 53.85-125.445 83.507-201.593 83.507zM513.123 272.352c-131.529 0-238.534 107.007-238.534 238.535s107.006 238.533 238.534 238.533 238.533-107.005 238.533-238.533c0-131.529-107.006-238.535-238.533-238.535z"
                                    fill="#CCCCCC" p-id="14802"></path>
                                <path
                                    d="M513.123 149.007c-12.861 0-23.285-10.426-23.285-23.285v-91.359c0-12.861 10.426-23.285 23.285-23.285s23.285 10.426 23.285 23.285v91.358c0 12.862-10.426 23.286-23.285 23.286z"
                                    fill="#CCCCCC" p-id="14803"></path>
                                <path
                                    d="M513.123 1010.674c-12.861 0-23.285-10.426-23.285-23.285v-91.346c0-12.861 10.426-23.285 23.285-23.285s23.285 10.426 23.285 23.285v91.346c0 12.861-10.426 23.285-23.285 23.285z"
                                    fill="#CCCCCC" p-id="14804"></path>
                                <path
                                    d="M240.764 261.825c-5.959 0-11.919-2.274-16.466-6.821l-64.592-64.591c-9.094-9.093-9.094-23.838 0-32.931 9.093-9.094 23.838-9.094 32.931 0l64.593 64.592c9.094 9.093 9.094 23.838 0 32.931-4.546 4.545-10.507 6.82-16.467 6.82z"
                                    fill="#CCCCCC" p-id="14805"></path>
                                <path
                                    d="M850.050 871.111c-5.958 0-11.919-2.272-16.467-6.82l-64.593-64.593c-9.093-9.094-9.093-23.839 0-32.932 9.094-9.094 23.839-9.094 32.932 0l64.593 64.593c9.093 9.094 9.093 23.839 0 32.932-4.546 4.545-10.507 6.82-16.466 6.82z"
                                    fill="#CCCCCC" p-id="14806"></path>
                                <path
                                    d="M36.59 534.183c-12.861 0.001-23.286-10.423-23.289-23.283-0.001-12.861 10.423-23.286 23.283-23.289l91.348-0.011c12.861-0.001 23.286 10.423 23.289 23.283 0.001 12.861-10.423 23.286-23.283 23.289l-91.348 0.011z"
                                    fill="#CCCCCC" p-id="14807"></path>
                                <path
                                    d="M989.613 534.173h-91.346c-12.861 0-23.285-10.426-23.285-23.285s10.426-23.285 23.285-23.285h91.346c12.861 0 23.285 10.426 23.285 23.285s-10.426 23.285-23.285 23.285z"
                                    fill="#CCCCCC" p-id="14808"></path>
                                <path
                                    d="M176.173 871.122c-5.959 0-11.919-2.272-16.466-6.82-9.094-9.094-9.094-23.839 0-32.932l64.593-64.593c9.094-9.094 23.838-9.094 32.931 0s9.094 23.839 0 32.932l-64.593 64.593c-4.546 4.546-10.506 6.82-16.466 6.82z"
                                    p-id="14809"></path>
                                <path
                                    d="M785.457 261.825c-5.959 0-11.918-2.272-16.467-6.821-9.094-9.094-9.093-23.838 0.001-32.931l64.593-64.592c9.094-9.093 23.838-9.094 32.931 0s9.093 23.838-0.001 32.931l-64.593 64.592c-4.545 4.546-10.506 6.821-16.465 6.821z"
                                    p-id="14810"></path>
                            </svg>
                        </template>

                        <template #label2>
                            <svg name="label2" t="1769078426441" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="18549" width="100%" height="100%"
                                fill="#CCCCCC">
                                <path
                                    d="M624.896 65.1264C824.7808 115.456 972.8 296.448 972.8 512c0 254.4896-206.3104 460.8-460.8 460.8-228.3008 0-417.8176-166.016-454.4-383.9232C103.552 605.3888 153.1136 614.4 204.8 614.4c240.3584 0 435.2-194.8416 435.2-435.2 0-38.656-5.0432-76.1856-14.5152-111.872l-0.6144-2.2016z m96.1536 124.6208l-4.352-2.7648 0.0256 1.024C712.0128 466.7136 484.6336 691.2 204.8 691.2c-9.1904 0-18.3296-0.256-27.4432-0.7168l-5.7344-0.4096 2.3808 4.48a384.4352 384.4352 0 0 0 329.3184 201.344L512 896c212.0704 0 384-171.9296 384-384 0-133.4528-68.6592-253.184-174.9504-322.2528z"
                                    p-id="18550"></path>
                            </svg>
                        </template>
                    </Button>
                </div>
            </div>


            <div class="editor-size">
                <svg v-show="isShowAll" @click="updateShowAll" t="1769084031871" class="icon" viewBox="0 0 1024 1024"
                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21987">
                    <path
                        d="M159.417291 157.449985l352.753089 343.768461 357.257683-345.263511 41.97602 1.49505-399.233704 422.216137-399.221424-422.216137L159.417291 157.449985zM159.417291 438.754812l352.753089 343.769484L869.428064 437.763229l41.97602 0.991584-399.233704 422.717557-399.221424-422.717557L159.417291 438.754812z"
                        p-id="21988"></path>
                </svg>
                <svg v-show="!isShowAll" @click="updateShowAll" t="1769084825450" class="icon" viewBox="0 0 1024 1024"
                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22961">
                    <path
                        d="M112.947933 859.977319l399.221424-422.215114 399.233704 422.215114-41.97602 1.49505-357.257683-345.263511L159.417291 859.977319 112.947933 859.977319zM112.947933 578.671469l399.221424-422.717557 399.233704 422.717557-41.97602 0.991584L512.17038 234.901984l-352.753089 343.769484L112.947933 578.671469z"
                        p-id="22962"></path>
                </svg>
            </div>
        </div>
        <div id="editor" class="aaa" ref="editor">
            <TextEditor 
            :theme="theme" 
            :file-data="fileData" 
            @save="handleSave" />
        </div>
    </div>
</template>

<style scoped>
.sticky-note {
    display: flex;
    flex-direction: column;
    justify-content: start;
    min-height: 0;
    height: 100%;
    width: 100%;
}

.popup-form {
    display: flex;
    flex-direction: column; 
    justify-self: center;
    align-self: center;
    height: 100%;
    font-size: 24px;
}


.popup-form>label { 
    margin: 20px 0;
}

.popup-form input {
    padding: 10px 15px;
    border: none;
    font-size: 24px;
    background-color: transparent;
}

.popup-form input:focus {
    outline: none;
}


.func {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 10%;
    max-height: 10%;
    border-radius: 20px 20px 0 0;
    transition: height 0.2s ease-in-out;
    user-select: none;
}

.func:hover {
    background-color: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.func>.func-main {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 100%;
}

.func>.func-main>.search {
    position: absolute;
    left: 30px;
}

.func>.func-main .option {
    margin-top: 10px;
    margin-right: 40px;
    cursor: pointer;
}

.func>.func-main .option>svg {
    width: 40px;
    height: 40px;
    fill: #cccccc;
}

.func>.func-main>.option>svg:hover {
    fill: #757575;
}


.func>.func-main>.btn {
    margin-right: 50px;
}

.func>.editor-size {
    position: absolute;
    left: 50%;
    bottom: 0px;
    transform: translateX(-50%);
    width: 40%;
    height: 30px;
    cursor: pointer;
}

.func>.editor-size>.icon {
    visibility: hidden;
    width: 100%;
    height: 100%;
    fill: rgb(187, 187, 187);
    transform: scaleX(3);
}

.func>.editor-size:hover .icon {
    visibility: visible;
}


#editor {
    position: relative;
    height: 90%;
    min-height: 0;
    border-radius: 10px 10px 0 0;
    overflow: hidden;
    transition: height 0.2s ease-in-out;
}
</style>