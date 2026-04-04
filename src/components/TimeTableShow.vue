<script setup lang="ts">
import Popup from './Popup.vue'
import { ref, watch, nextTick, onUnmounted } from 'vue'

const props = defineProps<{
    htmlContent: string
    name: string
}>()

const emit = defineEmits<{
    close: []
    delete: [name: string]
    save: [payload: { name: string; html: string }]
}>()

const isShowPopup = ref(false)
const handlePopupSure = () => {
    emit('delete', props.name)
}

const mountEl = ref<HTMLElement | null>(null)

let abortCtl: AbortController | null = null
let dragSource: HTMLElement | null = null

function normalizeTime(s: string): string {
    const m = s.trim().match(/^(\d{1,2}):(\d{2})/)
    if (!m) return '00:00'
    return `${m[1].padStart(2, '0')}:${m[2]}`
}

function startEditPlainText(el: HTMLElement) {
    if (el.querySelector('input.inline-edit')) return
    const old = (el.textContent || '').trim()
    const input = document.createElement('input')
    input.type = 'text'
    input.className = 'inline-edit'
    input.value = old
    el.replaceChildren(input)
    input.focus()
    input.select()
    const finish = (cancel: boolean) => {
        el.textContent = cancel ? old : input.value.trim() || old
    }
    input.addEventListener('blur', () => finish(false), { once: true })
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
        if (e.key === 'Escape') {
            finish(true)
            ;(e.target as HTMLInputElement).blur()
        }
    })
}

function startEditTimeRange(el: HTMLElement) {
    if (el.querySelector('.inline-edit-time')) return
    const old = (el.textContent || '').trim()
    const parts = old.split(/\s*[-–—]\s*/).map((s) => s.trim())
    const a = parts[0] || '00:00'
    const b = parts[1] || '00:00'

    const wrap = document.createElement('span')
    wrap.className = 'inline-edit-time'

    const i1 = document.createElement('input')
    i1.type = 'time'
    i1.className = 'inline-edit'
    i1.value = normalizeTime(a)

    const sep = document.createElement('span')
    sep.textContent = ' — '

    const i2 = document.createElement('input')
    i2.type = 'time'
    i2.className = 'inline-edit'
    i2.value = normalizeTime(b)

    wrap.append(i1, sep, i2)
    el.replaceChildren(wrap)

    i1.focus()

    const commit = () => {
        el.textContent = `${i1.value} - ${i2.value}`
    }
    const onFocusOut = (e: FocusEvent) => {
        if (wrap.contains(e.relatedTarget as Node)) return
        wrap.removeEventListener('focusout', onFocusOut)
        commit()
    }
    wrap.addEventListener('focusout', onFocusOut)
    i2.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            commit()
            i2.blur()
        }
    })
}

function onDblClick(e: MouseEvent) {
    const t = e.target as HTMLElement
    if (!t || !mountEl.value?.contains(t)) return

    const classItem = t.closest('.class-item') as HTMLElement | null
    if (classItem && mountEl.value.contains(classItem)) {
        startEditPlainText(classItem)
        e.preventDefault()
        return
    }

    const slot = t.closest('.time-item-container') as HTMLElement | null
    if (slot) {
        const kids = [...slot.children]
        const idx = kids.indexOf(t as Element)
        if (idx === 0) {
            startEditPlainText(t)
            e.preventDefault()
            return
        }
        if (idx === 1) {
            startEditTimeRange(t as HTMLElement)
            e.preventDefault()
            return
        }
    }

    const dateItem = t.closest('#date-item') as HTMLElement | null
    if (dateItem && t !== dateItem && t.parentElement === dateItem) {
        startEditPlainText(t)
        e.preventDefault()
    }
}

function getDropNode(node: HTMLElement | null): HTMLElement | null {
    let n: HTMLElement | null = node
    while (n) {
        if (n.dataset?.drop) return n
        n = n.parentNode as HTMLElement | null
    }
    return null
}

function clearDropStyles(root: HTMLElement) {
    root.querySelectorAll('.drop-over').forEach((n) => n.classList.remove('drop-over'))
}

function bindDrag(root: HTMLElement, signal: AbortSignal) {
    root.addEventListener(
        'dragstart',
        (e: DragEvent) => {
            const el = e.target as HTMLElement
            if (!(el instanceof HTMLElement) || !el.classList.contains('class-item')) return
            dragSource = el
            if (e.dataTransfer) {
                e.dataTransfer.effectAllowed = (el.dataset.effect || 'copy') as DataTransfer['effectAllowed']
            }
        },
        { signal }
    )

    root.addEventListener('dragover', (e: DragEvent) => e.preventDefault(), { signal })

    root.addEventListener(
        'dragenter',
        (e: DragEvent) => {
            clearDropStyles(root)
            const dropNode = getDropNode(e.target as HTMLElement)
            if (!dropNode || !dragSource) return
            const srcEff = dragSource.dataset.effect
            const drop = dropNode.dataset.drop
            const ok =
                (srcEff === 'copy' && drop === 'copy') ||
                (srcEff === 'move' && drop === 'copy')
            if (ok) dropNode.classList.add('drop-over')
        },
        { signal }
    )

    root.addEventListener(
        'drop',
        (e: DragEvent) => {
            e.preventDefault()
            const dropNode = getDropNode(e.target as HTMLElement)
            if (!dropNode || !dragSource) {
                clearDropStyles(root)
                return
            }
            const srcEff = dragSource.dataset.effect
            const drop = dropNode.dataset.drop
            if (drop === 'copy' && srcEff === 'copy') {
                const cloned = dragSource.cloneNode(true) as HTMLElement
                cloned.dataset.effect = 'move'
                dropNode.replaceChildren(cloned)
            } else if (drop === 'copy' && srcEff === 'move') {
                dropNode.replaceChildren(dragSource)
            }
            dragSource = null
            clearDropStyles(root)
        },
        { signal }
    )

    root.addEventListener('dragend', () => {
        dragSource = null
        clearDropStyles(root)
    }, { signal })
}

