<script setup lang="ts">
import { ref } from 'vue'
import TextEditor from '../components/TextEditor.vue'

const content = ref('')

const close = (): void => {
    window.electronAPI.closeScratchWindow()
}
</script>

<template>
    <div class="scratch" @dblclick.capture="close">
        <TextEditor v-model="content" language="plaintext" class="editor-wrap" />
    </div>
</template>

<style scoped>
.scratch {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    min-height: 0;
    background: var(--light-todo-editor-bgc, #fafafa);
}

.editor-wrap {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.editor-wrap :deep(.editor-container) {
    flex: 1;
    min-height: 0;
}
</style>
