<script setup lang="ts">
import Main from './views/Main.vue'
import { onMounted } from 'vue'
import { useUiConfigStore } from './stores/uiConfigStore'

const uiConfigStore = useUiConfigStore()

onMounted(async () => {
  const configPath = ''
  await uiConfigStore.loadUiConfig(configPath);
})
</script>

<template>
    <Main />
</template>

<style scoped>

</style>
