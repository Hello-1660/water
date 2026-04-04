<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Extension } from '@tiptap/core'
import type { Editor, JSONContent } from '@tiptap/core'
import { Document } from '@tiptap/extension-document'
import { Text } from '@tiptap/extension-text'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { UndoRedo } from '@tiptap/extensions'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { Plugin, PluginKey, TextSelection, type EditorState, type Transaction } from '@tiptap/pm/state'
import type { Node as PMNode } from '@tiptap/pm/model'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import hljs from 'highlight.js'
import hljsGithubCss from 'highlight.js/styles/github.css?url'
import hljsGithubDarkCss from 'highlight.js/styles/github-dark.css?url'
import { all, createLowlight } from 'lowlight'
import { useSettingStore } from '../stores/settingStore'

const props = withDefaults(
  defineProps<{
    language?: string
    fileData?: unknown
    modelValue?: string
  }>(),
  {
    language: 'plaintext',
    modelValue: '',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const settingStore = useSettingStore()
const { settingContent } = storeToRefs(settingStore)
const appIsDark = computed(() => Boolean(settingContent.value.setting.dark))

let syncingFromParent = false

const fontSize = ref(34)

/** 使用全量语法集，避免扩展名映射到未注册语言时无装饰、看起来像没高亮 */
const lowlight = createLowlight(all)

const CodeDocument = Document.extend({
  content: 'codeBlock',
})

let hljsThemeLink: HTMLLinkElement | null = null

function attachHljsTheme(dark: boolean) {
  hljsThemeLink?.remove()
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = dark ? hljsGithubDarkCss : hljsGithubCss
  document.head.appendChild(link)
  hljsThemeLink = link
}

onMounted(() => {
  attachHljsTheme(appIsDark.value)
})
watch(appIsDark, (dark) => attachHljsTheme(dark))
onUnmounted(() => hljsThemeLink?.remove())

function resolveHljsLanguage(lang: string): string {
  return hljs.getLanguage(lang) ? lang : 'plaintext'
}

function buildDoc(text: string, lang: string): JSONContent {
  const language = resolveHljsLanguage(lang)
  return {
    type: 'doc',
    content: [
      {
        type: 'codeBlock',
        attrs: { language },
        content: text ? [{ type: 'text', text }] : [],
      },
    ],
  }
}

function getCodeTextFromEditor(ed: Editor): string {
  const first = ed.state.doc.firstChild
  if (!first || first.type.name !== 'codeBlock') return ''
  return first.textContent
}

function getCodeLanguage(ed: Editor): string | null {
  const first = ed.state.doc.firstChild
  if (!first || first.type.name !== 'codeBlock') return null
  return (first.attrs.language as string) ?? null
}

function applyParentContent(ed: Editor, text: string, lang: string) {
  syncingFromParent = true
  ed.commands.setContent(buildDoc(text, lang), { emitUpdate: false })
  nextTick(() => {
    syncingFromParent = false
  })
}

function clipboardImageFiles(data: DataTransfer | null): File[] {
  if (!data) return []
  const out: File[] = []
  if (data.files?.length) {
    for (const f of Array.from(data.files)) {
      if (f.type.startsWith('image/')) out.push(f)
    }
  }
  if (out.length) return out
  const items = data.items
  if (!items?.length) return out
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i]
    if (item.kind !== 'file' || !item.type.startsWith('image/')) continue
    const f = item.getAsFile()
    if (f) out.push(f)
  }
  return out
}

const MD_DATA_IMAGE_RE = /!\[[^\]]*]\((data:image\/[^)]+)\)/g

function codeBlockContentBase(doc: PMNode): number | null {
  let base: number | null = null
  doc.descendants((node, pos) => {
    if (node.type.name === 'codeBlock') {
      base = pos + 1
      return false
    }
  })
  return base
}

function listMarkdownDataImageSpans(doc: PMNode): { from: number; to: number; src: string }[] {
  const base = codeBlockContentBase(doc)
  if (base == null) return []
  const first = doc.firstChild
  if (!first || first.type.name !== 'codeBlock') return []
  const text = first.textContent
  const spans: { from: number; to: number; src: string }[] = []
  let m: RegExpExecArray | null
  MD_DATA_IMAGE_RE.lastIndex = 0
  while ((m = MD_DATA_IMAGE_RE.exec(text)) !== null) {
    spans.push({
      from: base + m.index,
      to: base + m.index + m[0].length,
      src: m[1],
    })
  }
  return spans
}

