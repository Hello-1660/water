<script setup lang="ts">
import Popup from './Popup.vue'
import { onMounted, onUnmounted, ref } from 'vue'

type AvailablePayload = { version: string; releaseNotes?: string | string[] | null }

const showAvailable = ref(false)
const showProgress = ref(false)
const showInstall = ref(false)
const availableInfo = ref<AvailablePayload | null>(null)
const downloadPercent = ref(0)
const downloadedVersion = ref('')

let offAvailable: (() => void) | null = null
let offProgress: (() => void) | null = null
let offDownloaded: (() => void) | null = null
let offError: (() => void) | null = null
let offNotAvailable: (() => void) | null = null

function formatNotes(n: string | string[] | null | undefined): string {
  if (n == null) return ''
  if (Array.isArray(n)) return n.map(String).join('\n')
  return String(n).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

async function startDownload() {
  showAvailable.value = false
  showProgress.value = true
  downloadPercent.value = 0
  try {
    await window.electronAPI.updaterDownload()
  } catch {
    showProgress.value = false
  }
}

function dismissAvailable() {
  showAvailable.value = false
  availableInfo.value = null
}

function quitAndInstall() {
  showInstall.value = false
  window.electronAPI.updaterQuitAndInstall()
}

onMounted(() => {
  const api = window.electronAPI

  offAvailable = api.updaterOnUpdateAvailable((p: AvailablePayload) => {
    availableInfo.value = p
    showAvailable.value = true
  })
  offProgress = api.updaterOnDownloadProgress((p: { percent: number }) => {
    downloadPercent.value = Math.round(p.percent ?? 0)
  })
  offDownloaded = api.updaterOnUpdateDownloaded((p: { version: string }) => {
    showProgress.value = false
    downloadedVersion.value = p.version ?? ''
    showInstall.value = true
  })
  offError = api.updaterOnError(() => {
    showProgress.value = false
  })
  offNotAvailable = api.updaterOnUpdateNotAvailable(() => {
    /* 静默 */
  })
})

onUnmounted(() => {
  offAvailable?.()
  offProgress?.()
  offDownloaded?.()
  offError?.()
  offNotAvailable?.()
})
</script>

<template>
  <Teleport to="body">
    <Popup
      v-model="showAvailable"
      title="发现新版本"
      width="520px"
      :height="420"
      @sure="startDownload"
      @close="dismissAvailable"
    >
      <p v-if="availableInfo" class="upd-line">
        最新版本：<strong>{{ availableInfo.version }}</strong>
      </p>
      <p v-if="availableInfo && formatNotes(availableInfo.releaseNotes)" class="upd-notes">
        {{ formatNotes(availableInfo.releaseNotes) }}
      </p>
      <template #sure-text>下载更新</template>
      <template #close-text>稍后</template>
    </Popup>

    <Popup
      v-model="showInstall"
      title="更新已就绪"
      width="480px"
      height="200px"
      @sure="quitAndInstall"
      @close="showInstall = false"
    >
      <p class="upd-line">版本 {{ downloadedVersion }} 已下载完成，是否立即重启并完成安装？</p>
      <template #sure-text>立即安装并重启</template>
      <template #close-text>稍后</template>
    </Popup>

    <div v-if="showProgress" class="upd-progress-overlay" @click.self.prevent>
      <div class="upd-progress-box">
        <p class="upd-progress-title">正在下载更新…</p>
        <div class="upd-bar-outer">
          <div class="upd-bar-inner" :style="{ width: downloadPercent + '%' }" />
        </div>
        <p class="upd-progress-num">{{ downloadPercent }}%</p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.upd-line {
  margin: 0 0 12px;
  font-size: 16px;
  color: var(--light-font-color, #333);
}

.upd-notes {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--light-font-second-color, #626262);
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.upd-progress-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.upd-progress-box {
  width: 360px;
  padding: 24px;
  border-radius: 10px;
  background: var(--light-main-bgc, #fff);
  color: var(--light-font-color, #333);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.upd-progress-title {
  margin: 0 0 16px;
  font-size: 18px;
}

.upd-bar-outer {
  height: 10px;
  border-radius: 5px;
  background: var(--light-second-bgc, #eee);
  overflow: hidden;
}

.upd-bar-inner {
  height: 100%;
  border-radius: 5px;
  background: #1890ff;
  transition: width 0.2s ease;
}

.upd-progress-num {
  margin: 12px 0 0;
  font-size: 14px;
  text-align: right;
  color: var(--light-font-second-color, #666);
}
</style>