function setupInteractions() {
    abortCtl?.abort()
    abortCtl = new AbortController()
    const { signal } = abortCtl
    const root = mountEl.value
    if (!root) return

    root.addEventListener('dblclick', onDblClick, { signal })
    bindDrag(root, signal)
}

watch(
    () => props.htmlContent,
    async () => {
        await nextTick()
        setupInteractions()
    },
    { immediate: true }
)

onUnmounted(() => {
    abortCtl?.abort()
})

function saveChanges() {
    const root = mountEl.value
    if (!root) return
    const first = root.firstElementChild as HTMLElement | null
    const html = first?.outerHTML ?? ''
    if (!html) return
    emit('save', { name: props.name, html })
}
</script>

<template>
    <div class="time-class-show">
        <div class="time-class-head-show">
            <Popup
                width="500px"
                height="250px"
                title="永久删除该表格"
                v-model="isShowPopup"
                @sure="handlePopupSure"
            >
                <h1 class="popup-tip">删除后该表格不可恢复，确认删除吗？</h1>
                <template #close-text>取消</template>
            </Popup>

            <div class="top">
                <div class="return" @click="emit('close')">
                    <svg
                        t="1769431872810"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="26120"
                    >
                        <path
                            d="M480 64C214.912 64 0 278.912 0 544c0 265.088 214.912 480 480 480 265.088 0 480-214.912 480-480 0-265.088-214.912-480-480-480z m85.12 649.024c12.48 12.48 12.48 32.768 0 45.248-6.272 6.272-14.464 9.344-22.656 9.344s-16.384-3.136-22.656-9.344L328.32 566.656c-12.48-12.48-12.48-32.768 0-45.248l192.768-192.832c12.48-12.48 32.768-12.48 45.248 0s12.48 32.768 0 45.248l-170.112 170.24 168.896 168.96z"
                            p-id="26121"
                        />
                    </svg>
                </div>

                <div class="top-actions">
                    <div class="action-btn save-btn" @click="saveChanges">保存修改</div>
                    <div class="action-btn del-btn" @click="isShowPopup = true">
                        <svg
                            t="1769695779738"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="24973"
                        >
                            <path
                                d="M798.1 872.6c0 34.3-27.9 62.2-62.1 62.2H288.1c-34.3-0.1-62.1-27.9-62.2-62.2V212.8h572.2v659.8zM350.2 101.2c0-7.2 5.6-12.8 12.8-12.8h298.8c7.2 0 12.7 5.6 12.7 12.8v37.5H350.2v-37.5z m634.3 37.5H748.7v-37.5c0-47.8-39-86.9-86.9-86.9H363c-47.9 0.1-86.8 38.9-86.9 86.9v37.5H39.5C18.7 138.7 2 155.4 2 176.1s16.7 37.5 37.5 37.5H151v659c0 75.7 61.4 137.1 137.1 137.1h447.8c75.7 0 137.1-61.4 137.1-137.1V212.8h111.6c20.7 0 37.5-16.7 37.5-37.5s-16.8-36.6-37.6-36.6zM512 822.4c20.7 0 37.5-16.7 37.5-37.5V386.5c0-20.7-16.7-37.5-37.5-37.5-20.7 0-37.5 16.7-37.5 37.5v398.4c0 20.7 16.8 37.5 37.5 37.5m-174.5 0c20.7 0 37.5-16.7 37.5-37.5V386.5c0-20.7-16.7-37.5-37.5-37.5-20.7 0-37.5 16.7-37.5 37.5v398.4c0.8 20.7 17.6 37.5 37.5 37.5m349 0c20.7 0 37.5-16.7 37.5-37.5V386.5c0-20.7-16.7-37.5-37.5-37.5-20.7 0-37.5 16.7-37.5 37.5v398.4c0.1 20.7 16.8 37.5 37.5 37.5"
                                p-id="24974"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <h1 class="title">{{ name }}</h1>
        </div>

        <div ref="mountEl" class="html-render-container" v-html="htmlContent"></div>
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.time-class-show {
    width: 100%;
    height: 100%;
    padding: 40px;
}