function buildMarkdownDataImageDecorations(doc: PMNode): Decoration[] {
  const decos: Decoration[] = []
  for (const { from, to, src } of listMarkdownDataImageSpans(doc)) {
    decos.push(
      Decoration.inline(from, to, {
        class: 'tiptap-paste-img-md-hidden',
      })
    )
    // Widget 放在片段末尾，避免在 `from` 处与隐藏文本争抢光标映射
    decos.push(
      Decoration.widget(
        to,
        () => {
          const wrap = document.createElement('span')
          wrap.className = 'tiptap-paste-img-wrap'
          wrap.setAttribute('contenteditable', 'false')
          const img = document.createElement('img')
          img.src = src
          img.alt = ''
          img.draggable = false
          wrap.appendChild(img)
          return wrap
        },
        {
          key: `paste-img-${from}-${to}`,
          side: -1,
          ignoreSelection: true,
        }
      )
    )
  }
  return decos
}

/** 光标落在隐藏的 Markdown 片段内部时，移到片段之后，避免 caret 漂移/消失 */
function snapSelectionOutOfDataImages(state: EditorState): Transaction | null {
  const ranges = listMarkdownDataImageSpans(state.doc)
  if (!ranges.length) return null
  const sel = state.selection
  if (!(sel instanceof TextSelection)) return null

  const snap = (pos: number) => {
    for (const r of ranges) {
      if (pos > r.from && pos < r.to) return r.to
    }
    return pos
  }

  const na = snap(sel.anchor)
  const nh = snap(sel.head)
  if (na === sel.anchor && nh === sel.head) return null
  return state.tr.setSelection(TextSelection.create(state.doc, na, nh))
}

const markdownDataImagePreviewKey = new PluginKey('markdownDataImagePreview')

/**
 * 光标在 ![](data:...) 之后按 Backspace、在片段开头按 Delete 时整段删除。
 * （否则 data URL 极长，默认每次只删一个字符，表现为「删不掉图片」。）
 */
const MarkdownDataImageDeleteKeys = Extension.create({
  name: 'markdownDataImageDeleteKeys',
  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { state } = editor
        const sel = state.selection
        if (!sel.empty) return false
        const pos = sel.$from.pos
        for (const r of listMarkdownDataImageSpans(state.doc)) {
          if (pos === r.to) {
            return editor.chain().focus().deleteRange({ from: r.from, to: r.to }).run()
          }
        }
        return false
      },
      Delete: ({ editor }) => {
        const { state } = editor
        const sel = state.selection
        if (!sel.empty) return false
        const pos = sel.$from.pos
        for (const r of listMarkdownDataImageSpans(state.doc)) {
          if (pos === r.from) {
            return editor.chain().focus().deleteRange({ from: r.from, to: r.to }).run()
          }
        }
        return false
      },
    }
  },
})

/** 将 ![](data:...) 在编辑区渲染为图片，底层仍是 Markdown 纯文本 */
const MarkdownDataImagePreview = Extension.create({
  name: 'markdownDataImagePreview',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: markdownDataImagePreviewKey,
        state: {
          init(_, { doc }) {
            return DecorationSet.create(doc, buildMarkdownDataImageDecorations(doc))
          },
          apply(tr, old, _oldState, newState) {
            if (!tr.docChanged) return old.map(tr.mapping, tr.doc)
            return DecorationSet.create(
              newState.doc,
              buildMarkdownDataImageDecorations(newState.doc)
            )
          },
        },
        appendTransaction(_trs, _oldState, newState) {
          return snapSelectionOutOfDataImages(newState)
        },
        props: {
          decorations(state) {
            return markdownDataImagePreviewKey.getState(state)
          },
        },
      }),
    ]
  },
})

/** 剪贴板图片 → 插入 Markdown 图片（data URL），文件仍为纯文本 */
const PasteImageAsMarkdown = Extension.create({
  name: 'pasteImageAsMarkdown',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('pasteImageAsMarkdown'),
        props: {
          handlePaste(view, event) {
            const images = clipboardImageFiles(event.clipboardData)
            if (!images.length) return false
            event.preventDefault()
            const { state } = view
            const insertAt = { from: state.selection.from, to: state.selection.to }
            const insertAll = (urls: string[]) => {
              const md = urls.map((u) => `![image](${u})`).join('\n')
              const next = view.state
              const tr = next.tr.insertText(md, insertAt.from, insertAt.to)
              view.dispatch(tr)
            }
            if (images.length === 1) {
              const r = new FileReader()
              r.onload = () => insertAll([r.result as string])
              r.readAsDataURL(images[0])
            } else {
              let done = 0
              const urls: string[] = new Array(images.length)
              images.forEach((file, i) => {
                const r = new FileReader()
                r.onload = () => {
                  urls[i] = r.result as string
                  done += 1
                  if (done === images.length) insertAll(urls)
                }
                r.readAsDataURL(file)
              })
            }
            return true
          },
        },
      }),
    ]
  },
})

