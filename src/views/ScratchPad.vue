<script setup lang="ts">
import { ref } from 'vue'
import TextEditor from '../components/TextEditor.vue'

const content = ref('')

const close = (): void => {
    window.electronAPI.closeScratchWindow()
}
</script>

<template>
    <div class="scratch">
        <!-- drag 区域收不到点击/双击，中间标题与关闭按钮用 no-drag -->
        <header class="scratch-title-bar">
            <div class="scratch-drag-zone scratch-drag-zone--grow" aria-hidden="true" />
            <span
                class="scratch-title-hit"
                title="双击关闭"
                @dblclick.prevent="close"
            >便笺</span>
            <div class="scratch-drag-zone scratch-drag-zone--grow" aria-hidden="true" />
            <button
                type="button"
                class="scratch-close"
                title="关闭"
                aria-label="关闭"
                @click="close"
            >×</button>
        </header>
        <div class="scratch-body">
            <TextEditor v-model="content" language="plaintext" class="editor-wrap" />
        </div>
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
    -webkit-app-region: no-drag;
}

/* 无边框窗口：两侧为 drag；中间/按钮为 no-drag（否则双击无法进渲染进程） */
.scratch-title-bar {
    flex-shrink: 0;
    display: flex;
    align-items: stretch;
    height: 36px;
    border-bottom: 1px solid var(--light-option-second-bgc, #e0e0e0);
    background: var(--light-second-bgc, #ececec);
    color: var(--light-font-second-color, #626262);
    font-size: 13px;
    user-select: none;
}

.scratch-drag-zone {
    -webkit-app-region: drag;
    cursor: default;
    min-width: 20px;
}

.scratch-drag-zone--grow {
    flex: 1;
    min-width: 0;
}

.scratch-title-hit {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 0 14px;
    letter-spacing: 0.04em;
    cursor: default;
    -webkit-app-region: no-drag;
}

.scratch-close {
    flex-shrink: 0;
    width: 40px;
    border: none;
    margin: 0;
    padding: 0;
    font-size: 22px;
    line-height: 1;
    color: inherit;
    background: transparent;
    cursor: pointer;
    -webkit-app-region: no-drag;
}

.scratch-close:hover {
    background: rgba(0, 0, 0, 0.06);
    color: var(--light-font-color, #262626);
}

.scratch-body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    -webkit-app-region: no-drag;
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
