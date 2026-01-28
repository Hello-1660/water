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
    },
    fileData: {
        type: Object as () => {
            content?: string,
            type?: string
        },
        default: () => ({ content: '', type: 'html' })
    }
})

const emit = defineEmits(['save'])



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


watch(
    () => props.theme,
    (newTheme) => {
        activeTheme.value = newTheme
    },
    { immediate: true }
)


const basicEditor = ref<HTMLDivElement | undefined>()
const editorVar = ref<InstanceType<typeof EditorContent> | undefined>()

const updateFontSizeCssVar = () => {
    if (!basicEditor.value) return  
    basicEditor.value.style.setProperty('--editor-font-size', `${fontSize.value}px`)
}

const updateThemeCssVars = () => {
    const current = activeTheme.value === 'light' ? theme.value.light : theme.value.dark
    // document.documentElement.style.setProperty('--editor-color', current.color)
    // document.documentElement.style.setProperty('--editor-caret-color', current.caretColor)
    
    if (basicEditor.value) {
        if (activeTheme.value === 'light') {
            basicEditor.value.classList.remove('dark')
        } else {
            basicEditor.value.classList.add('dark')
        }
    }
    
    if (editorVar.value) {
        if (activeTheme.value === 'light') {
            editorVar.value.$el.classList.remove('dark')
        } else {
            editorVar.value.$el.classList.add('dark')
        }
        
        editorVar.value.$el.documentElement.style.setProperty('--editor-selection-bg', current.selectionBackground)  
        editorVar.value.$el.documentElement.style.setProperty('--editor-bg', current.backGround)
    }
}

onMounted(() => {
    updateThemeCssVars()
    updateFontSizeCssVar()
})


watch([theme, activeTheme], updateThemeCssVars, { deep: true })

watch(
    () => props.fileData,
    (newFileData) => {
        if (newFileData) {
            setEditorContent(newFileData)
        }
    },
    { deep: true }
)

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

                const isAtDocEnd = $from.pos >= doc.content.size - 1
                const lineStart = $from.start()
                const lineText = state.doc.textBetween(lineStart, $from.pos)

                const indentMatch = lineText.match(/^[\s\u00A0]+/)
                const indent = indentMatch ? indentMatch[0] : ''

                if (this.editor.isActive('codeBlock')) {
                    return this.editor.commands.insertContent('\n' + indent)
                }

                if (isAtDocEnd) {
                    return this.editor.commands.insertContent('\n')
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


const setEditorContent = (fileData: { content?: string; type?: string }) => {
    if (editor.value && fileData.content === '') {
        editor.value.commands.setContent('')
    }

    if (!editor.value || !fileData?.content) return
    const { content, type = 'html' } = fileData

    try {
        let finalContent = ''
        if (type === 'json') {
            const parsedJson = JSON.parse(content)
            finalContent = JSON.stringify(parsedJson, null, 2)
        } else {
            finalContent = content
        }

        editor.value.commands.setContent(finalContent, {
            parseOptions: { preserveWhitespace: 'full' },
            emitUpdate: false
        })
    } catch (error) {
        editor.value.commands.setContent('')
    }
}

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
        
        emit('save', {
            msg : 'success',
            data: content
        })
    } catch (error) {
        emit('save', {
            msg : 'error',
            data: ''
        })
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
            console.log(view)
            // 这里可以监听全局按键
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault()
                handleSave()
                return true
            }
        }
    },
    onCreate: () => {
        if (props.fileData && props.fileData.content) {
            setEditorContent(props.fileData)
        }
    }
})





</script>

<template>
    <div class="basic-editor" ref="basicEditor">
        <editor-content :editor="editor" ref="editorVal"/>
    </div>
</template>

<style scoped>
.basic-editor {
    --editor-font-size: 30px;
    height: 100%;
    min-height: 0;
    background-color: fff;
    overflow-x: hidden;
    overflow-y: auto;
}


.dark {
    background-color: #27273a;
    color: #fff;
    caret-color: #fff;
}


:global(.tiptap) {
    --editor-selection-bg: #cddefb;
    min-height: 100%;
    padding: 12px 14px;
    outline: none;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: anywhere;
    font-family: 'Consolas', 'Microsoft YaHei', 'Courier New', monospace;
    letter-spacing: 0.5px;
    line-height: 1.6;
    font-size: var(--editor-font-size) !important;
}


:global(.tiptap section) {
    background-color: inherit !important;
}

:global(.tiptap ::selection) {
    background: var(--editor-selection-bg) !important;
}
</style>