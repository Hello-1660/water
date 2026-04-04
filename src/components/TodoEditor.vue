<script setup lang="ts">
import TextEditor from './TextEditor.vue'
import Popup from './Popup.vue'
import type { Todo } from './TodoList.vue'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const TODODIR = 'todo'
const FILETYPE_NEW = 'html'

const props = defineProps<{
    todo: Todo
}>()

const emit = defineEmits<{
    saveTodo: [ok: boolean]
    deleteTodo: [ok: boolean]
}>()

const currentTodo = ref<Todo>({
    name: '',
    content: '',
    endTime: '',
    ext: FILETYPE_NEW,
})

const baseline = ref<Todo>({ name: '', content: '', endTime: '', ext: FILETYPE_NEW })

const isDirty = computed(() => {
    return (
        currentTodo.value.content !== baseline.value.content ||
        currentTodo.value.endTime !== baseline.value.endTime
    )
})

const showEndTime = computed(() => {
    if (currentTodo.value.endTime === '') return ['', '', '']
    return currentTodo.value.endTime.split('T')[0].split('-')
})

const isShowStatic = ref(false)
const isShowYear = ref(false)

function syncBaseline() {
    baseline.value = {
        name: currentTodo.value.name,
        content: currentTodo.value.content,
        endTime: currentTodo.value.endTime,
        ext: currentTodo.value.ext || FILETYPE_NEW,
    }
}

function openTodo(content: Todo) {
    currentTodo.value = {
        name: content.name,
        content: content.content,
        endTime: content.endTime,
        ext: content.ext || FILETYPE_NEW,
    }
    syncBaseline()
    isShowStatic.value = content.endTime !== ''
}

watch(
    () => props.todo,
    (v) => openTodo({ ...v }),
    { deep: true, immediate: true }
)

const saveTodo = (content: string, endTime: string) => {
    const data = `${endTime}\r\n${content}`
    const isNew = !currentTodo.value.name
    const fileName = isNew ? Date.now().toString() : currentTodo.value.name
    const ext = isNew ? FILETYPE_NEW : currentTodo.value.ext || FILETYPE_NEW

    window.electronAPI
        .saveFile(fileName, ext, data, TODODIR)
        .then((ok) => {
            if (ok) {
                currentTodo.value.content = content
                currentTodo.value.endTime = endTime
                currentTodo.value.name = fileName
                currentTodo.value.ext = ext
                syncBaseline()
                isShowStatic.value = endTime !== ''
            }
            emit('saveTodo', ok)
        })
        .catch(() => emit('saveTodo', false))
}

const deleteTodo = (name: string, ext: string) => {
    const t = ext || FILETYPE_NEW
    window.electronAPI
        .deleteFile(`${name}.${t}`, TODODIR)
        .then((data) => {
            currentTodo.value = { name: '', content: '', endTime: '', ext: FILETYPE_NEW }
            syncBaseline()
            isShowStatic.value = false
            emit('deleteTodo', data)
        })
        .catch(() => emit('deleteTodo', false))
}

const handleDelete = () => {
    isShowPopupDel.value = true
}

const isShowPopup = ref(false)
const isShowPopupDel = ref(false)
const selectEndTime = ref('')
const saveError = ref('')

const openSavePopup = () => {
    saveError.value = ''
    selectEndTime.value = currentTodo.value.endTime || ''
    isShowPopup.value = true
}

const handleSavePopupSure = () => {
    if (!selectEndTime.value.trim()) {
        saveError.value = '请选择截止时间'
        nextTick(() => {
            isShowPopup.value = true
        })
        return
    }
    saveError.value = ''
    saveTodo(currentTodo.value.content, selectEndTime.value)
    selectEndTime.value = ''
}

/** Ctrl+S / Cmd+S：已有截止时间则直接保存，否则打开保存弹窗 */
function triggerQuickSave() {
    if (isShowPopup.value || isShowPopupDel.value) return
    if (currentTodo.value.endTime.trim()) {
        saveTodo(currentTodo.value.content, currentTodo.value.endTime)
    } else {
        openSavePopup()
    }
}

function onGlobalKeydown(e: KeyboardEvent) {
    if (!(e.ctrlKey || e.metaKey) || e.key !== 's') return
    e.preventDefault()
    triggerQuickSave()
}

onMounted(() => {
    document.addEventListener('keydown', onGlobalKeydown, true)
})
onUnmounted(() => {
    document.removeEventListener('keydown', onGlobalKeydown, true)
})

const handleSavePopupDel = () => {
    if (!currentTodo.value.name) {
        isShowPopupDel.value = false
        return
    }
    deleteTodo(currentTodo.value.name, currentTodo.value.ext || FILETYPE_NEW)
}
</script>

