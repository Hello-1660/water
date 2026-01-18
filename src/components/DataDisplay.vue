<script setup lang="ts">
import { ref } from 'vue'
import { useUiConfigStore  } from '../stores/uiConfigStore'
import { storeToRefs } from 'pinia'

const uiConfigStore = useUiConfigStore()
const { dateStyle, getUIConfig } = storeToRefs(uiConfigStore)

const content = ref(getUIConfig.value?.mainConfig.date.content)

if (!getUIConfig.value) {
    content.value = 'Hello Water!'
}

</script>
	
<template>
	<div class="date" :style="dateStyle">
		{{ content }}
	</div>
</template>

<style scoped>

</style>
