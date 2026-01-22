<script setup lang="ts">
import Top from './components/Top.vue'
import StickyNote from './views/StickyNote.vue'

</script>

<template>
    <div class="container">
        <Top/>        
        <div class="main">
            <div class="option">

            </div>
            
            <div class="show">
                <StickyNote />
            </div>
        </div>
    </div>
</template>

<style>
.container {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    padding: 0;
    width: 100%;
    height: 100%;
    max-height: 100%;
}

.main {
    display: flex;
    justify-content: start;
    align-items: start;
    height: calc(100% - 40px);
}

.main>.option {
    width: 20%;
    height: 100%;
    background-color: yellow;
}

.main>.show {
    width: 80%;
    height: 100%;
}
</style>