<template>
    <div class="todo-editor">
        <Popup
            width="500px"
            height="300px"
            v-model="isShowPopup"
            title="保存待办"
            @sure="handleSavePopupSure"
        >
            <label class="datetime-label" for="datetime">
                截止时间
                <input
                    v-model="selectEndTime"
                    id="datetime"
                    class="datetime"
                    type="datetime-local"
                />
            </label>
            <p v-if="saveError" class="save-error">{{ saveError }}</p>

            <template #sure-text>确认</template>
            <template #close-text>取消</template>
        </Popup>

        <Popup
            width="500px"
            height="210px"
            v-model="isShowPopupDel"
            title="永久删除待办"
            @sure="handleSavePopupDel"
        >
            <div class="msg">删除后不可恢复，确认删除吗？</div>

            <template #sure-text>确认</template>
            <template #close-text>取消</template>
        </Popup>

        <div class="todo-editor-main">
            <div class="toolbar">
                <button type="button" class="btn-save" @click="openSavePopup">保存</button>
                <span v-if="isDirty" class="dirty-hint">未保存</span>
                <span v-else-if="currentTodo.name" class="saved-hint">已保存</span>
            </div>

            <div v-show="isShowStatic" class="show">
                <div class="end-time-card" @click="isShowYear = !isShowYear">
                    <div v-show="!isShowYear" class="month-and-day">
                        <div class="day">
                            {{ showEndTime[2] }}
                        </div>

                        <div class="month">
                            {{ showEndTime[1] }}
                        </div>
                    </div>

                    <div v-show="isShowYear" class="year">
                        {{ showEndTime[0] }}
                    </div>
                </div>

                <div class="delete-btn" @click="handleDelete">
                    <svg
                        t="1769254219486"
                        class="delete-icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="10396"
                    >
                        <path
                            d="M781.28 851.36a58.56 58.56 0 0 1-58.56 58.56H301.28a58.72 58.72 0 0 1-58.56-58.56V230.4h538.56z m-421.6-725.92a11.84 11.84 0 0 1 12-12h281.28a11.84 11.84 0 0 1 12 12V160H359.68zM956.8 160H734.72v-34.56a81.76 81.76 0 0 0-81.76-81.76H371.68a82.08 82.08 0 0 0-81.76 81.76V160H67.2a35.36 35.36 0 0 0 0 70.56h105.12v620.8a128.96 128.96 0 0 0 128.96 128.96h421.44a128.96 128.96 0 0 0 128.96-128.96V230.4H956.8a35.2 35.2 0 0 0 35.2-35.2 34.56 34.56 0 0 0-35.2-35.2zM512 804.16a35.2 35.2 0 0 0 35.2-35.36V393.92a35.2 35.2 0 1 0-70.4 0V768.8a35.2 35.2 0 0 0 35.2 35.36m-164.32 0a35.36 35.36 0 0 0 35.36-35.36V393.92a35.36 35.36 0 1 0-70.56 0V768.8a36.32 36.32 0 0 0 35.2 35.36m328.64 0a35.36 35.36 0 0 0 35.2-35.36V393.92a35.36 35.36 0 1 0-70.56 0V768.8a35.36 35.36 0 0 0 35.36 35.36"
                            p-id="10397"
                        />
                    </svg>
                </div>
            </div>

            <div class="edit">
                <TextEditor v-model="currentTodo.content" language="html" />
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.save-error {
    margin-top: 12px;
    font-size: 20px;
    color: #c42b1c;
}

.toolbar {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 12px;
    min-height: 40px;
}

.btn-save {
    padding: 8px 22px;
    font-size: 22px;
    border-radius: 10px;
    border: 1px solid var(--light-option-second-bgc, #e0e0e0);
    background: var(--light-main-bgc, #f9f9f9);
    color: var(--light-font-color, #262626);
    cursor: pointer;
}

.btn-save:hover {
    background: var(--light-item-bgc, #f5f5f5);
}

.dirty-hint {
    font-size: 20px;
    color: #d97706;
}

.saved-hint {
    font-size: 20px;
    color: var(--light-font-second-color, #626262);
}

.datetime-label {
    font-size: 24px;
}

.datetime {
    width: 280px;
    height: 44px;
    padding: 0 14px;
    margin-left: 10px;
    margin-top: 40px;
    font-family: 'Microsoft YaHei';
    font-size: 24px;
    color: #1f2937;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
    outline: none;
    transition: all 0.25s ease;
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(8px);
    user-select: none;
}

.datetime:hover {
    border-color: #c7d2fe;
}

.datetime:focus {
    border-color: #6366f1;
    box-shadow:
        0 0 0 3px rgba(99, 102, 241, 0.25),
        0 4px 10px rgba(99, 102, 241, 0.15);
}

.datetime::-webkit-datetime-edit {
    color: inherit;
}

.datetime::-webkit-calendar-picker-indicator {
    opacity: 0.6;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.datetime::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
}

.msg {
    font-size: 24px;
}

.todo-editor {
    width: 100%;
    height: 100%;
    padding: 20px;
    border-radius: 20px;
    background-color: var(--light-todo-editor-bgc);
    color: var(--light-font-color);
}

.todo-editor:hover {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.todo-editor-main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.todo-editor-main > .show {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    flex-shrink: 0;
    min-height: 200px;
    max-height: 32%;
    border-radius: 20px;
}

.show > .end-time-card {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
    border-radius: 20px;
    cursor: pointer;
    user-select: none;
}

.show > .end-time-card:hover {
    background-color: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.show > .end-time-card > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 50px;
}

.month-and-day > .day {
    font-size: 70px;
    font-weight: 700;
}

.show > .delete-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 150px;
    border-radius: 30px;
    cursor: pointer;
}

.delete-icon {
    width: 60%;
    height: 60%;
    fill: var(--light-svg-main-fill);
}

.delete-icon:hover {
    fill: var(--light-svg-main-hover-fill);
}

.todo-editor-main > .edit {
    width: 100%;
    flex: 1;
    min-height: 0;
}
</style>
