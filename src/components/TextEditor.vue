<script setup lang="ts">
import { ref } from 'vue'

const fontSize = ref(30)


const editor = ref<null | HTMLDivElement>(null)

/**
 * 粘贴事件
 * @param e 
 */
const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault()

  const clipboardDate = e.clipboardData
  if (!clipboardDate) return

  const text = clipboardDate.getData('text/plain')
  const files = clipboardDate.files

  if (files.length) {
    console.log('files', files)
    handleInputFiles(files)
    
  } else if (text) {
    console.log('text', text)
    handleInputText(text)
  }
}

/**
 * 调整字体大小
 * @param e ctrl 
 */
const handleKeydown = (e: KeyboardEvent) => {
  const key = e.code

  if (e.ctrlKey && (key === 'Equal' || key === 'NumpadAdd')) {
    e.preventDefault()
    fontSize.value += 5
  }

  else if (e.ctrlKey && (key === 'Minus' || key === 'NumpadSubtract')) {
    e.preventDefault()
    if (fontSize.value >= 20) {
      fontSize.value -= 5
    }
  }

  else if (e.ctrlKey && (key === 'Digit0' || key === 'Numpad0')) {
    e.preventDefault()
    fontSize.value = 30
  }
}


const handleInputFiles = (files: FileList) => {
  if (editor.value && files) {
    for (const file of files) {
      const img = new Image()
      img.style = 'max-width: 500px; max-height: 500px; margin: 5px'
      img.src = URL.createObjectURL(file)
      editor.value.appendChild(img)
    }
  } 
}

const handleInputText = (test: string) => {
  if (editor.value) {
    editor.value.innerHTML += test
  } 
}
</script>

<template>
  <div class="editor-container">  
    <div  
    :style="{ fontSize: fontSize + 'px' }"  
    contenteditable="true" 
    @paste="handlePaste"
    @keydown="handleKeydown"
    ref="editor"
    id="editor"></div>
  </div>
</template>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .editor-container {
    width: 100%;
    height: 100%;
  }

  #editor {
    width: 100%;
    height: 100%;
    padding: 5px;
    overflow: auto;
    outline: none;
    caret-color: var(--light-caret-color);
  }

  #editor::selection {
    background-color: #3d4a6b;
    color: aliceblue;
  }
</style>