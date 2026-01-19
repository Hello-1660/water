<script setup lang="ts">
import { ref, Ref, onUnmounted, computed } from 'vue'
import { useUiConfigStore  } from '../stores/uiConfigStore'
import { storeToRefs } from 'pinia'

// 1. 获取Store和响应式样式（storeToRefs保持响应式）
const uiConfigStore = useUiConfigStore()
const { timeStyle } = storeToRefs(uiConfigStore)


const time: Ref<Date> = ref(new Date())
let timerInterval: NodeJS.Timeout | null = null

const formattedTime = computed(() => {
  const hours = time.value.getHours().toString().padStart(2, '0')
  const minutes = time.value.getMinutes().toString().padStart(2, '0')
  
  return `${hours}:${minutes}`
})


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


onUnmounted((): void => {
	if (timerInterval) clearTimeout(timerInterval)
})

</script>
	
<template>
    <div class="time" :style="timeStyle">
		{{ formattedTime }}
	</div>
</template>

<style scoped>

</style>