/**
 * Electron 等环境常默认把 Tab 交给焦点环；先 preventDefault，再用高优先级执行缩进。
 * （与 CodeBlock 内置逻辑一致，避免被其它扩展抢先返回 false。）
 */
const TAB_SIZE = 2

const CodeBlockTabBindings = Extension.create({
  name: 'codeBlockTabBindings',
  priority: 10000,
  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        const { state } = editor
        const { selection } = state
        const { $from, empty } = selection
        const cb = state.schema.nodes.codeBlock
        if (!cb || $from.parent.type !== cb) return false
        const indent = ' '.repeat(TAB_SIZE)
        if (empty) {
          return editor.chain().focus().insertContent(indent).run()
        }
        return editor.commands.command(({ tr }) => {
          const { from, to } = selection
          const text = state.doc.textBetween(from, to, '\n', '\n')
          const lines = text.split('\n')
          const indentedText = lines.map((line) => indent + line).join('\n')
          tr.replaceWith(from, to, state.schema.text(indentedText))
          return true
        })
      },
      'Shift-Tab': ({ editor }) => {
        const { state } = editor
        const { selection } = state
        const { $from, empty } = selection
        const cb = state.schema.nodes.codeBlock
        if (!cb || $from.parent.type !== cb) return false
        if (empty) {
          return editor.commands.command(({ tr }) => {
            const { pos } = $from
            const codeBlockStart = $from.start()
            const codeBlockEnd = $from.end()
            const allText = state.doc.textBetween(codeBlockStart, codeBlockEnd, '\n', '\n')
            const lines = allText.split('\n')
            let currentLineIndex = 0
            let charCount = 0
            const relativeCursorPos = pos - codeBlockStart
            for (let i = 0; i < lines.length; i += 1) {
              if (charCount + lines[i].length >= relativeCursorPos) {
                currentLineIndex = i
                break
              }
              charCount += lines[i].length + 1
            }
            const currentLine = lines[currentLineIndex]
            const leadingSpaces = currentLine.match(/^ */)?.[0] ?? ''
            const spacesToRemove = Math.min(leadingSpaces.length, TAB_SIZE)
            if (spacesToRemove === 0) return true
            let lineStartPos = codeBlockStart
            for (let i = 0; i < currentLineIndex; i += 1) {
              lineStartPos += lines[i].length + 1
            }
            tr.delete(lineStartPos, lineStartPos + spacesToRemove)
            const cursorPosInLine = pos - lineStartPos
            if (cursorPosInLine <= spacesToRemove) {
              tr.setSelection(TextSelection.create(tr.doc, lineStartPos))
            }
            return true
          })
        }
        return editor.commands.command(({ tr }) => {
          const { from, to } = selection
          const text = state.doc.textBetween(from, to, '\n', '\n')
          const lines = text.split('\n')
          const reverseIndentText = lines
            .map((line) => {
              const leadingSpaces = line.match(/^ */)?.[0] ?? ''
              const spacesToRemove = Math.min(leadingSpaces.length, TAB_SIZE)
              return line.slice(spacesToRemove)
            })
            .join('\n')
          tr.replaceWith(from, to, state.schema.text(reverseIndentText))
          return true
        })
      },
    }
  },
})

const FontZoomKeys = Extension.create({
  name: 'fontZoomKeys',
  addKeyboardShortcuts() {
    return {
      'Mod-Equal': () => {
        fontSize.value = Math.min(120, fontSize.value + 5)
        return true
      },
      'Mod-NumpadAdd': () => {
        fontSize.value = Math.min(120, fontSize.value + 5)
        return true
      },
      'Mod-Minus': () => {
        if (fontSize.value > 20) fontSize.value -= 5
        return true
      },
      'Mod-NumpadSubtract': () => {
        if (fontSize.value > 20) fontSize.value -= 5
        return true
      },
      'Mod-0': () => {
        fontSize.value = 34
        return true
      },
      'Mod-Numpad0': () => {
        fontSize.value = 34
        return true
      },
    }
  },
})

