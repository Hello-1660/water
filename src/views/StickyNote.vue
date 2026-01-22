<script setup lang="ts">
import TextEditor from '../components/TextEditor.vue'
import Button from '../components/Button.vue'
import { ref } from 'vue'

const theme = ref('light')

const updateTheme = () => {
    if (theme.value === 'light') {
        theme.value = 'dark'
    } else {
        theme.value = 'light'
    }
}

const handleSave = (data: any) => {
    console.log('保存成功：', data)
}

const handleData = (data: any) => {
    console.log('数据：', data)
}

</script>


<template>
    <div class="sticky-note">
        <div class="btn">
            <Button>按钮</Button>
        </div>
        <div class="editor">
            <TextEditor 
                :theme="theme" 
                @save="handleSave"
                @data="handleData" 
            />
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

.btn {
    height: 10%;
    display: flex;
    /* justify-content: flex-end; */
    /* align-items: center; */
    background-color: pink;
}



.editor {
    height: 90%;
    min-height: 0;
}
</style>