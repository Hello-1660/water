<script setup lang="ts">
import { onMounted, ref } from 'vue'


interface FormData {
    name: string;
    timeItem: string[][]; 
    date: string[];
    item: string[]; 
}

const props = defineProps<{
    formData: FormData;
}>();






const container = ref<HTMLDivElement | undefined>()
const containerMain = ref<HTMLDivElement | undefined>()
const source = ref<HTMLElement | undefined>()
type EffectAllowed = 'link' | 'copy' | 'move' | 'none' | 'copyLink' | 'copyMove' | 'linkMove' | 'all' | 'uninitialized';


function getDropNode(node: HTMLElement) {
    while (node) {
        if(node.dataset && node.dataset.drop) {
            return node
        } 
        node = node.parentNode as HTMLElement
    }
}

function clearStyles() {
    document.querySelectorAll('.drop-over').forEach((node) => {
        node.classList.remove('drop-over')
    })
}


const emit = defineEmits(['save', 'cancel'])

const save = () => { 
    emit('save', containerMain.value)
}

const cancel = () => { 
    emit('cancel')
}

onMounted(() => {
    container.value?.addEventListener('dragstart', (e: DragEvent) => {
        if (e.dataTransfer && e.target instanceof HTMLElement) {
            if (e.target.dataset) {
                e.dataTransfer.effectAllowed = (e.target.dataset.effect || 'copy') as EffectAllowed
            }

            source.value = e.target
        }
    })

    container.value?.addEventListener('dragover', (e: DragEvent) => {
        e.preventDefault()
    })

    container.value?.addEventListener('dragenter', (e: DragEvent) => {
        clearStyles()

        const dropNode = getDropNode(e.target as HTMLElement)
        if (!dropNode) return 

        if (e.dataTransfer && e.target instanceof HTMLElement && source.value) {
            if (source.value.dataset.effect === dropNode.dataset.drop) {
                dropNode.classList.add('drop-over')
            }
        }
    }) 

    container.value?.addEventListener('drop', (e: DragEvent) => {
        const dropNode = getDropNode(e.target as HTMLElement)
        if (!dropNode) return

        if (e.dataTransfer && e.target instanceof HTMLElement && source.value) {
            if (source.value.dataset.effect !== dropNode.dataset.drop) return 

            if (dropNode.dataset.drop === 'copy') {
                const cloned = source.value.cloneNode(true)
                if (cloned instanceof HTMLElement) {
                    cloned.dataset.effect = 'move'
                } 
                dropNode.innerHTML = ''
                dropNode.appendChild(cloned)
            }  else {
                source.value.remove()
            }

            clearStyles()
        }
    })
})
</script>

<template>
    <div class="time-class-show">
        <div class="time-class-show-content">
            <div class="time-class-show-content-title">
                {{ props.formData.name }}

                <div>
                    <div @click="save">保存</div>
                    <div @click="cancel">取消</div>
                </div>
            </div>

            <div ref="container" class="time-class-show-content-main">
                <div class="time-class-show-content-main-item"  data-drop="move">
                    <div class="class-item" draggable="true" data-effect="copy" :class="`color-${index % 8 === 0 ? 8 : index % 8}`" v-for="(value, index) in props.formData.item" :key="index">
                        {{ value }}
                    </div>
                </div>

                <div ref="containerMain" class="time-class-show-content-main-editor">
                    <div class="time-class-show-content-main-editor-time-item">
                        <div class="time-item-container"  v-for="(value, index) in props.formData.timeItem" :key="index">
                            <div>{{ value[0] }}</div>
                            <div>{{ value[1] + ' - ' + value[2] }}</div>
                        </div>
                    </div>

                    <ul>
                        <li id="date-item">
                             <div v-for="(value, index) in props.formData.date" :key="index">
                                {{ value }}
                             </div>
                        </li>

                        <li v-for="value in props.formData.timeItem.length" :key="value">
                            <div v-for="value in props.formData.date.length" :key="value" data-drop="copy">
                                
                            </div>
                        </li>
                    </ul>
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

.time-class-show {
    width: 100%;
    height: 100%;
    padding: 40px;
}

.time-class-show-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.time-class-show-content-title {
    position: relative;
    width: 100%;
    height: 100px;
    font-size: 50px;
    font-weight: 700;
    color: var(--light-font-color);
    text-align: center;
    line-height: 100px;
}

.time-class-show-content-title>div {
    position: absolute; 
    top: 0;
    right: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0 20px;
    font-size: 20px;
    font-weight: 400;
    width: 200px;
    height: 100%;
}

.time-class-show-content-title>div>div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90px;
    height: 50%;
    border-radius: 10px;
    color: var(--light-svg-main-fill);
    background-color: var(--light-option-second-bgc);
    user-select: none;
}

.time-class-show-content-title>div>div:hover {
    cursor: pointer;
    color: var(--light-svg-main-hover-fill);
}

.time-class-show-content-main {
    display: flex;
    width: 100%;
    height: calc(100% - 100px);
}

.time-class-show-content-main-item {
    box-sizing: border-box;
    margin-right: 20px;
    padding: 10px;
    width: 250px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: var(--light-option-second-bgc);
}

.time-class-show-content-main-item>.class-item {
    margin-bottom: 10px;
    width: 100%;
    height: 100px;
    font-size: 25px;
    font-weight: 500;
    color: var(--light-font-color);
    text-align: center;
    line-height: 100px;
    border-radius: 10px;
    user-select: none;
}

.time-class-show-content-main-item>.class-item:hover {
    cursor: pointer;
}

.color-1 {
    background-color: rgba(255, 0, 0, 0.598);
}

.color-2 {
    background-color: rgba(0, 0, 255, 0.589);
}

.color-3 {
    background-color: rgba(0, 128, 0, 0.616);
}

.color-4 {
    background-color: rgba(255, 166, 0, 0.484);
}

.color-5 {
    background-color: rgba(128, 0, 128, 0.557);
}

.color-6 {
    background-color: rgba(255, 192, 203, 0.521);
}

.color-7 {
    background-color: rgba(255, 255, 0, 0.516);
}

.color-8 {
    background-color: rgba(242, 196, 234, 0.539);
}

.time-class-show-content-main-editor {
    display: flex;
    box-sizing: border-box;
    padding: 10px;
    width: calc(100% - 250px);
    height: 100%;
    overflow-x: auto;
    overflow-y: auto;
    background-color: var(--light-option-second-bgc);
}

.time-class-show-content-main-editor-time-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 130px;
    width: 200px;
    height: 100%;
    font-size: 25px;
    font-weight: 500;
    color: var(--light-font-color);
    text-align: center;
    line-height: 50px;
    user-select: none;
}

.time-class-show-content-main-editor-time-item>div {
    margin-bottom: 20px;
}


.time-class-show-content-main-editor>ul>li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0 20px;
    list-style: none;
    width: 100%;
    height: 120px;
    padding: 10px;
    background-color: var(--light-option-second-bgc);
}

#date-item>div {
    background-color: rgba(118, 118, 118, 0.427);
    user-select: none;
}

.time-class-show-content-main-editor>ul>li>div {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 200px;
    width: 200px;
    height: 100%;
    font-size: 25px;
    font-weight: 500;
    color: var(--light-font-color);
    border-radius: 10px;
    background-color: var(--light-option-bgc);
}

.time-class-show-content-main-editor>ul>li>div>div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    height: 80%;
    border-radius: 10px;
}


.drop-over {
    background-color: rgba(0, 0, 0, 0.696) !important;
}
</style>