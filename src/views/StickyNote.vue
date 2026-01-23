<script setup lang="ts">
import TextEditor from '../components/TextEditor.vue'
import Button from '../components/Button.vue'
import Popup from '../components/Popup.vue'
import Select from '../components/Select.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const TEXT = 'txt'
const HTML = 'html'
const JSON = 'json'
const SELECTWIDTHSIZE = 0.25

const theme = ref('light')
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
        fileData.value.content = save.data
    }
}


const saveFile = (name: string, type: string) => {
    return window.electronAPI.saveFile(name, type, fileData.value.content)
}


const openFile = () => {
    const name = currentFile.value.name + '.' + currentFile.value.type
    window.electronAPI.openFile(name).then(
        data => {
            fileData.value.content = data
            fileData.value.type = currentFile.value.type
        }
    )
}


const selectWith = ref('350px')

const handleWidthChange = () => {
    if (func.value) {
        const newWidth = func.value.style.width || getComputedStyle(func.value).width
        selectWith.value = parseInt(newWidth, 10) * SELECTWIDTHSIZE + 'px'
    }
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
const selectValues = ref<SelectValue[]>()
onMounted(() => {
    window.electronAPI.openAllFiles().then(
        data => selectValues.value = data
    )
})

onUnmounted(() => {
    if (resizeObserver) {
        resizeObserver.disconnect()
        resizeObserver = null
    }
})


</script>


<template>
    <div class="sticky-note">
        <div class="func" ref="func">
            <div v-if="!isShowAll" class="func-main">
                <div class="search">
                    <Select 
                    :width="selectWith" 
                    :select-values="selectValues"
                    @data="currentFile" />
                </div>

                <div class="btn">
                    <Button @update="updateTheme">
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
            <TextEditor :theme="theme" :file-data="fileData" @save="handleSave" />
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