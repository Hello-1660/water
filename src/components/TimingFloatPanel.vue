<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTimingFloatStore } from '../stores/timingFloatStore'

const route = useRoute()
const router = useRouter()
const floatStore = useTimingFloatStore()
const {
    clockActive,
    clockLabel,
    clockPaused,
    secondActive,
    secondLabel,
    secondPaused,
} = storeToRefs(floatStore)

const onTimingPage = computed(() => route.path === '/timing')

const showMini = computed(
    () => !onTimingPage.value && (clockActive.value || secondActive.value),
)

const floatMode = computed<'clock' | 'second' | null>(() => {
    if (clockActive.value) return 'clock'
    if (secondActive.value) return 'second'
    return null
})

const x = ref(24)
const y = ref(100)
const panelW = 220
const panelH = 88

function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n))
}

function placeDefault() {
    x.value = clamp(window.innerWidth - panelW - 24, 8, window.innerWidth - panelW - 8)
    y.value = clamp(100, 8, window.innerHeight - panelH - 8)
}

onMounted(() => {
    placeDefault()
    window.addEventListener('resize', placeDefault)
})

onUnmounted(() => {
    window.removeEventListener('resize', placeDefault)
})

watch(showMini, (show) => {
    if (show) placeDefault()
})

let dragStartX = 0
let dragStartY = 0
let panelStartX = 0
let panelStartY = 0

function onDragMouseDown(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    dragStartX = e.clientX
    dragStartY = e.clientY
    panelStartX = x.value
    panelStartY = y.value

    const onMove = (ev: MouseEvent) => {
        const maxX = window.innerWidth - panelW - 8
        const maxY = window.innerHeight - panelH - 8
        x.value = clamp(panelStartX + ev.clientX - dragStartX, 8, Math.max(8, maxX))
        y.value = clamp(panelStartY + ev.clientY - dragStartY, 8, Math.max(8, maxY))
    }
    const onUp = () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
}

function goTiming() {
    router.push('/timing')
}

function onTagClick(e: MouseEvent) {
    e.stopPropagation()
    if (!secondPaused.value) floatStore.requestSecondTag()
}

function onClockPauseClick(e: MouseEvent) {
    e.stopPropagation()
    floatStore.requestClockPauseToggle()
}
</script>

<template>
    <Teleport to="body">
        <div
            v-show="showMini"
            class="timing-float-panel"
            :style="{ left: x + 'px', top: y + 'px', width: panelW + 'px' }"
        >
            <div class="timing-float-drag" title="拖动" @mousedown="onDragMouseDown">⋮⋮</div>
            <div class="timing-float-body" @click="goTiming">
                <template v-if="floatMode === 'clock'">
                    <div class="timing-float-row">
                        <div class="timing-float-label timing-float-mono">{{ clockLabel }}</div>
                        <button
                            type="button"
                            class="timing-float-tag"
                            :aria-label="clockPaused ? '继续' : '暂停'"
                            @click="onClockPauseClick"
                        >
                            <svg
                                v-if="clockPaused"
                                class="timing-float-tag-svg"
                                viewBox="0 0 1024 1024"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M195.4 89.6l677.7 383c30.6 17.3 30.6 61.4 0 78.6l-677.7 383c-30.1 17-67.4-4.7-67.4-39.3L128 129C128 94.4 165.3 72.6 195.4 89.6z"
                                />
                            </svg>
                            <svg
                                v-else
                                class="timing-float-tag-svg"
                                viewBox="0 0 1024 1024"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M512 977.454545C255.301818 977.454545 46.545455 768.651636 46.545455 512S255.301818 46.545455 512 46.545455s465.454545 208.802909 465.454545 465.454545-208.802909 465.454545-465.454545 465.454545z m0-861.090909c-218.158545 0-395.636364 177.477818-395.636364 395.636364 0 218.158545 177.477818 395.636364 395.636364 395.636364s395.636364-177.477818 395.636364-395.636364c0-218.158545-177.477818-395.636364-395.636364-395.636364zM414.999273 673.000727V351.045818a34.909091 34.909091 0 0 0-69.818182 0v321.954909a34.909091 34.909091 0 0 0 69.818182 0z m263.773091 0V351.045818a34.909091 34.909091 0 0 0-69.818182 0v321.954909a34.909091 34.909091 0 0 0 69.818182 0z"
                                />
                            </svg>
                        </button>
                    </div>
                    <div class="timing-float-hint">点击空白返回计时</div>
                </template>
                <template v-else-if="floatMode === 'second'">
                    <div class="timing-float-row">
                        <div class="timing-float-label timing-float-mono">{{ secondLabel }}</div>
                        <button
                            v-if="!secondPaused"
                            type="button"
                            class="timing-float-tag"
                            aria-label="添加记录"
                            @click="onTagClick"
                        >
                            <svg
                                class="timing-float-tag-svg"
                                viewBox="0 0 1024 1024"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M826.8 416.2c-5.1 8.1-18.6 14.8-29.8 19.1L270.1 701.9V922c0 21.2-17.5 38.4-39 38.4s-39-17.2-39-38.4V102.3c0-21.2 17.5-38.4 39-38.4 7.9 0 15.1 2.3 21.1 6.3 4.9 3.2 185.9 97.8 543 283.7 13.4 6.3 25.9 10.7 32.6 22.2 3.8 6.5 4.8 13.5 4.5 20.4 0.3 6.9-0.4 11.5-5.5 19.7z"
                                />
                            </svg>
                        </button>
                    </div>
                    <div class="timing-float-hint">点击空白返回计时</div>
                </template>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.timing-float-panel {
    position: fixed;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
    background: var(--light-option-bgc, #f5f5f5);
    color: var(--light-font-color, #262626);
    overflow: hidden;
    user-select: none;
}

.timing-float-drag {
    flex: 0 0 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    letter-spacing: 1px;
    color: var(--light-font-second-color, #626262);
    background: var(--light-second-bgc, #f2f2f2);
    cursor: grab;
}

.timing-float-drag:active {
    cursor: grabbing;
}

.timing-float-body {
    padding: 10px 12px 8px;
    cursor: pointer;
}

.timing-float-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.timing-float-label {
    font-size: 22px;
    font-weight: 600;
    line-height: 1.2;
}

.timing-float-mono {
    font-family: 'Montserrat', ui-monospace, monospace;
}

.timing-float-hint {
    margin-top: 4px;
    font-size: 11px;
    color: var(--light-font-second-color, #626262);
}

.timing-float-tag {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 36px;
    padding: 0;
    border: none;
    border-radius: 8px;
    background: var(--light-option-second-bgc, #e8e8e8);
    cursor: pointer;
}

.timing-float-tag:hover {
    filter: brightness(0.97);
}

.timing-float-tag-svg {
    width: 22px;
    height: 22px;
    fill: rgb(68, 143, 255);
}
</style>
