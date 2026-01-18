<script setup lang="ts">
import { ref, Ref, onUnmounted, onMounted } from 'vue'

const time: Ref<Date> = ref(new Date())
let timerInterval: NodeJS.Timeout | null = null

const updataTime = (): void => {
	// 更新时间
	time.value = new Date()

	// 处理时间差
	const now: Date = new Date()
	const nextMinute: Date = new Date(now)

	nextMinute.setMinutes(now.getMinutes() + 1)
	nextMinute.setSeconds(0)
	nextMinute.setMilliseconds(0)

	const delay: number = nextMinute.getTime() - now.getTime()

	timerInterval = setTimeout(updataTime, delay)
}

// 更新时间
updataTime()







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
onMounted(() => {
	if (!dragContainer.value) return

	window.addEventListener('mousedown', handleMouseDown)
	window.addEventListener('mousemove', handleMouseMove)
	window.addEventListener('mouseup', handleMouseUp)
})



onUnmounted((): void => {
	if (timerInterval) clearTimeout(timerInterval)

	if (dragContainer.value) {
		dragContainer.value.removeEventListener('mousedown', handleMouseDown)
		window.removeEventListener('mousemove', handleMouseMove)
		window.removeEventListener('mouseup', handleMouseUp)
	}
})

</script>
	
<template>
	<div ref="dragContainer" class="container">
		<div class="time">
			{{ time.getHours() + ': ' + time.getMinutes() }}
		</div>
		<div class="date">
			{{ time }}
		</div>
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