const editor = useEditor({
  extensions: [
    CodeDocument,
    Text,
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: 'plaintext',
      enableTabIndentation: true,
      tabSize: TAB_SIZE,
      exitOnTripleEnter: false,
      exitOnArrowDown: false,
      HTMLAttributes: {
        class: 'hljs',
      },
    }),
    UndoRedo,
    MarkdownDataImagePreview,
    MarkdownDataImageDeleteKeys,
    PasteImageAsMarkdown,
    CodeBlockTabBindings,
    FontZoomKeys,
  ],
  content: buildDoc('', 'plaintext'),
  editorProps: {
    attributes: {
      class: 'tiptap-editor-inner',
      spellcheck: 'false',
    },
    handleKeyDown(view, event) {
      const { state } = view
      const { $from } = state.selection
      const inCode = $from.parent.type.name === 'codeBlock'

      if (event.key === 'Tab') {
        if (!inCode) return false
        event.preventDefault()
        return false
      }

      if (event.key === 'Enter') {
        if (!inCode) return false
        event.preventDefault()
        const blockStart = $from.start()
        const before = state.doc.textBetween(blockStart, $from.pos, '\n', '\n')
        const lines = before.split('\n')
        const line = lines[lines.length - 1] ?? ''
        const indent = (line.match(/^[\t ]*/) ?? [''])[0]
        const ins = event.shiftKey ? '\n' : '\n' + indent
        const { from, to } = state.selection
        view.dispatch(state.tr.insertText(ins, from, to))
        return true
      }

      return false
    },
  },
  onCreate({ editor: ed }) {
    applyParentContent(ed, props.modelValue, props.language)
  },
  onUpdate({ editor: ed }) {
    if (syncingFromParent) return
    emit('update:modelValue', getCodeTextFromEditor(ed))
  },
})

watch(
  () => [editor.value, props.modelValue, props.language] as const,
  ([ed, v, lang]) => {
    if (!ed) return
    nextTick(() => {
      const cur = getCodeTextFromEditor(ed)
      const want = resolveHljsLanguage(lang)
      const have = getCodeLanguage(ed)
      if (cur === v && have === want) return
      applyParentContent(ed, v, lang)
    })
  },
  { flush: 'post' }
)
</script>

<template>
  <div class="editor-container" :style="{ fontSize: fontSize + 'px' }">
    <editor-content v-if="editor" :editor="editor" class="editor-content" />
  </div>
</template>

<style scoped>
.editor-container {
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: var(--light-todo-editor-bgc, #f9f9f9);
}

.editor-content {
  flex: 1;
  min-height: 0;
  overflow: auto;
  overflow-x: auto;
  /* 滚动条显隐时预留槽位，减轻整页轻微横向/重心跳动 */
  scrollbar-gutter: stable;
  background-color: var(--light-todo-editor-bgc, #f9f9f9);
}

/* ProseMirror 根节点：撑满滚动视口高度，避免仅 pre 有底色、下方留白异色 */
.editor-content :deep(.tiptap),
.editor-content :deep(.tiptap-editor-inner) {
  min-height: 100%;
  box-sizing: border-box;
}

.editor-content :deep(.tiptap-editor-inner) {
  padding: 10px 12px;
  outline: none;
  caret-color: var(--light-caret-color, #3d4a6b);
  background-color: var(--light-todo-editor-bgc, #f9f9f9);
  color: var(--light-font-color);
}

/* 勿对 pre/code 写 color:inherit，会压掉 github/github-dark 里各 token 的颜色 */
.editor-content :deep(.tiptap-editor-inner pre) {
  margin: 0;
  font-family: consolas, monospace;
  white-space: pre-wrap;
  word-break: break-word;
  background: transparent !important;
}

.editor-content :deep(.tiptap-editor-inner pre code) {
  font-family: inherit;
  font-size: inherit;
  line-height: 1.45;
  display: block;
  width: 100%;
  padding: 0;
  background: transparent !important;
}

.editor-content :deep(.tiptap-editor-inner pre.hljs),
.editor-content :deep(.tiptap-editor-inner .hljs) {
  background: transparent !important;
}

.editor-content :deep(.tiptap-editor-inner ::selection) {
  background-color: var(--light-item-bgc);
  color: var(--light-font-color);
}

/* 粘贴的 Markdown 图片：隐藏原文，由 widget 显示 <img> */
.editor-content :deep(.tiptap-paste-img-md-hidden) {
  display: none !important;
}

.editor-content :deep(.tiptap-paste-img-wrap) {
  display: block;
  margin: 0.4em 0;
  max-width: 100%;
  user-select: none;
}

.editor-content :deep(.tiptap-paste-img-wrap img) {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}
</style>
