<script setup lang="ts">
import TextEditor from '../components/TextEditor.vue'
import Popup from '../components/Popup.vue'
import { highlightLanguageFromExtension } from '../utils/highlightLanguageFromExt'
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

const HTML = 'html'

const SIDEBAR_WIDTH_STORAGE_KEY = 'sticky-sidebar-width'
const SIDEBAR_WIDTH_DEFAULT = 300
const SIDEBAR_WIDTH_MIN = 180
const SIDEBAR_WIDTH_MAX = 720

function clampSidebarWidth(px: number) {
  return Math.min(SIDEBAR_WIDTH_MAX, Math.max(SIDEBAR_WIDTH_MIN, Math.round(px)))
}

function readStoredSidebarWidth(): number {
  try {
    const raw = localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY)
    if (raw == null) return SIDEBAR_WIDTH_DEFAULT
    const n = Number.parseInt(raw, 10)
    if (Number.isNaN(n)) return SIDEBAR_WIDTH_DEFAULT
    return clampSidebarWidth(n)
  } catch {
    return SIDEBAR_WIDTH_DEFAULT
  }
}

const sidebarWidthPx = ref(readStoredSidebarWidth())
const sidebarResizing = ref(false)
let resizeStartX = 0
let resizeStartW = 0

function persistSidebarWidth() {
  try {
    localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(sidebarWidthPx.value))
  } catch {
    /* ignore */
  }
}

function onSidebarResizeMove(e: MouseEvent) {
  if (!sidebarResizing.value) return
  const delta = e.clientX - resizeStartX
  sidebarWidthPx.value = clampSidebarWidth(resizeStartW + delta)
}

function endSidebarResize() {
  if (!sidebarResizing.value) return
  sidebarResizing.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  window.removeEventListener('mousemove', onSidebarResizeMove)
  window.removeEventListener('mouseup', endSidebarResize)
  persistSidebarWidth()
}

function onSidebarResizeStart(e: MouseEvent) {
  if (e.button !== 0) return
  e.preventDefault()
  sidebarResizing.value = true
  resizeStartX = e.clientX
  resizeStartW = sidebarWidthPx.value
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  window.addEventListener('mousemove', onSidebarResizeMove)
  window.addEventListener('mouseup', endSidebarResize)
}

function onSidebarResizerDblClick() {
  sidebarWidthPx.value = SIDEBAR_WIDTH_DEFAULT
  persistSidebarWidth()
}

/** 当前工作区根目录（绝对路径），不再使用固定 data 目录 */
const workspaceRoot = ref<string | null>(null)

interface WorkspaceTreeNode {
  kind: 'file' | 'folder'
  relPath: string
  name: string
  type?: string
  children?: WorkspaceTreeNode[]
}

type WorkspaceFileEntry = WorkspaceTreeNode & { kind: 'file' }

interface EditorTab {
  id: string
  /** 相对工作区根的路径，正斜杠；未落盘为空串 */
  relPath: string
  name: string
  type: string
  content: string
  savedContent: string
}

const EXPLORER_EXPANDED_KEY = 'sticky-explorer-expanded'

const workspaceTree = ref<WorkspaceTreeNode[]>([])
const expandedFolders = ref<Set<string>>(new Set())
const tabs = ref<EditorTab[]>([])
const activeId = ref<string | null>(null)
let untitledSeq = 0

const activeTab = computed(() => tabs.value.find((t) => t.id === activeId.value) ?? null)

function toRelPath(name: string, type: string) {
  return type ? `${name}.${type}` : name
}

function parseRelPathParts(relPath: string): { name: string; type: string } {
  const seg = relPath.split('/').pop() ?? relPath
  const i = seg.lastIndexOf('.')
  if (i <= 0) return { name: seg, type: '' }
  return { name: seg.slice(0, i), type: seg.slice(i + 1) }
}

function relPathToSaveNameAndType(relPath: string): { saveName: string; type: string } {
  const { name, type } = parseRelPathParts(relPath)
  const dir = relPath.includes('/') ? relPath.slice(0, relPath.lastIndexOf('/')) : ''
  const saveName = dir ? `${dir}/${name}` : name
  return { saveName, type }
}

function loadExpandedForRoot(root: string | null): Set<string> {
  if (!root) return new Set()
  try {
    const map = JSON.parse(localStorage.getItem(EXPLORER_EXPANDED_KEY) || '{}') as Record<string, string[]>
    return new Set(map[root] ?? [])
  } catch {
    return new Set()
  }
}

