<script setup lang="ts">
import TodoList from '../components/TodoList.vue'
import TodoEditor from '../components/TodoEditor.vue'
import { ref } from 'vue'

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
        console.log('refresh')
        todoList.value?.getTodoList()
    }
}

</script>


<template>
    <div class="container">
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