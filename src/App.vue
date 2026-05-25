<template>
  <div id="app">
    <!-- 应用头部 -->
    <AppHeader
      :show-settings-panel="showSettingsPanel"
      :view-mode="viewMode"
      :copy-format-options="copyFormatOptions"
      :selected-copy-format="selectedCopyFormat"
      :has-content="hasContent"
      :export-format-options="exportFormatOptions"
      :is-exporting="isExporting"
      logo-src="./logo.svg"
      logo-alt="Modern MD Editor"
      @open-github="openGithub"
      @toggle-settings="toggleSettingsPanel"
      @set-view-mode="setViewMode"
      @show-guide="showGuide"
      @copy-format-select="handleCopyFormatSelect"
      @update:selected-copy-format="selectedCopyFormat.value = $event"
      @export-format-select="handleExportFormatSelect"
      @preload-settings="preloadSettingsPanel"
      @preload-guide="preloadMarkdownGuide"
      @ai-select="handleAiSelect"
    />

    <!-- 隐藏文件输入：用于导入 .md -->
    <input ref="fileInputRef" type="file" accept=".md,text/markdown,.txt" style="display:none" @change="handleFileChosen" />

    <!-- 主内容区域 -->
    <AppMain
      :markdown-content="markdownContent"
      :sync-scroll-enabled="syncScrollEnabled"
      :view-mode="viewMode"
      @update:markdown-content="updateMarkdownContent"
      @clear-content="clearContent"
      @load-sample="loadSample"
      @html-generated="updateHtmlContent"
      @import-markdown="triggerImportMd"
      @toggle-sync-scroll="toggleSyncScroll"
    />

    <!-- 大纲视图 -->
    <OutlinePanel :markdown-content="markdownContent" />

    <!-- 全局回到顶部悬浮按钮 -->
    <BackToTopFloat />

    <!-- 应用底部 -->
    <AppFooter
      :character-count="characterCount"
      :line-count="lineCount"
      :word-count="wordCount"
      :estimated-read-time="estimatedReadTime"
      :sync-scroll-enabled="syncScrollEnabled"
      @toggle-sync-scroll="toggleSyncScroll"
    />

    <!-- 通知组件 -->
    <div v-if="notifications.length > 0" class="notification-container">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', notification.type, { 'slide-out': notification.isRemoving }]"
      >
        {{ notification.message }}
      </div>
    </div>

    <!-- 设置面板 -->
    <SettingsPanel
      :visible="showSettingsPanel"
      @close="closeSettingsPanel"
      @show-notification="showNotification"
    />

    <!-- Markdown 语法指南 -->
    <MarkdownGuide
      :show="showMarkdownGuide"
      @close="closeGuide"
    />

    <!-- AI 对话框 -->
    <AiPolishDialog
      :visible="showAiPolishDialog"
      :selected-text="currentSelectedText"
      :is-loading="isPolishing"
      :result="polishResult"
      :error="aiError"
      @close="closeAiDialogs"
      @polish="handlePolishRequest"
      @replace="handlePolishReplace"
    />

    <AiTitleDialog
      :visible="showAiTitleDialog"
      :is-loading="isGeneratingTitle"
      :titles="titleResults"
      :error="aiError"
      @close="closeAiDialogs"
      @insert="handleTitleInsert"
    />

    <AiSummaryDialog
      :visible="showAiSummaryDialog"
      :is-loading="isGeneratingSummary"
      :summary="summaryResult"
      :error="aiError"
      @close="closeAiDialogs"
      @insert="handleSummaryInsert"
    />

    <AiImageDialog
      :visible="showAiImageDialog"
      :is-loading="isGeneratingImage"
      :image-data="imageResult"
      :error="aiError"
      @close="closeAiDialogs"
      @generate="handleImageGenerate"
    />

    <AiKeyMissingDialog
      :visible="showAiKeyMissingDialog"
      :message="keyMissingMessage"
      @close="closeAiDialogs"
      @go-settings="handleGoToAiSettings"
    />
  </div>
</template>

<script setup>
import { ref, nextTick, defineAsyncComponent } from 'vue'
import { useAppState, useElectron, useGlobalThemeManager } from './composables/index.js'
import AppHeader from './components/layout/AppHeader.vue'
import AppMain from './components/layout/AppMain.vue'
import AppFooter from './components/layout/AppFooter.vue'
// 提取 import 函数，支持 hover 预加载
const loadSettingsPanel = () => import('./components/SettingsPanel.vue')
const loadMarkdownGuide = () => import('./components/MarkdownGuide.vue')
const SettingsPanel = defineAsyncComponent(loadSettingsPanel)
const MarkdownGuide = defineAsyncComponent(loadMarkdownGuide)

