<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
    extensions: [StarterKit],
    content: '',
})
</script>

<template>
    <div class="basic-editor">
        <editor-content :editor="editor" />
    </div>
</template>

<style scoped>
.basic-editor {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
}

:global(.tiptap) {
    min-height: 100%;
    padding: 12px 14px;
    box-sizing: border-box;
    outline: none;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: anywhere;
    line-height: 1.6;
    font-size: 24px;
}



:global(.tiptap section) {
    background-color: pink;
}

:global(.tiptap ::selection) {
    background: rgba(255, 77, 79, 0.22);
}
</style>