function persistExpandedForRoot(root: string, set: Set<string>) {
  try {
    const map = JSON.parse(localStorage.getItem(EXPLORER_EXPANDED_KEY) || '{}') as Record<string, string[]>
    map[root] = [...set]
    localStorage.setItem(EXPLORER_EXPANDED_KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
}

function toggleFolderExpanded(relPath: string) {
  const next = new Set(expandedFolders.value)
  if (next.has(relPath)) next.delete(relPath)
  else next.add(relPath)
  expandedFolders.value = next
  const r = workspaceRoot.value
  if (r) persistExpandedForRoot(r, next)
}

interface FlatExplorerRow {
  kind: 'file' | 'folder'
  relPath: string
  name: string
  type?: string
  depth: number
}

function flattenVisibleTree(nodes: WorkspaceTreeNode[], expanded: Set<string>, depth = 0): FlatExplorerRow[] {
  const rows: FlatExplorerRow[] = []
  for (const n of nodes) {
    if (n.kind === 'folder') {
      rows.push({ kind: 'folder', relPath: n.relPath, name: n.name, depth })
      if (expanded.has(n.relPath) && n.children?.length) {
        rows.push(...flattenVisibleTree(n.children, expanded, depth + 1))
      }
    } else {
      rows.push({ kind: 'file', relPath: n.relPath, name: n.name, type: n.type, depth })
    }
  }
  return rows
}

const flatExplorerRows = computed(() => flattenVisibleTree(workspaceTree.value, expandedFolders.value))

function isDirty(tab: EditorTab) {
  return tab.content !== tab.savedContent
}

function tabTitle(tab: EditorTab) {
  if (!tab.name && !tab.relPath) return '未命名'
  if (tab.relPath) return tab.relPath.split('/').pop() ?? tab.relPath
  return tab.type ? `${tab.name}.${tab.type}` : tab.name
}

async function persistWorkspace(folder: string | null) {
  workspaceRoot.value = folder
  await window.electronAPI.stickySetLastWorkspace(folder)
}

function refreshWorkspace() {
  const root = workspaceRoot.value
  if (!root) {
    workspaceTree.value = []
    return
  }
  window.electronAPI.openWorkspaceTree(root).then((data) => {
    workspaceTree.value = (data ?? []) as WorkspaceTreeNode[]
  })
}

async function chooseOpenFolder() {
  const picked = await window.electronAPI.pickWorkspaceFolder()
  if (!picked) return
  await persistWorkspace(picked)
  refreshWorkspace()
  setResultPopup('已打开文件夹', true)
}

async function chooseOpenFile() {
  const picked = await window.electronAPI.pickFileToOpen()
  if (!picked) return
  await persistWorkspace(picked.dir)
  refreshWorkspace()
  await openFileFromRelPath(toRelPath(picked.name, picked.type))
  setResultPopup('已打开文件', true)
}

async function openFileFromRelPath(relPath: string) {
  const root = workspaceRoot.value
  if (!root) return
  const existing = tabs.value.find((t) => t.id === relPath)
  if (existing) {
    activeId.value = relPath
    return
  }
  const { name, type } = parseRelPathParts(relPath)
  let content = ''
  try {
    const raw = await window.electronAPI.openFile(relPath, root)
    content = typeof raw === 'string' ? raw : ''
  } catch {
    setResultPopup('读取文件失败', false)
    return
  }
  tabs.value.push({
    id: relPath,
    relPath,
    name,
    type,
    content,
    savedContent: content,
  })
  activeId.value = relPath
}

async function openFileInSidebar(entry: WorkspaceFileEntry) {
  await openFileFromRelPath(entry.relPath)
}

function newUntitled() {
  untitledSeq += 1
  const id = `untitled-${untitledSeq}`
  tabs.value.push({
    id,
    relPath: '',
    name: '',
    type: HTML,
    content: '',
    savedContent: '',
  })
  activeId.value = id
}

function onEditorUpdate(v: string) {
  const t = tabs.value.find((x) => x.id === activeId.value)
  if (t) t.content = v
}

const saveTargetTabId = ref<string | null>(null)
const pendingCloseAfterSaveId = ref<string | null>(null)

function openSaveDialog() {
  if (!workspaceRoot.value) {
    setResultPopup('请先通过右键菜单「打开文件夹」选择工作区', false)
    return
  }
  const t = activeTab.value
  if (!t) return
  saveTargetTabId.value = t.id
  savePopupFileName.value = t.name
  savePopupFileType.value = t.type || HTML
  isShowSavePopup.value = true
}

async function saveTabToDisk(tab: EditorTab): Promise<boolean> {
  const root = workspaceRoot.value
  if (!root) return false
  if (!tab.relPath && !tab.name) return false
  const { saveName, type: saveType } = tab.relPath
    ? relPathToSaveNameAndType(tab.relPath)
    : { saveName: tab.name, type: tab.type }
  if (!saveName) return false
  try {
    const ok = await window.electronAPI.saveFile(saveName, saveType, tab.content, root)
    if (ok) {
      tab.savedContent = tab.content
      refreshWorkspace()
    }
    return ok
  } catch {
    return false
  }
}

async function saveActive() {
  const t = activeTab.value
  if (!t) return
  if (!workspaceRoot.value) {
    setResultPopup('请先打开文件夹', false)
    return
  }
  if (!t.name) {
    openSaveDialog()
    return
  }
  const ok = await saveTabToDisk(t)
  setResultPopup(ok ? '保存成功' : '保存失败', ok)
}

function doCloseTab(id: string) {
  const idx = tabs.value.findIndex((x) => x.id === id)
  if (idx === -1) return
  const wasActive = activeId.value === id
  tabs.value.splice(idx, 1)
  if (wasActive) {
    activeId.value = tabs.value[idx]?.id ?? tabs.value[idx - 1]?.id ?? null
  }
  showCloseDirty.value = false
  closeDirtyTabId.value = null
}

const showCloseDirty = ref(false)
const closeDirtyTabId = ref<string | null>(null)

function requestCloseTab(id: string) {
  const tab = tabs.value.find((x) => x.id === id)
  if (!tab) return
  if (isDirty(tab)) {
    closeDirtyTabId.value = id
    showCloseDirty.value = true
    return
  }
  doCloseTab(id)
}

async function closeDirtySave() {
  const id = closeDirtyTabId.value
  if (!id) return
  const tab = tabs.value.find((x) => x.id === id)
  if (!tab) return
  if (!workspaceRoot.value) {
    setResultPopup('请先打开文件夹', false)
    return
  }
  if (!tab.name) {
    showCloseDirty.value = false
    pendingCloseAfterSaveId.value = id
    saveTargetTabId.value = id
    savePopupFileName.value = tab.name
    savePopupFileType.value = tab.type || HTML
    isShowSavePopup.value = true
    return
  }
  const ok = await saveTabToDisk(tab)
  if (ok) doCloseTab(id)
  else setResultPopup('保存失败', false)
}

function closeDirtyDiscard() {
  const id = closeDirtyTabId.value
  if (!id) return
  doCloseTab(id)
}

function closeDirtyCancel() {
  showCloseDirty.value = false
  closeDirtyTabId.value = null
}

const isSidebarFileActive = (relPath: string) => {
  const t = activeTab.value
  return !!t && t.relPath === relPath
}

const onGlobalKeydown = (e: KeyboardEvent) => {
  if (e.defaultPrevented) return
  if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
    e.preventDefault()
    saveActive()
  }
}

/** ---- 右键菜单（类似 VS Code 资源管理器）---- */
type CtxKind = 'root' | 'file' | 'folder'

const ctxVisible = ref(false)
const ctxX = ref(0)
const ctxY = ref(0)
const ctxKind = ref<CtxKind>('root')
const ctxFile = ref<WorkspaceFileEntry | null>(null)
const ctxFolderRelPath = ref('')

const NEW_FILENAME_INVALID = /[\\/:*?"<>|]/

function closeContextMenu() {
  ctxVisible.value = false
  ctxFile.value = null
  ctxFolderRelPath.value = ''
}

function applyCtxMenuPosition(e: MouseEvent) {
  ctxX.value = e.clientX
  ctxY.value = e.clientY
  nextTick(() => {
    const el = document.querySelector('.ctx-menu') as HTMLElement | null
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pad = 8
    let x = e.clientX
    let y = e.clientY
    if (x + rect.width > window.innerWidth - pad) x = window.innerWidth - rect.width - pad
    if (y + rect.height > window.innerHeight - pad) y = window.innerHeight - rect.height - pad
    ctxX.value = Math.max(pad, x)
    ctxY.value = Math.max(pad, y)
  })
}

function openCtxAt(e: MouseEvent, kind: CtxKind, file: WorkspaceFileEntry | null) {
  e.preventDefault()
  ctxKind.value = kind
  ctxFile.value = file
  ctxFolderRelPath.value = ''
  ctxVisible.value = true
  applyCtxMenuPosition(e)
}

function openFolderCtxMenu(e: MouseEvent, row: FlatExplorerRow) {
  if (row.kind !== 'folder') return
  e.preventDefault()
  ctxKind.value = 'folder'
  ctxFolderRelPath.value = row.relPath
  ctxFile.value = null
  ctxVisible.value = true
  applyCtxMenuPosition(e)
}

function onRootContextMenu(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.closest('.explorer-row')) return
  openCtxAt(e, 'root', null)
}

function onFileContextMenu(e: MouseEvent, f: WorkspaceFileEntry) {
  openCtxAt(e, 'file', f)
}

function expandFolderAncestors(relFolderPath: string) {
  const next = new Set(expandedFolders.value)
  let acc = ''
  for (const seg of relFolderPath.split('/').filter(Boolean)) {
    acc = acc ? `${acc}/${seg}` : seg
    next.add(acc)
  }
  expandedFolders.value = next
  const r = workspaceRoot.value
  if (r) persistExpandedForRoot(r, next)
}

const isShowNewInFolderPopup = ref(false)
const newInFolderParentRel = ref('')
const newInFolderFileName = ref('')
const newInFolderFileType = ref(HTML)

function ctxNewFileInFolder() {
  const rel = ctxFolderRelPath.value
  closeContextMenu()
  if (!rel) return
  newInFolderParentRel.value = rel
  newInFolderFileName.value = ''
  newInFolderFileType.value = HTML
  isShowNewInFolderPopup.value = true
}

function handleNewInFolderSure() {
  const root = workspaceRoot.value
  const parent = newInFolderParentRel.value
  const base = newInFolderFileName.value.trim()
  const type = newInFolderFileType.value.trim() || HTML
  if (!root || !parent) {
    isShowNewInFolderPopup.value = false
    newInFolderParentRel.value = ''
    return
  }
  if (!base || NEW_FILENAME_INVALID.test(base)) {
    setResultPopup('请输入合法文件名（勿含 \\ / : * ? 等非法字符）', false)
    return
  }
  const saveName = `${parent}/${base}`
  window.electronAPI.saveFile(saveName, type, '', root).then((ok: boolean) => {
    if (ok) {
      expandFolderAncestors(parent)
      refreshWorkspace()
      const relPath = type ? `${saveName}.${type}` : saveName
      openFileFromRelPath(relPath)
      setResultPopup('已创建', true)
    } else {
      setResultPopup('创建失败', false)
    }
    newInFolderFileName.value = ''
    newInFolderParentRel.value = ''
    isShowNewInFolderPopup.value = false
  })
}

async function ctxOpenFolderInOS() {
  const rel = ctxFolderRelPath.value
  const root = workspaceRoot.value
  closeContextMenu()
  if (!root || !rel) return
  try {
    const ok = await window.electronAPI.openFolderInOS(root, rel)
    if (!ok) setResultPopup('无法打开文件夹', false)
  } catch {
    setResultPopup('无法打开文件夹', false)
  }
}

async function ctxOpenFolder() {
  closeContextMenu()
  await chooseOpenFolder()
}

async function ctxOpenFile() {
  closeContextMenu()
  await chooseOpenFile()
}

function ctxRefresh() {
  closeContextMenu()
  refreshWorkspace()
}

function ctxNewFile() {
  closeContextMenu()
  newUntitled()
}

async function ctxSaveFile() {
  const f = ctxFile.value
  closeContextMenu()
  if (!f || !workspaceRoot.value) {
    setResultPopup('请先打开文件夹', false)
    return
  }
  const tab = tabs.value.find((t) => t.id === f.relPath)
  if (!tab) {
    setResultPopup('请先在编辑器中打开该文件', false)
    return
  }
  if (!isDirty(tab)) {
    setResultPopup('没有需要保存的更改', true)
    return
  }
  const ok = await saveTabToDisk(tab)
  setResultPopup(ok ? '保存成功' : '保存失败', ok)
}

const deleteCtxFile = ref<WorkspaceFileEntry | null>(null)

function ctxDeleteFile() {
  const f = ctxFile.value
  closeContextMenu()
  if (!f) return
  deleteCtxFile.value = f
  isShowDeletePopup.value = true
}

function ctxRenameFile() {
  const f = ctxFile.value
  closeContextMenu()
  if (!f) return
  renameCtxFile.value = f
  renamePopupFileName.value = f.name
  renamePopupFileType.value = f.type || ''
  isShowRenamePopup.value = true
}

async function ctxOpenTerminalHere() {
  const root = workspaceRoot.value
  closeContextMenu()
  if (!root) return
  try {
    await window.electronAPI.openTerminalAt(root)
  } catch {
    /* ignore */
  }
}

const onDocPointerDown = (e: MouseEvent) => {
  const t = e.target as HTMLElement
  if (t.closest('.ctx-menu')) return
  closeContextMenu()
}

watch(workspaceRoot, (r) => {
  expandedFolders.value = loadExpandedForRoot(r)
})

onMounted(async () => {
  const last = await window.electronAPI.stickyGetLastWorkspace()
  if (last) {
    workspaceRoot.value = last
    expandedFolders.value = loadExpandedForRoot(last)
    refreshWorkspace()
  }
  window.addEventListener('keydown', onGlobalKeydown)
  document.addEventListener('mousedown', onDocPointerDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
  document.removeEventListener('mousedown', onDocPointerDown)
  endSidebarResize()
})

const isShowDeletePopup = ref(false)
const isShowRenamePopup = ref(false)
const renameCtxFile = ref<WorkspaceFileEntry | null>(null)
const renamePopupFileName = ref('')
const renamePopupFileType = ref('')
const isShowSavePopup = ref(false)
const savePopupFileName = ref('')
const savePopupFileType = ref('txt')

const handleDeletePopupSure = () => {
  const f = deleteCtxFile.value
  if (!f || !workspaceRoot.value) {
    isShowDeletePopup.value = false
    deleteCtxFile.value = null
    return
  }
  window.electronAPI
    .deleteFile(f.relPath, workspaceRoot.value)
    .then((data: boolean) => {
      refreshWorkspace()
      if (data) {
        const open = tabs.value.find((t) => t.id === f.relPath)
        if (open) doCloseTab(f.relPath)
      }
      setResultPopup(data ? '删除成功' : '删除失败', data)
      isShowDeletePopup.value = false
      deleteCtxFile.value = null
    })
    .catch(() => {
      setResultPopup('删除失败', false)
      isShowDeletePopup.value = false
      deleteCtxFile.value = null
    })
}

watch(isShowDeletePopup, (open) => {
  if (!open) deleteCtxFile.value = null
})

const handleRenamePopupSure = () => {
  const f = renameCtxFile.value
  const root = workspaceRoot.value
  if (!f || !root) {
    isShowRenamePopup.value = false
    renameCtxFile.value = null
    return
  }
  const name = renamePopupFileName.value.trim()
  const type = renamePopupFileType.value.trim()
  if (!name) {
    setResultPopup('请输入文件名', false)
    return
  }
  const oldRel = f.relPath
  const normOld = oldRel.replace(/\\/g, '/')
  const parent = normOld.includes('/') ? normOld.slice(0, normOld.lastIndexOf('/')) : ''
  const newRelPath = parent ? `${parent}/${type ? `${name}.${type}` : name}` : type ? `${name}.${type}` : name
  const oldId = oldRel

  window.electronAPI
    .renameWorkspaceFile(oldRel, name, type, root)
    .then((ok: boolean) => {
      if (!ok) {
        setResultPopup('重命名失败（名称无效或已存在同名文件）', false)
        return
      }
      const tab = tabs.value.find((t) => t.id === oldId)
      if (tab) {
        tab.name = name
        tab.type = type
        tab.relPath = newRelPath
        tab.id = newRelPath
        if (activeId.value === oldId) activeId.value = newRelPath
      }
      refreshWorkspace()
      setResultPopup('重命名成功', true)
      isShowRenamePopup.value = false
      renameCtxFile.value = null
    })
    .catch(() => {
      setResultPopup('重命名失败', false)
      isShowRenamePopup.value = false
      renameCtxFile.value = null
    })
}

const handleSavePopupSure = () => {
  const root = workspaceRoot.value
  const id = saveTargetTabId.value
  const tab = tabs.value.find((x) => x.id === id)
  if (!tab || !root) {
    isShowSavePopup.value = false
    return
  }
  const name = savePopupFileName.value.trim()
  const type = savePopupFileType.value.trim() || HTML
  if (!name) {
    setResultPopup('请输入文件名', false)
    return
  }
  const newRelPath = type ? `${name}.${type}` : name
  const oldTabId = tab.id
  tabs.value = tabs.value.filter((x) => x.id === tab.id || x.id !== newRelPath)

  tab.name = name
  tab.type = type
  tab.relPath = newRelPath
  tab.id = newRelPath
  activeId.value = newRelPath

  window.electronAPI.saveFile(name, type, tab.content, root).then(
    (ok: boolean) => {
      if (ok) {
        tab.savedContent = tab.content
        refreshWorkspace()
      }
      savePopupFileName.value = ''
      isShowSavePopup.value = false
      setResultPopup(ok ? '保存成功' : '保存失败', ok)

      const pend = pendingCloseAfterSaveId.value
      if (ok && pend === oldTabId) {
        pendingCloseAfterSaveId.value = null
        doCloseTab(tab.id)
      }
    },
    () => {
      savePopupFileName.value = ''
      isShowSavePopup.value = false
      setResultPopup('保存失败', false)
    }
  )
}

const isShowResultPopup = ref(false)
const resultPopupContent = ref('')
const resultColor = ref(false)

const setResultPopup = async (content: string, color: boolean) => {
  isShowResultPopup.value = false
  resultPopupContent.value = content
  resultColor.value = color
  await nextTick()
  isShowResultPopup.value = true
  setTimeout(() => {
    isShowResultPopup.value = false
  }, 2500)
}

const closeDirtyTab = computed(() =>
  closeDirtyTabId.value ? tabs.value.find((t) => t.id === closeDirtyTabId.value) : null
)

const workspaceLabel = computed(() => {
  if (!workspaceRoot.value) return '未打开文件夹（在左侧空白处右键）'
  return workspaceRoot.value
})
</script>

<template>
  <div class="sticky-note">
    <Popup v-model="isShowDeletePopup" title="永久删除文件" width="540px" height="240px" @sure="handleDeletePopupSure">
      <h3>删除后，该文件将不可恢复。确认删除吗？</h3>
      <p v-if="deleteCtxFile" class="delete-name">
        {{ deleteCtxFile.relPath }}
      </p>
      <template #sure-text>确认</template>
      <template #close-text>取消</template>
    </Popup>

    <Popup
      v-model="isShowNewInFolderPopup"
      title="在文件夹中新建文件"
      width="640px"
      height="420px"
      @sure="handleNewInFolderSure"
      @close="newInFolderParentRel = ''"
    >
      <form class="popup-form" @submit.prevent>
        <label for="newInFolderName">
          文件名称：
          <input id="newInFolderName" v-model="newInFolderFileName" type="text" placeholder="不含扩展名" />
        </label>
        <label for="newInFolderType">
          文件类型：
          <input id="newInFolderType" v-model="newInFolderFileType" type="text" placeholder="如 html、txt" />
        </label>
      </form>
      <template #sure-text>创建</template>
      <template #close-text>取消</template>
    </Popup>

    <Popup
      v-model="isShowRenamePopup"
      title="重命名文件"
      width="640px"
      height="420px"
      @sure="handleRenamePopupSure"
      @close="renameCtxFile = null"
    >
      <form class="popup-form" @submit.prevent>
        <label for="renameFileName">
          文件名称：
          <input id="renameFileName" v-model="renamePopupFileName" type="text" placeholder="请输入文件名" />
        </label>
        <label for="renameFileType">
          扩展名（可留空）：
          <input id="renameFileType" v-model="renamePopupFileType" type="text" placeholder="如 html、txt" />
        </label>
      </form>
      <template #sure-text>确认</template>
      <template #close-text>取消</template>
    </Popup>

    <Popup v-model="isShowSavePopup" title="保存文件" width="640px" height="420px" @sure="handleSavePopupSure">
      <form class="popup-form" @submit.prevent>
        <label for="fileName">
          文件名称：
          <input id="fileName" v-model="savePopupFileName" type="text" placeholder="请输入文件名" />
        </label>
        <label for="fileType">
          文件类型：
          <input id="fileType" v-model="savePopupFileType" type="text" placeholder="如 html、txt" />
        </label>
      </form>
      <template #sure-text>确认</template>
      <template #close-text>取消</template>
    </Popup>

    <div
      :id="resultColor ? 'green' : 'red'"
      class="popup-container"
      :class="{ tip: isShowResultPopup }"
      v-if="isShowResultPopup"
    >
      <div class="img"></div>
      <div class="content">{{ resultPopupContent }}</div>
    </div>

    <div v-if="showCloseDirty" class="dirty-overlay" @click.self="closeDirtyCancel">
      <div class="dirty-dialog">
        <h3 class="dirty-title">是否保存更改？</h3>
        <p class="dirty-hint">「{{ closeDirtyTab ? tabTitle(closeDirtyTab) : '' }}」有未保存的修改。</p>
        <div class="dirty-actions">
          <button type="button" class="dirty-btn primary" @click="closeDirtySave">保存</button>
          <button type="button" class="dirty-btn" @click="closeDirtyDiscard">不保存</button>
          <button type="button" class="dirty-btn" @click="closeDirtyCancel">取消</button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-show="ctxVisible"
        class="ctx-menu"
        :style="{ left: ctxX + 'px', top: ctxY + 'px' }"
        @mousedown.stop
        @contextmenu.prevent
      >
        <template v-if="ctxKind === 'root'">
          <button type="button" class="ctx-item" @click="ctxOpenFolder">打开文件夹…</button>
          <button type="button" class="ctx-item" @click="ctxOpenFile">打开文件…</button>
          <button type="button" class="ctx-item" @click="ctxNewFile">新建文件</button>
          <button type="button" class="ctx-item" :disabled="!workspaceRoot" @click="ctxRefresh">刷新</button>
          <button type="button" class="ctx-item" :disabled="!workspaceRoot" @click="ctxOpenTerminalHere">
            打开系统终端
          </button>
        </template>
        <template v-else-if="ctxKind === 'folder'">
          <button type="button" class="ctx-item" @click="ctxNewFileInFolder">新建文件</button>
          <button type="button" class="ctx-item" @click="ctxOpenFolderInOS">打开文件夹所在位置</button>
        </template>
        <template v-else-if="ctxKind === 'file'">
          <button type="button" class="ctx-item" @click="ctxRenameFile">重命名</button>
          <button type="button" class="ctx-item" @click="ctxSaveFile">保存</button>
          <button type="button" class="ctx-item danger" @click="ctxDeleteFile">删除</button>
        </template>
      </div>
    </Teleport>

    <div class="vscode-root" :class="{ 'sidebar-resizing': sidebarResizing }">
      <aside
        class="sidebar"
        :style="{ width: sidebarWidthPx + 'px' }"
        @contextmenu="onRootContextMenu"
      >
        <div class="sidebar-sub" :title="workspaceLabel">{{ workspaceLabel }}</div>
        <ul class="file-list">
          <template v-for="row in flatExplorerRows" :key="row.kind + ':' + row.relPath">
            <li
              v-if="row.kind === 'folder'"
              class="explorer-row explorer-folder"
              :style="{ paddingLeft: 6 + row.depth * 16 + 'px' }"
              @click.stop="toggleFolderExpanded(row.relPath)"
              @contextmenu.stop.prevent="openFolderCtxMenu($event, row)"
            >
              <span class="explorer-chevron-wrap" aria-hidden="true">
                <svg
                  class="explorer-chevron"
                  :class="{ open: expandedFolders.has(row.relPath) }"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    d="M6 4l4 4-4 4V4z"
                  />
                </svg>
              </span>
              <svg class="explorer-icon explorer-icon-folder" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="currentColor"
                  d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
                />
              </svg>
              <span class="explorer-label" :title="row.name">{{ row.name }}</span>
            </li>
            <li
              v-else
              class="explorer-row explorer-file file-item"
              :class="{ active: isSidebarFileActive(row.relPath) }"
              :style="{ paddingLeft: 6 + row.depth * 16 + 'px' }"
              @click="openFileInSidebar(row as WorkspaceFileEntry)"
              @contextmenu="onFileContextMenu($event, row as WorkspaceFileEntry)"
            >
              <span class="explorer-chevron-spacer" aria-hidden="true" />
              <svg class="explorer-icon explorer-icon-file" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="currentColor"
                  d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"
                />
              </svg>
              <span
                class="explorer-name-cell"
                :title="row.type ? `${row.name}.${row.type}` : row.name"
              >
                <span class="file-name">{{ row.name }}</span><span v-if="row.type" class="file-ext">.{{ row.type }}</span>
              </span>
            </li>
          </template>
          <li v-if="!workspaceTree.length && !workspaceRoot" class="file-empty">
            在左侧空白处右键，选择「打开文件夹」或「打开文件」
          </li>
          <li v-else-if="!flatExplorerRows.length && workspaceRoot" class="file-empty">此文件夹中暂无文件</li>
        </ul>
      </aside>

      <div
        class="sidebar-resizer"
        role="separator"
        aria-orientation="vertical"
        aria-label="拖动调整资源管理器宽度"
        title="拖动调整宽度，双击恢复默认"
        @mousedown="onSidebarResizeStart"
        @dblclick.prevent="onSidebarResizerDblClick"
      />

      <div class="main-col">
        <div class="tab-bar">
          <div
            v-for="tab in tabs"
            :key="tab.id"
            class="tab"
            :class="{ active: tab.id === activeId }"
            @click="activeId = tab.id"
          >
            <span v-if="isDirty(tab)" class="dirty-dot" title="未保存">●</span>
            <span class="tab-label" :title="tabTitle(tab)">{{ tabTitle(tab) }}</span>
            <button type="button" class="tab-close" title="关闭" @click.stop="requestCloseTab(tab.id)">×</button>
          </div>
          <!-- <div v-if="!tabs.length" class="tab-placeholder">无打开的文件</div> -->
        </div>

        <div class="editor-shell">
          <TextEditor
            v-if="activeTab"
            :key="activeTab.id"
            :model-value="activeTab.content"
            :language="highlightLanguageFromExtension(activeTab.type)"
            @update:model-value="onEditorUpdate"
          />
          <div v-else class="empty-editor">从左侧打开文件，或在资源管理器空白处右键「新建文件」</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sticky-note {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  width: 100%;
  background-color: var(--light-main-bgc);
}

.delete-name {
  margin: 10px 0 0;
  font-size: 16px;
  color: var(--light-font-second-color, #626262);
  font-family: consolas, monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.new-in-folder-hint {
  margin: 0 0 12px;
  font-size: 18px;
  color: var(--light-font-second-color, #626262);
  font-family: consolas, monospace;
  word-break: break-all;
}

.sticky-note > .popup-container {
  position: fixed;
  left: 50%;
  bottom: 20%;
  z-index: 10000;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 10px;
  height: 68px;
  background-color: rgb(251, 246, 246);
  padding: 6px;
  opacity: 0;
  user-select: none;
}

.tip {
  animation: up 2.5s ease;
}

@keyframes up {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0%);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-400%);
  }
}

#red {
  background-color: rgb(255, 141, 131);
}

#green {
  background-color: rgb(152, 243, 207);
}