.time-class-head-show {
    height: auto;
    min-height: 18%;
}

.popup-tip {
    font-size: 25px;
}

.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 50%;
    height: 60px;
    margin-bottom: 20px;
}

.top > div {
    width: 50px;
    height: 100%;
}

.top-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    width: auto !important;
}

.action-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 90px;
    height: 44px;
    padding: 0 14px;
    border-radius: 10px;
    font-size: 18px;
    cursor: pointer;
    user-select: none;
    background-color: var(--light-option-second-bgc);
    color: var(--light-svg-main-fill);
}

.action-btn:hover {
    color: var(--light-svg-main-hover-fill);
}

.save-btn {
    width: auto !important;
}

.del-btn {
    width: 50px !important;
    min-width: 50px;
    padding: 0;
}

.del-btn svg {
    width: 28px;
    height: 28px;
    fill: currentColor;
}

.top svg {
    width: 100%;
    height: 100%;
    fill: var(--light-svg-main-fill);
}

.top svg:hover {
    fill: var(--light-svg-main-hover-fill);
    cursor: pointer;
}

.hint {
    font-size: 18px;
    color: var(--light-font-second-color);
    margin-bottom: 12px;
    margin-left: 0;
    max-width: 900px;
    line-height: 1.5;
}

.title {
    width: calc(100% - 225px);
    min-height: 56px;
    font-size: 40px;
    color: var(--light-font-color);
    margin-left: 0;
    margin-bottom: 16px;
}

.html-render-container {
    height: calc(82% - 40px);
    min-height: 280px;
    overflow: auto;
}

/* 与 TimeClassShow 编辑区对齐，v-html 无 scoped 属性需 :deep */
.html-render-container :deep(.time-class-show-content-main-editor) {
    display: flex;
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    min-height: 400px;
    overflow: auto;
    background-color: var(--light-option-second-bgc);
    border-radius: 12px;
}

.html-render-container :deep(.time-class-show-content-main-editor-time-item) {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 130px;
    width: 200px;
    flex-shrink: 0;
    font-size: 25px;
    font-weight: 500;
    color: var(--light-font-color);
    text-align: center;
    line-height: 50px;
    user-select: none;
}

.html-render-container :deep(.time-item-container) {
    margin-bottom: 20px;
}

.html-render-container :deep(.time-item-container > div) {
    cursor: text;
}

.html-render-container :deep(.time-class-show-content-main-editor > ul) {
    flex: 1;
    min-width: 0;
}

.html-render-container :deep(.time-class-show-content-main-editor > ul > li) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0 20px;
    list-style: none;
    width: 100%;
    min-height: 120px;
    padding: 10px;
    background-color: var(--light-option-second-bgc);
}

.html-render-container :deep(#date-item > div) {
    background-color: rgba(118, 118, 118, 0.427);
    user-select: none;
    cursor: text;
}

.html-render-container :deep(.time-class-show-content-main-editor > ul > li > div) {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 200px;
    width: 200px;
    min-height: 100px;
    font-size: 25px;
    font-weight: 500;
    color: var(--light-font-color);
    border-radius: 10px;
    background-color: var(--light-option-bgc);
}

.html-render-container :deep(.time-class-show-content-main-editor > ul > li > div > div) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    height: 80%;
    border-radius: 10px;
}

.html-render-container :deep(.class-item) {
    margin: 0 auto;
    width: 90%;
    min-height: 72px;
    font-size: 22px;
    font-weight: 500;
    color: var(--light-font-color);
    text-align: center;
    line-height: 1.3;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    user-select: none;
    cursor: grab;
}

.html-render-container :deep(.class-item:active) {
    cursor: grabbing;
}

.html-render-container :deep(.color-1) {
    background-color: rgba(255, 0, 0, 0.598);
}
.html-render-container :deep(.color-2) {
    background-color: rgba(0, 0, 255, 0.589);
}
.html-render-container :deep(.color-3) {
    background-color: rgba(0, 128, 0, 0.616);
}
.html-render-container :deep(.color-4) {
    background-color: rgba(255, 166, 0, 0.484);
}
.html-render-container :deep(.color-5) {
    background-color: rgba(128, 0, 128, 0.557);
}
.html-render-container :deep(.color-6) {
    background-color: rgba(255, 192, 203, 0.521);
}
.html-render-container :deep(.color-7) {
    background-color: rgba(255, 255, 0, 0.516);
}
.html-render-container :deep(.color-8) {
    background-color: rgba(242, 196, 234, 0.539);
}

.html-render-container :deep(.drop-over) {
    background-color: rgba(0, 0, 0, 0.35) !important;
    outline: 2px dashed var(--light-svg-main-fill);
}

.html-render-container :deep(input.inline-edit) {
    width: 90%;
    max-width: 180px;
    padding: 6px 8px;
    font-size: 20px;
    border-radius: 8px;
    border: 2px solid var(--light-option-second-bgc);
    background: var(--light-main-bgc);
    color: var(--light-font-color);
}

.html-render-container :deep(.inline-edit-time input.inline-edit) {
    width: 130px;
    max-width: 45%;
}
</style>
