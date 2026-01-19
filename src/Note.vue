<script setup lang="ts">
import StickyNote from './views/StickyNote.vue'
import Top from './components/Top.vue'

</script>

<template>
    <div class="container">
        <Top />
        <StickyNote />
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

.container {
    padding: 0;
    margin: -10px;
    width: 100vw;
}
</style>
