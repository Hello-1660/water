<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const slider = ref<HTMLDivElement | undefined>()
const data = ref<boolean>(false)

const prop = defineProps({
    theme: {
        type: Boolean,
        default: false
    }
})


const updateStatus = (): void => {
    if (!slider.value) return
    slider.value.style.maxWidth = data.value ? '30px' : '80px'
    data.value = !data.value

    update()
}



const emit = defineEmits(['update'])
const update = (): void => {
    emit('update', data.value)
}


onMounted(() => {
    watch(
        () => prop.theme,
        (newTheme) => {
            if (!slider.value) return
            if (newTheme) {
                slider.value.style.maxWidth = '80px'
            } else {
                slider.value.style.maxWidth = '30px'
            }

            data.value = newTheme
        },
        { immediate: true }
    )
})
</script>


<template>
    <div class="button-main">
        <div v-show="!data" class="label">
            <slot name="label1">11</slot>
        </div>

        <div v-show="data" class="label">
            <slot name="label2">22</slot>
        </div>

        <div @click="updateStatus" id="btn">
            <div ref="slider" class="slider">
                <div class="circle"></div>
            </div>
        </div>
    </div>
</template>


<style scoped>
* {
    margin: 0;
    padding: 0;
}


.button-main {
    display: flex;
    align-items: center;
}

.button-main>.label {
    width: 40px;
    height: 40px;
    margin-right: 10px;
}


#btn {
    width: 70px;
    height: 30px;
    border-radius: 30px;
    user-select: none;
    overflow: hidden;
    box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.5);
    background-color: rgb(255, 255, 255);
    cursor: pointer;
}

.slider {
    position: relative;
    max-width: 30px;
    height: 100%;
    border-radius: 30px;
    background-color: rgb(0, 106, 255);
    transition: max-width 0.1s ease-in-out;
}

.slider>.circle {
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    width: 30px;
    height: 100%;
    border-radius: 50%;
    border: 3px solid #aaaaaa5e;
    background-color: rgb(255, 255, 255);
}

.slider>.circle:hover {
    border: 3px solid #aaaaaa;
}
</style>