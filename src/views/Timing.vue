<script setup lang="ts">
import Clock from '../components/Clock.vue'

</script>


<template>
    <div class="container">
        <Clock class="clock" />
    </div>
</template>

<style scoped>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.clock {
    width: 80%;
    height: 80%;
}
</style>