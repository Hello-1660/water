<script setup lang="ts">
import { onMounted, onUnmounted, ref, Ref } from 'vue'
import DataDisplay from '../components/DataDisplay.vue' 
import TimeDisplay from '../components/TimeDisplay.vue'


const dragContainer: Ref<HTMLElement | null> = ref(null)
const isDragging: Ref<Boolean> = ref(false)
const position: [x: number, y: number] = [0, 0]
let winPos: [x: number, y: number] = [0, 0]


const handleMouseDown = async (e: MouseEvent): Promise<void> => {
	if (!dragContainer.value) return
	e.preventDefault()

	winPos = await window.electronAPI.getWindowPosition()

	position[0] = e.screenX 
	position[1] = e.screenY

	isDragging.value = true	
}


const handleMouseMove = (e: MouseEvent): void => {
	if (!dragContainer.value || !isDragging.value) return

	const mouseMoveX = e.screenX - position[0]
	const mouseMoveY = e.screenY - position[1]

	const newWinPos = winPos[0] + mouseMoveX
	const newWinPosY = winPos[1] + mouseMoveY

	window.electronAPI.setWindowPosition(newWinPos, newWinPosY)
}

const handleMouseUp = (): void => {
	if (!dragContainer.value) return
	isDragging.value = false
}




// 窗口拖拽
onMounted(async () => {
	if (!dragContainer.value) return

	window.addEventListener('mousedown', handleMouseDown)
	window.addEventListener('mousemove', handleMouseMove)
	window.addEventListener('mouseup', handleMouseUp)
})


onUnmounted((): void => {
	if (!dragContainer.value) return

	dragContainer.value.removeEventListener('mousedown', handleMouseDown)
	window.removeEventListener('mousemove', handleMouseMove)
	window.removeEventListener('mouseup', handleMouseUp)
})

</script>
	
<template>
	<div ref="dragContainer" class="container">
		<TimeDisplay />
		<DataDisplay />
	</div>
</template>

<style scoped>
* {
	margin: 0;
	padding: 0;
}	

.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 80px;
	user-select: none;
}
</style>
