<script setup lang="ts">
import Top from '../components/Top.vue'
import TextEditor from '../components/TextEditor.vue'
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
        <div class="top">
            <Top />
        </div>

        <button @click="updateTheme">11111</button>

        <div class="main">
            <div class="option">

            </div>

            <div class="editor">
                <TextEditor 
                    :theme="theme" 
                    @save="handleSave"
                    @data="handleData" 
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.sticky-note {
    display: flex;
    flex-direction: column;
    justify-content: start;
    height: 100%;
    width: 100%;
}

.main {
    flex: 1;
    display: flex;
    justify-content: start;
    align-items: start;
    min-height: 0;
    height: 100%;
}

.main>.option {
    flex: 0.2;
    height: 100%;
    min-height: 0;
    background-color: yellow;
}

.main>.editor {
    flex: 0.8;
    min-height: 0;
    height: 100%;
}
</style>