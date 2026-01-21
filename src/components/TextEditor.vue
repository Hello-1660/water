<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { ref, onMounted, watch } from 'vue'
import { Extension } from '@tiptap/core'
import CodeBlock from '@tiptap/extension-code-block'


const fontSize = ref(30)
const lastKey = ref<string | null>(null)
const INDENT = '    '

const props = defineProps({
    theme: {
        type: String,
        default: 'light'
    }
})

const emit = defineEmits(['save', 'data'])



const theme = ref({
    light: {
        backGround: '#fff',
        color: '#000',
        caretColor: '#000',
        selectionBackground: '#cddefb',
    },
    dark: {
        backGround: '#27273a',
        color: '#fff',
        caretColor: '#fff',
        selectionBackground: '#4a6fa5',
    }
})


const activeTheme = ref(props.theme)
const editorInstance = ref<any>(null)


watch(
    () => props.theme,
    (newTheme) => {
        activeTheme.value = newTheme
    },
    { immediate: true }
)


const updateFontSizeCssVar = () => {
    document.documentElement.style.setProperty('--editor-font-size', `${fontSize.value}px`)
}

const updateThemeCssVars = () => {
    const current = activeTheme.value === 'light' ? theme.value.light : theme.value.dark
    document.documentElement.style.setProperty('--editor-bg', current.backGround)
    document.documentElement.style.setProperty('--editor-color', current.color)
    document.documentElement.style.setProperty('--editor-caret-color', current.caretColor)
    document.documentElement.style.setProperty('--editor-selection-bg', current.selectionBackground)
}

onMounted(() => {
    updateThemeCssVars()
    updateFontSizeCssVar()
})


watch([theme, activeTheme], updateThemeCssVars, { deep: true })

const TabBackspaceSmart = Extension.create({
    name: 'tabBackspaceSmart',

    addKeyboardShortcuts() {
        return {
            'Alt-=': () => {
                fontSize.value += 2
                updateFontSizeCssVar()
                return true
            },
            'Alt--': () => {
                fontSize.value = Math.max(12, fontSize.value - 2)
                updateFontSizeCssVar()
                return true
            },

            Tab: () => {
                lastKey.value = 'Tab'
                return this.editor.commands.insertContent(INDENT)
            },

            Backspace: () => {
                const { selection, doc } = this.editor.state
                const { from, empty } = selection
                if (!empty) return false

                const textBefore = doc.textBetween(from - INDENT.length, from)

                if (textBefore === INDENT) {
                    return this.editor.commands.deleteRange({ from: from - INDENT.length, to: from })
                }

                return false
            },

            Enter: () => {
                const { state } = this.editor
                const { selection } = state
                const { $from } = selection
                const doc = state.doc

                const isAtDocEnd = $from.pos >= doc.content.size - 2
                const lineStart = $from.start()
                const lineText = state.doc.textBetween(lineStart, $from.pos)

                const indentMatch = lineText.match(/^[\s\u00A0]+/)
                const indent = indentMatch ? indentMatch[0] : ''

                if (this.editor.isActive('codeBlock')) {
                    return this.editor.commands.insertContent('\n' + indent)
                }

                if (isAtDocEnd) {
                    return this.editor.commands.insertContent('\n' + indent)
                } else {
                    return this.editor.chain()
                        .splitBlock()
                        .insertContent(indent)
                        .run()
                }
            },

            'Mod+S': () => {
                console.log('save')
                handleSave() 
                return true 
            }
        }
    }
})

const getEditorContent = () => {
    if (!editor.value) return { html: '', text: '', json: '' }
    return {
        html: editor.value.getHTML(), 
        text: editor.value.getText(), 
        json: JSON.stringify(editor.value.getJSON()) 
    }
}

const handleSave = () => {
    try {
        const content = getEditorContent()
        
        emit('save', 'success')
        emit('data', content)
    } catch (error) {
        emit('save', (error as Error).message.toString())
        emit('data', { html: '', text: '', json: '' })
    }
}


const editor = useEditor({
    extensions: [
        StarterKit.configure({
            codeBlock: false
        }),
        CodeBlock,
        TabBackspaceSmart
    ],
    content: '',
    editorProps: {
        handleKeyDown: (view, event) => {
            // 这里可以监听全局按键
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault()
                handleSave()
                return true
            }
        }
    },
})





</script>

<template>
    <div class="basic-editor">
        <editor-content :editor="editor" />
    </div>
</template>

<style scoped>
/* 亮色主题 */
:root {
    --editor-font-size: 30px;
    --editor-bg: #fff;
    --editor-color: #000;
    --editor-caret-color: #000;
    --editor-selection-bg: #cddefb;
}

.basic-editor {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: var(--editor-bg);
}



:global(.tiptap) {
    min-height: 100%;
    padding: 12px 14px;
    box-sizing: border-box;
    outline: none;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: anywhere;
    font-family: 'Consolas', 'Microsoft YaHei', 'Courier New', monospace;
    letter-spacing: 0.5px;
    line-height: 1.6;
    caret-color: var(--editor-caret-color);
    color: var(--editor-color);
    font-size: var(--editor-font-size);
}

:global(.tiptap section) {
    background-color: inherit !important;
}

:global(.tiptap ::selection) {
    background: var(--editor-selection-bg) !important;
}
</style>