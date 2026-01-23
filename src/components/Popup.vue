<!-- Popup.vue -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue?: boolean
  title?: string
  width?: number | string
  height?: number | string
  showCloseButton?: boolean
  closeOnClickOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  width: 300,
  height: 300,
  showCloseButton: true,
  closeOnClickOverlay: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'open': []
  'close': []
}>()

const dialogRef = ref<HTMLDialogElement>()

const popupStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height
}))

// 打开弹窗
const open = () => {
  if (dialogRef.value) {
    dialogRef.value.showModal()
    emit('update:modelValue', true)
    emit('open')
  }
}

// 关闭弹窗
const close = () => {
  if (dialogRef.value) {
    dialogRef.value.close()
    emit('update:modelValue', false)
    emit('close')
  }
}

// 点击遮罩层关闭
const handleOverlayClick = (event: MouseEvent) => {
  if (props.closeOnClickOverlay && event.target === dialogRef.value) {
    close()
  }
}

// 监听modelValue变化
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    open()
  } else {
    close()
  }
})

// 暴露方法给父组件
defineExpose({
  open,
  close
})
</script>

<template>
  <dialog
    ref="dialogRef"
    class="popup-dialog"
    @click="handleOverlayClick"
    @close="emit('update:modelValue', false)"
  >
    <div class="popup-content" :style="popupStyle">
      <div v-if="title" class="popup-header">
        <h3 class="popup-title">{{ title }}</h3>
      </div>
      
      <div class="popup-body">
        <slot />
      </div>
      
      <div v-if="showCloseButton" class="popup-footer">
        <button class="popup-close-btn" @click="close">
          <slot name="close-text">关闭</slot>
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.popup-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  z-index: 1000;
}

.popup-dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.popup-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.popup-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.popup-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.popup-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.popup-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  text-align: right;
  background: #fafafa;
}

.popup-close-btn {
  padding: 8px 20px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.popup-close-btn:hover {
  background: #40a9ff;
}

.popup-close-btn:active {
  background: #096dd9;
}
</style>