.sticky-note > .popup-container > .img {
  width: 50px;
  height: 50px;
  background-image: url(../../public/water.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 15px;
  margin-left: 5px;
}

.sticky-note > .popup-container > .content {
  margin: 0 12px 0 22px;
  font-size: 26px;
  color: white;
}

.popup-form {
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-self: center;
  height: 100%;
  font-size: 26px;
}

.popup-form > label {
  margin: 22px 0;
}

.popup-form input {
  padding: 12px 16px;
  border: none;
  font-size: 26px;
  background-color: transparent;
}

.popup-form input:focus {
  outline: none;
}

.ctx-menu {
  position: fixed;
  z-index: 13000;
  min-width: 200px;
  padding: 6px 0;
  border-radius: 8px;
  background: var(--light-main-bgc, #f9f9f9);
  border: 1px solid var(--light-option-second-bgc, #ddd);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.ctx-item {
  display: block;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  text-align: left;
  font-size: 20px;
  color: var(--light-font-color, #262626);
  cursor: pointer;
}

.ctx-item:hover:not(:disabled) {
  background: var(--light-item-bgc, #eee);
}

.ctx-item:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.ctx-item.danger {
  color: #c42b1c;
}

/* --- VS Code 布局 --- */
.vscode-root {
  display: flex;
  flex: 1;
  min-height: 0;
  min-width: 0;
}

.vscode-root.sidebar-resizing {
  cursor: col-resize;
  user-select: none;
}

.sidebar {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-right: 1px solid var(--light-option-second-bgc, #e0e0e0);
  background-color: var(--light-second-bgc, #f2f2f2);
  user-select: none;
}

.sidebar-resizer {
  flex-shrink: 0;
  width: 5px;
  margin-left: -1px;
  cursor: col-resize;
  background: transparent;
  z-index: 2;
  position: relative;
}

.sidebar-resizer:hover,
.vscode-root.sidebar-resizing .sidebar-resizer {
  background: var(--light-option-second-bgc, #c8c8c8);
}

.sidebar-resizer::after {
  content: '';
  position: absolute;
  inset: 0;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
  background: var(--light-option-second-bgc, #e0e0e0);
  pointer-events: none;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  font-size: 17px;
  font-weight: 600;
  color: var(--light-font-color, #262626);
}

.sidebar-title {
  letter-spacing: 0.02em;
}

.sidebar-sub {
  padding: 0 14px 8px;
  font-size: 25px;
  color: var(--light-font-second-color, #626262);
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.file-list {
  list-style: none;
  margin: 0;
  padding: 6px 0;
  overflow: auto;
  flex: 1;
  min-height: 0;
}

.explorer-row {
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 36px;
  min-width: 0;
  padding: 6px 10px 6px 0;
  font-size: 22px;
  font-family: consolas, Microsoft YaHei, sans-serif;
  color: var(--light-font-color, #262626);
  list-style: none;
}

.explorer-folder {
  cursor: pointer;
  user-select: none;
}

.explorer-folder:hover {
  background-color: var(--light-item-bgc, #f5f5f5);
}

.explorer-chevron-wrap {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.explorer-chevron {
  width: 14px;
  height: 14px;
  transition: transform 0.12s ease;
  color: var(--light-font-second-color, #666);
}

.explorer-chevron.open {
  transform: rotate(90deg);
}

.explorer-chevron-spacer {
  width: 20px;
  flex-shrink: 0;
}

.explorer-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.explorer-icon-folder {
  color: #c9a227;
}

.explorer-icon-file {
  color: var(--light-svg-main-fill, #888);
}

.explorer-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.explorer-name-cell {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.explorer-name-cell .file-name,
.explorer-name-cell .file-ext {
  font-size: inherit;
}

.file-item {
  display: flex;
  align-items: baseline;
  gap: 4px;
  padding: 15px 14px;
  font-size: 25px;
  font-family: consolas, Microsoft YaHei;
  cursor: pointer;
  color: var(--light-font-color, #262626);
}

.explorer-file.file-item {
  padding: 8px 10px 8px 0;
  font-size: 22px;
  align-items: center;
}

.file-item:hover {
  background-color: var(--light-item-bgc, #f5f5f5);
}

.file-item.active {
  background-color: var(--light-option-bgc, #f9f9f9);
  border-left: 3px solid #0078d4;
  padding-left: 11px;
}

.explorer-file.file-item.active {
  border-left: none;
  padding-left: 0;
  box-shadow: inset 3px 0 0 #0078d4;
}

.file-ext {
  opacity: 0.75;
}

.explorer-file .file-ext {
  font-size: 22px;
}

.file-empty {
  padding: 14px;
  font-size: 14px;
  color: var(--light-font-second-color, #626262);
  line-height: 1.55;
}

.main-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 14px;
  border-bottom: 1px solid var(--light-option-second-bgc, #e0e0e0);
  background-color: var(--light-main-bgc, #f9f9f9);
}

.top-hint {
  font-size: 15px;
  color: var(--light-font-second-color, #626262);
  flex: 1;
  min-width: 0;
  line-height: 1.4;
}

.tab-bar {
  display: flex;
  align-items: stretch;
  flex-wrap: nowrap;
  overflow-x: auto;
  min-height: 44px;
  background-color: var(--light-second-bgc, #ececec);
  border-bottom: 1px solid var(--light-option-second-bgc, #ddd);
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  max-width: 260px;
  min-width: 0;
  font-size: 25px;
  font-family: consolas, Microsoft YaHei;
  color: var(--light-font-second-color, #626262);
  border-right: 1px solid var(--light-option-second-bgc, #ddd);
  cursor: pointer;
  background-color: var(--light-second-bgc, #ececec);
}

.tab.active {
  background-color: var(--light-main-bgc, #f9f9f9);
  color: var(--light-font-color, #262626);
  border-bottom: 2px solid #0078d4;
}

.tab-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dirty-dot {
  color: #0078d4;
  font-size: 12px;
  line-height: 1;
  flex-shrink: 0;
}

.tab-close {
  border: none;
  background: transparent;
  font-size: 18px;
  line-height: 1;
  padding: 0 6px;
  cursor: pointer;
  color: inherit;
  opacity: 0.65;
  flex-shrink: 0;
}

.tab-close:hover {
  opacity: 1;
}

.tab-placeholder {
  padding: 10px 14px;
  font-size: 14px;
  color: var(--light-font-second-color, #626262);
}

.editor-shell {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  /* 与编辑区同色，避免内容未撑满时下方透出 main 底色 */
  background-color: var(--light-todo-editor-bgc, #f9f9f9);
}

.editor-shell :deep(.editor-container) {
  flex: 1;
  min-height: 0;
}

.empty-editor {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-size: 20px;
  color: var(--light-font-second-color, #626262);
  background-color: var(--light-todo-editor-bgc, #f9f9f9);
  text-align: center;
  line-height: 1.5;
}

.dirty-overlay {
  position: fixed;
  inset: 0;
  z-index: 12000;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dirty-dialog {
  width: min(480px, 90vw);
  padding: 24px 26px;
  border-radius: 10px;
  background: var(--light-main-bgc, #f9f9f9);
  color: var(--light-font-color, #262626);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.dirty-title {
  margin: 0 0 10px;
  font-size: 25px;
}

.dirty-hint {
  margin: 0 0 22px;
  font-size: 25px;
  color: var(--light-font-second-color, #626262);
  line-height: 1.45;
}

.dirty-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

.dirty-btn {
  font-size: 20px;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid var(--light-svg-fill, #999);
  background: var(--light-option-bgc, #fff);
  color: var(--light-font-color, #262626);
  cursor: pointer;
}

.dirty-btn.primary {
  background: #0078d4;
  border-color: #0078d4;
  color: #fff;
}

.dirty-btn:hover {
  filter: brightness(1.03);
}
</style>