// AI 对话框组件（懒加载）
const AiPolishDialog = defineAsyncComponent(() => import('./components/ai/AiPolishDialog.vue'))
const AiTitleDialog = defineAsyncComponent(() => import('./components/ai/AiTitleDialog.vue'))
const AiSummaryDialog = defineAsyncComponent(() => import('./components/ai/AiSummaryDialog.vue'))
const AiImageDialog = defineAsyncComponent(() => import('./components/ai/AiImageDialog.vue'))
const AiKeyMissingDialog = defineAsyncComponent(() => import('./components/ai/AiKeyMissingDialog.vue'))

// 预加载方法：鼠标悬停按钮时提前加载 chunk
const preloadSettingsPanel = () => { loadSettingsPanel() }
const preloadMarkdownGuide = () => { loadMarkdownGuide() }
import BackToTopFloat from './components/BackToTopFloat.vue'
import OutlinePanel from './components/OutlinePanel.vue'

// 使用应用状态管理
const {
  // 状态
  markdownContent,
  showSettingsPanel,
  showMarkdownGuide,
  syncScrollEnabled,
  viewMode,
  notifications,
  selectedCopyFormat,
  copyFormatOptions,
  exportFormatOptions,
  isExporting,

  // 计算属性
  hasContent,
  characterCount,
  lineCount,
  wordCount,
  estimatedReadTime,

  // 方法
  updateMarkdownContent,
  clearContent,
  loadSample,
  updateHtmlContent,
  toggleSettingsPanel,
  closeSettingsPanel,
  showGuide,
  closeGuide,
  toggleSyncScroll,
  setViewMode,
  showNotification,
  handleCopyFormatSelect,
  handleExportFormatSelect,
  openGithub,

  // AI 状态和方法
  isPolishing,
  isGeneratingTitle,
  isGeneratingSummary,
  isGeneratingImage,
  polishResult,
  titleResults,
  summaryResult,
  imageResult,
  aiError,
  showAiPolishDialog,
  showAiTitleDialog,
  showAiSummaryDialog,
  showAiImageDialog,
  showAiKeyMissingDialog,
  keyMissingMessage,
  currentSelectedText,
  handleAiSelect,
  handlePolishRequest,
  handlePolishReplace,
  handleTitleInsert,
  handleSummaryInsert,
  handleImageGenerate,
  handleGoToAiSettings,
  closeAiDialogs
} = useAppState()

// 使用Electron集成
const {
  openFile,
  saveFile,
  setupMenuListeners,
  setupFileUpdateListener,
  currentFilePath
} = useElectron()

// 设置菜单监听器
nextTick(() => {
  setupMenuListeners({
    onOpenFile: (_event, { filePath, content }) => {
      updateMarkdownContent(content)
      openFile(filePath, content)
      const fileName = filePath.split('/').pop() || filePath.split('\\').pop()
      showNotification(`已打开文件: ${fileName}`, 'success')
    },
    onSaveFile: async () => {
      try {
        const result = await saveFile(markdownContent.value)
        if (result.success) {
          const fileName = result.filePath.split('/').pop() || result.filePath.split('\\').pop()
          showNotification(`文件已保存: ${fileName}`, 'success')
        } else {
          showNotification(`保存失败: ${result.message}`, 'error')
        }
      } catch (error) {
        showNotification(`保存失败: ${error.message}`, 'error')
      }
    }
  })

  // 设置文件内容更新监听器
  setupFileUpdateListener((_event, { filePath, content }) => {
    if (currentFilePath.value === filePath && markdownContent.value !== content) {
      updateMarkdownContent(content)
      const fileName = filePath.split('/').pop() || filePath.split('\\').pop()
      showNotification(`文件已更新: ${fileName}`)
    }
  })
})

// 初始化主题管理器（全局单例内部已自动调用 initialize）
useGlobalThemeManager()

// 导入：隐藏文件输入
const fileInputRef = ref(null)
const triggerImportMd = () => fileInputRef.value && fileInputRef.value.click()

const handleFileChosen = async (e) => {
  const file = e.target.files && e.target.files[0]
  // 允许重复选择同一个文件
  e.target.value = ''
  if (!file) return
  if (!/\.(md|markdown)$/i.test(file.name) && !/text\/markdown|text\/plain/.test(file.type)) {
    showNotification('仅支持导入 .md 文件', 'warning')
    return
  }
  try {
    const text = await file.text()
    updateMarkdownContent(text)
    showNotification(`已导入: ${file.name}`, 'success')
  } catch (err) {
    showNotification(`导入失败: ${err.message}`, 'error')
  }
}

</script>

<style scoped>
/* 导入原来的样式 */
@import './styles/components/layout/app-layout.css';
@import './styles/components/notifications.css';


</style>
