<script setup lang="ts">
import TodoList from '../components/TodoList.vue'
import TodoEditor from '../components/TodoEditor.vue'
import { ref, nextTick } from 'vue'

interface Todo {
    name: string,
    content: string,
    endTime: string
}

const currentTodo = ref<Todo>({ name: '', content: '', endTime: '' })


const handleOpenTodo = (data: Todo) => {
    currentTodo.value = data
}


const todoList = ref<InstanceType<typeof TodoList> | null>(null)

const handleSaveTodo = (data: boolean) => {
    if (data) {
        const msg = data ? '保存成功' : '保存失败'
        setResultPopup(msg, data)
        todoList.value?.getTodoList()
    }
}


const handelDelTodo = (data: boolean) => {
    if (data) {
        const msg = data ? '删除成功' : '删除失败'
        setResultPopup(msg, data)
        todoList.value?.getTodoList()
    }
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
        isShowResultPopup.value = false;
    }, 2500)
}
</script>


<template>
    <div class="container">
        <div :id="resultColor ? 'green' : 'red'"  class="popup-container" :class="{'tip' : isShowResultPopup}" v-if="isShowResultPopup">
            <div class="img"></div>
            <div class="content">{{ resultPopupContent }}</div>
        </div>

         <div class="todo-main">
            <div class="main-show">
                <TodoList  ref="todoList"
                @open-todo="handleOpenTodo"
                />
            </div>

            <div class="main-control">
                <TodoEditor 
                :todo="currentTodo"
                @save-todo="handleSaveTodo"
                @delete-todo="handelDelTodo"
                />
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

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
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

.todo-main {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 80%;
    height: 80%;
}


.todo-main>.main-show {
    height: 100%;
    width: 40%;
    background-color: #f2faff;
    border-radius: 12px;
}


.todo-main>.main-control {
    height: 100%;
    width: 40%;
    border-radius: 12px;    
}

</style>