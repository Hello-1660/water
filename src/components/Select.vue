<script setup lang="ts">
import {
    ref,
    watch,
    onMounted,
    nextTick,
    onBeforeUnmount
} from 'vue'


interface SelectValue {
    type: string,
    name: string,
}


const props = defineProps({
    selectValues: {
        type: Array as () => SelectValue[],
        default: () => []
    },
    width: {
        type: String,
        default: '350px'
    },
    height: {
        type: String,
        default: '45px'
    },
    initSelectValue: {
        type: String,
        default: ''
    }
})




const selectList = ref(props.selectValues)
const searchList = ref<SelectValue[]>([])
const isSearch = ref(false)

const search = () => {
    if (findValue.value === '' || selectList.value.length === 0) {
        isSearch.value = false
    } else {
        isSearch.value = true
    }

    isShow.value = true
}

const containerStyle = ref<Record<string, string>>({
    width: props.width,
    height: props.height
})


watch(
    () => props.selectValues,
    val => (selectList.value = val),
    { immediate: true }
)

watch(
    () => props.width,
    val => (containerStyle.value.width = val),
    { immediate: true }
)


// Teleport 里的真实下拉框
const floatingRef = ref<HTMLDivElement>()
// 父组件中的“占位锚点”
const anchorRef = ref<HTMLDivElement>()



let resizeObserver: ResizeObserver | null = null
let transitionTarget: HTMLElement | null = null
let rafId = 0

const updatePosition = () => {
    if (!anchorRef.value || !floatingRef.value) return

    const rect = anchorRef.value.getBoundingClientRect()

    Object.assign(floatingRef.value.style, {
        position: 'fixed',
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        zIndex: '10000'
    })
}


const emit = defineEmits(['data'])

const startFollow = (e: TransitionEvent) => {
    if (e.propertyName !== 'height') return

    cancelAnimationFrame(rafId)

    const loop = () => {
        updatePosition()
        rafId = requestAnimationFrame(loop)
    }

    loop()
}

const stopFollow = (e: TransitionEvent) => {
    if (e.propertyName !== 'height') return

    cancelAnimationFrame(rafId)
    updatePosition()
}

onMounted(async () => {
    await nextTick()
    updatePosition()

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('click', close)

    if (anchorRef.value) {
        resizeObserver = new ResizeObserver(updatePosition)
        resizeObserver.observe(anchorRef.value)

        transitionTarget = anchorRef.value.closest('.func')

        transitionTarget?.addEventListener('transitionstart', startFollow)
        transitionTarget?.addEventListener('transitionend', stopFollow)
    }

    watch(
        () => props.initSelectValue,
        val => (findValue.value = val),
        { immediate: true }
    )
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
    window.removeEventListener('click', close)

    resizeObserver?.disconnect()

    transitionTarget?.removeEventListener('transitionstart', startFollow)
    transitionTarget?.removeEventListener('transitionend', stopFollow)

    cancelAnimationFrame(rafId)
})


const isShow = ref(false)
const findValue = ref<string>('')

watch(
    () => findValue.value,
    val => {
        if (val === '') {
            isSearch.value = false
        } else {
            isSearch.value = true
        }

        searchList.value = selectList.value.filter(item => item.name.includes(val))
    }
)

const handleLiClick = (value: SelectValue) => { 
    emit('data', value)
    findValue.value = value.name
    isShow.value = false
}

const close = (e: MouseEvent) => {
    if (!floatingRef.value) return

    const isClickInside = floatingRef.value.contains(e.target as Node)
    if (!isClickInside)  isShow.value = false
}

</script>

<template>
    <!-- 父组件中的锚点，占位用 -->
    <div ref="anchorRef" :style="containerStyle" />

    <!-- 真正渲染到 body 的下拉框 -->
    <Teleport to="body">
        <div ref="floatingRef" class="select-container">
            <div ref="selectMain" class="select-main">
                <input v-model="findValue" class="select-input" @focus="search()" type="text"placeholder="请选择" />

                <div v-show="!isSearch" class="select-list" :id="isShow ? 'up' : ''">
                    <ul class="list">
                        <li v-for="(value, index) in selectList" :key="index"  @click="handleLiClick(value)">{{ value.name }}</li>
                    </ul>
                </div>

                <div v-show="isSearch" class="select-list" :id="isShow ? 'up' : ''">
                    <ul class="list">
                        <li v-for="(value, index) in searchList" :key="index"  @click="handleLiClick(value)">{{ value.name }}</li>
                    </ul>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    list-style: none;
    box-sizing: border-box;
}


.select-container>.select-main {
    border-radius: 18px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    background-color: var(--light-option-bgc);
    color: var(--light-font-color);
}



.select-input {
    width: 100%;
    height: 100%;
    padding: 10px 15px;
    font-size: 28px;
    border: none;
    background-color: transparent;
    color: var(--light-font-color);
}

.select-input:focus {
    outline: none;
}

.select-list {
    width: 100%;
    list-style: none;
    max-height: 0;
    transition: max-height 0.3s;
}

#up {
    overflow-y: auto;
    max-height: 500px;
}


.select-list>.list {
    overflow-y: auto;
}

.select-list>.list>li {
    height: 45px;
    line-height: 45px;
    border-radius: 6px;
    margin-top: 5px;
    padding: 0 10px;
    font-size: 22px;
    user-select: none;
}

.select-list>.list>li:hover {
    background-color: rgba(0, 0, 0, 0.1);
}


.active {
    background-color: rgba(0, 0, 0, 0.2);
}
</style>
