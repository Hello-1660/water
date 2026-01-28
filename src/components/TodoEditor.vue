<script setup lang="ts">
import Todo from '../views/Todo.vue'
import TextEditor from './TextEditor.vue'
import Popup from './Popup.vue'
import { computed, ref, watch } from 'vue'

const TODODIR = 'todo'
const FILETYPE = 'txt'

const fileData = computed(() => {
    return {
        type: 'text',
        content: currentTodo.value.content
    }
})

interface Todo {
    name: string
    content: string
    endTime: string
}

const currentTodo = ref<Todo>({
    name: '',
    content: '',
    endTime: ''
})


const showEndTime = computed(() => {
    if (currentTodo.value.endTime === '') return ['', '', '']
    return currentTodo.value.endTime.split('T')[0].split('-')
})

const handleSave = (msg: any) => {
    if (msg.msg === 'success') {
        if (msg.data.text == '') return 

        isShowPopup.value = true
        fileData.value.content = msg.data.text
    }
}

const isShowStatic = ref(false)
const isShowYear = ref(false)



const emit = defineEmits(['saveTodo', 'deleteTodo'])

const saveTodo = (content: string, endTime: string) => {
    const data = endTime + "\r\n" + content
    window.electronAPI.saveFile(Date.now().toString(), FILETYPE, data, TODODIR)
    .then(data => emit('saveTodo', data))
}

const deleteTodo = (name: string) => {
    console.log(name)
    window.electronAPI.deleteFile(name + '.' + FILETYPE, TODODIR).then(
        data => {
            console.log(data)
            currentTodo.value = { name: '', content: '', endTime: '' }
            isShowStatic.value = false
            emit('deleteTodo', data)
        }
    )
}


const handleDelete = () => {
    isShowPopupDel.value = true
}

const prop = defineProps({
    todo: {
        type: Object as () => Todo,
        default: () => ({})
    }
})


watch(
    () => prop.todo,
    (newTodo) => {
        openTodo(newTodo)
    },
    { deep: true }
)



const openTodo = (content: Todo) => {
    currentTodo.value = content
    if (content.endTime !== '') {
        isShowStatic.value = true
    } else {
        isShowStatic.value = false
    }
} 


const isShowPopup = ref(false)
const selectEndTime = ref('')
const handleSavePopupSure = () => {
    saveTodo(fileData.value.content, selectEndTime.value)
    selectEndTime.value = ''
}



const isShowPopupDel = ref(false)
const handleSavePopupDel = () => { 
    deleteTodo(currentTodo.value.name)
}

</script>


<template>
    <div class="todo-editor">
        <Popup 
        width="500px"
        height="300px"
        v-model="isShowPopup"
        title="保存待办"
        @sure="handleSavePopupSure"
        >

        <label class="datetime-label" for="datetime">
            截止时间
            <input v-model="selectEndTime" id="datetime" class="datetime" type="datetime-local"></input>
        </label>
    
        <template #sure-text>
            确认
        </template>
        <template #close-text>
            取消
        </template>
    </Popup>


    <Popup 
        width="500px"
        height="210px"
        v-model="isShowPopupDel"
        title="永久删除待办"
        @sure="handleSavePopupDel"
        >

        <div class="msg">
            删除后不可恢复，确认删除吗？
        </div>
    
        <template #sure-text>
            确认
        </template>
        <template #close-text>
            取消
        </template>
    </Popup>


        <div class="todo-editor-main">
            <div v-show="isShowStatic" class="show">
                <div class="end-time-card" @click="isShowYear = !isShowYear">
                    <div v-show="!isShowYear" class="month-and-day">
                        <div class="day">
                            {{ showEndTime[2] }}
                        </div>

                        <div class="month">
                            {{ showEndTime[1] }}
                        </div>
                    </div>

                    <div v-show="isShowYear" class="year">
                        {{  showEndTime[0] }}
                    </div>
                </div>

                <div class="delete-btn" @click="handleDelete">
                   <svg t="1769254219486" class="delete-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10396">  <path d="M781.28 851.36a58.56 58.56 0 0 1-58.56 58.56H301.28a58.72 58.72 0 0 1-58.56-58.56V230.4h538.56z m-421.6-725.92a11.84 11.84 0 0 1 12-12h281.28a11.84 11.84 0 0 1 12 12V160H359.68zM956.8 160H734.72v-34.56a81.76 81.76 0 0 0-81.76-81.76H371.68a82.08 82.08 0 0 0-81.76 81.76V160H67.2a35.36 35.36 0 0 0 0 70.56h105.12v620.8a128.96 128.96 0 0 0 128.96 128.96h421.44a128.96 128.96 0 0 0 128.96-128.96V230.4H956.8a35.2 35.2 0 0 0 35.2-35.2 34.56 34.56 0 0 0-35.2-35.2zM512 804.16a35.2 35.2 0 0 0 35.2-35.36V393.92a35.2 35.2 0 1 0-70.4 0V768.8a35.2 35.2 0 0 0 35.2 35.36m-164.32 0a35.36 35.36 0 0 0 35.36-35.36V393.92a35.36 35.36 0 1 0-70.56 0V768.8a36.32 36.32 0 0 0 35.2 35.36m328.64 0a35.36 35.36 0 0 0 35.2-35.36V393.92a35.36 35.36 0 1 0-70.56 0V768.8a35.36 35.36 0 0 0 35.36 35.36"p-id="10397"></path> </svg> </div>
            </div>

            <div class="edit">
                <TextEditor 
                :fileData="fileData"
                @save="handleSave"
                />
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

.datetime-label {
    font-size: 24px;
}

.datetime {
    width: 280px;
    height: 44px;
    padding: 0 14px;
    margin-left: 10px;
    margin-top: 40px;
    font-family: 'Microsoft YaHei';
    font-size: 24px;
    color: #1f2937;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),inset 0 1px 0 rgba(255, 255, 255, 0.6);
    outline: none;
    transition: all 0.25s ease;
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(8px);
    user-select: none;
}

.datetime:hover {
    border-color: #c7d2fe;
}

.datetime:focus {
    border-color: #6366f1;
    box-shadow:0 0 0 3px rgba(99, 102, 241, 0.25),0 4px 10px rgba(99, 102, 241, 0.15);
}

.datetime::-webkit-datetime-edit {
    color: inherit;
}

.datetime::-webkit-calendar-picker-indicator {
    opacity: 0.6;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.datetime::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
}


.msg {
    font-size: 24px;
}

.todo-editor { 
    width: 100%;
    height: 100%;
    padding: 20px;
    border-radius: 20px;
    background-color: var(--light-todo-editor-bgc);
    color: var(--light-font-color);
}


.todo-editor:hover {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}


.todo-editor-main {
    width: 100%;
    height: 100%;
}


.todo-editor-main>.show {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 30%;
    border-radius: 20px;
}

.show>.end-time-card {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
    border-radius: 20px;
    cursor: pointer;
    user-select: none;
}

.show>.end-time-card:hover {
    background-color: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.show>.end-time-card>div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 50px;
}

.month-and-day>.day {
    font-size: 70px;
    font-weight: 700;
}

.show>.delete-btn {
    display: flex;  
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 150px;
    border-radius: 30px;
    cursor: pointer;
}   


.delete-icon {
    width: 60%;
    height: 60%;
    fill: var(--light-svg-main-fill);
}

.delete-icon:hover {
    fill: var(--light-svg-main-hover-fill);
}

.todo-editor-main>.edit {
    width: 100%;
    height: 70%;
}
</style>