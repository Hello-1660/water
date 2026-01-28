<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const TODODIR = 'todo'
const isShowTodoItemStatic = ref(false)

interface Todo {
    name: string
    content: string
    endTime: string
}

interface File {
    name: string
    type: string
}

const nameList = ref<File[]>()
const formatFile = (data: string) => {
    const index = data.indexOf('\n')
    const time = formatDateTimeLocal(data.substring(0, index).replace(/\r/g, ''))
    const content = data.substring(index + 1)

    return {
        time,
        content
    }
}

const todoList = ref<Todo[]>([])

const num2Time = (time: number) => {
    const totalSeconds = Math.floor(time / 1000) 
    const hour = Math.floor(totalSeconds / 3600)
    const day = Math.floor(totalSeconds / 86400)

    return [day, hour]
}

const time2Num = (str: string) => {
    const date = new Date(str)
    return date.getTime()
}



const formatTime = (begin: string, end: string) => {
    const beginTime = parseInt(begin, 10)
    const endTime = time2Num(end)

    const remainTime = endTime - beginTime

    return num2Time(remainTime)
}


const remainTime = (arr: number[]) => {
    if (arr[0] + arr[1] <= 0) {
        return '已结束'
    }

    if (arr[0] === 0) {
        return `还剩${arr[1]}小时结束`
    } else {
        if (arr[0] > 3) return ''

        return `还剩${arr[0]}天结束`
    }
}



const getTodoList = () => {
    window.electronAPI.openAllFiles(TODODIR).then(
        data => {
            nameList.value = data
            getTodoListMsg()
        }
    )
}


const getTodoListMsg = async () => {
    if (!nameList.value) return 
    
    todoList.value = []
    for (const item of nameList.value) {
        const content = await window.electronAPI.openFile((item.name + '.' + item.type), TODODIR)
        
        const data = formatFile(content)


        todoList.value.push({
            name: item.name,
            content: data.content,
            endTime: data.time
        })
    }

    console.log(todoList.value)
}


const formatDateTimeLocal = (time: string) => {

    const date = new Date(time)
        
    if (isNaN(date.getTime())) {
        return ''
    } else {
        return time
    }
}


onMounted(() => {
    if (document.documentElement.clientWidth > 1500) {
        isShowTodoItemStatic.value = true
    } else {            
        isShowTodoItemStatic.value = false
    }

    getTodoList()
})


const emit = defineEmits(['openTodo'])
const openTodo = (content: Todo) => {
    emit('openTodo', content)
}

const addTodo = () => {
    emit('openTodo', {
        name: '',
        content: '',
        endTime: ''
    })
}

defineExpose({
    getTodoList
})

window.addEventListener('resize', () => {
    if (document.documentElement.clientWidth > 1500) {
        isShowTodoItemStatic.value = true
    } else {            
        isShowTodoItemStatic.value = false
    }
})
</script>

<template>
    <div class="todo-list">
        <div class="todo-list-main">
            <div class="todo-list-main-title">
                <h1>Todo</h1>
                <div class="list-add" @click="addTodo">
                    <svg t="1769506704796" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5013"><path d="M910.02 462.14c27.48-0.12 49.85 22.05 49.97 49.53 0.12 26.2-20.11 48-46.24 49.85l-3.73 0.12H113.98c-27.48 0.12-49.86-22.05-49.98-49.53-0.12-26.2 20.11-48 46.24-49.85l3.73-0.12h796.05z" p-id="5014"></path><path d="M512 64.11c26.04-0.01 47.68 20.06 49.63 46.02l0.12 3.73v796.05c0.12 27.48-22.05 49.85-49.53 49.98-26.2 0.12-48-20.11-49.85-46.24l-0.12-3.73V113.86c0-27.47 22.27-49.75 49.75-49.75z" p-id="5015"></path></svg>
                </div>
            </div>

            <div class="list">
                <div class="list-item" v-for="item in todoList" :key="item.name" @click="openTodo(item)">
                    <div class="point"></div>
                    <div class="content">
                        {{ item.content }}
                    </div>

                    <div class="static" v-show="isShowTodoItemStatic">
                        <div class="static-time">
                            {{ remainTime(formatTime(item.name, item.endTime)) }}
                        </div>
                    </div>
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

.todo-list {
    width: 100%;
    height: 100%;
    padding: 20px;
    border-radius: 12px;
    user-select: none;
    background-color: var(--light-todo-bgc);
}

.todo-list>.todo-list-main {
    width: 100%;
    height: 100%;
}


.todo-list>.todo-list-main>.todo-list-main-title {
    display: flex;
    align-items: center;
    font-size: 60px;
    width: 100%;
    height: 70px;
    color: var(--light-font-second-color);
    margin-bottom: 40px;
}

.todo-list-main-title>h1 {
    width: 60%;
    height: 100%;
    font-size: 60px;
}

.todo-list-main-title>.list-add {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 40%;
    height: 100%;
    cursor: pointer;
}

.todo-list-main-title>.list-add:hover >svg {
    fill: var(--light-svg-hover-fill);
}

.todo-list-main-title>.list-add>svg {
    width: 60%;
    height: 80%;
    fill: var(--light-svg-fill);
}

.todo-list>.todo-list-main>.list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: calc(100% - 110px);
    overflow-y: auto;
    overflow-x: hidden;
}

.todo-list>.todo-list-main>.list>.list-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 30px;
    color: var(--light-font-color);
    margin-bottom: 5px;
    border-bottom: 2px solid #7a75755f;
    cursor: pointer;
}

.list-item>.point {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: rgb(100, 100, 100);
}

.list-item>.content {
    flex: 1;
    width: 100%;
    height: 100%;
    padding-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis; 
    white-space: nowrap; 
    margin-bottom: 10px;
}

.list-item>.static {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 100%;
}

.static>.static-time {
    color: orange;
}
</style>