/**
 * @file src/composables/useAppState.js
 * @description 应用状态管理 Composable
 *
 * 重构后的组合器，整合所有功能域的 composables：
 * - 内容状态管理 (useContentState)
 * - UI状态管理 (useUIState)
 * - 通知系统 (useNotification)
 * - 剪贴板功能 (useClipboard)
 *
 * 保持对外接口的完全兼容性，同时提供更好的模块化架构。
 */

import { ref } from 'vue'
import { useContentState } from './useContentState.js'
import { useUIState } from './useUIState.js'
import { useNotification } from './useNotification.js'
import { useClipboard } from './useClipboard.js'
import { useExport } from './useExport.js'
import { useAI } from './useAI.js'
import { useSharedEditorView } from '../shared/composables/useSharedEditorView.js'
import { EXTERNAL_LINKS } from '../config/constants/links.js'

export function useAppState() {
  // 初始化各个功能域的 composables
  const notification = useNotification()

  // 内容状态管理 - 传入通知回调
  const contentState = useContentState({
    onNotify: notification.showNotification
  })

  // UI状态管理
  const uiState = useUIState()

  // 剪贴板功能 - 传入通知回调和内容获取函数
  const clipboard = useClipboard({
    onNotify: notification.showNotification,
    getContent: () => contentState.markdownContent.value
  })

  // 导出功能 - 传入通知回调和内容获取函数
  const exportState = useExport({
    onNotify: notification.showNotification,
    getContent: () => contentState.markdownContent.value
  })

  // 外部链接功能
  const openGithub = () => {
    window.open(EXTERNAL_LINKS.GITHUB_REPO, '_blank')
  }

  // AI 功能
  const ai = useAI()
  const sharedEditor = useSharedEditorView()

  const showAiPolishDialog = ref(false)
  const showAiTitleDialog = ref(false)
  const showAiSummaryDialog = ref(false)
  const showAiImageDialog = ref(false)
  const showAiKeyMissingDialog = ref(false)
  const keyMissingMessage = ref('')
  const currentSelectedText = ref('')

  function showKeyMissing(message) {
    keyMissingMessage.value = message
    showAiKeyMissingDialog.value = true
  }

  function handleGoToAiSettings() {
    showAiKeyMissingDialog.value = false
    uiState.showSettingsPanel.value = true
  }

  function openAiPolish() {
    if (!ai.hasTextApiKey()) {
      showKeyMissing('使用 AI 润色功能需要配置文本模型（DeepSeek）的 API Key。请在设置中完成配置后重试。')
      return
    }
    const text = sharedEditor.getSelectedText()
    if (!text) {
      notification.showNotification('请先在编辑器中选择要润色的文本', 'warning')
      return
    }
    currentSelectedText.value = text
    ai.resetResults()
    showAiPolishDialog.value = true
  }

  function openAiTitle() {
    if (!contentState.markdownContent.value.trim()) {
      notification.showNotification('请先输入文章内容', 'warning')
      return
    }
    if (!ai.hasTextApiKey()) {
      showKeyMissing('使用生成标题功能需要配置文本模型（DeepSeek）的 API Key。请在设置中完成配置后重试。')
      return
    }
    ai.resetResults()
    showAiTitleDialog.value = true
    ai.generateTitles(contentState.markdownContent.value).catch(() => {})
  }

  function openAiSummary() {
    if (!contentState.markdownContent.value.trim()) {
      notification.showNotification('请先输入文章内容', 'warning')
      return
    }
    if (!ai.hasTextApiKey()) {
      showKeyMissing('使用生成摘要功能需要配置文本模型（DeepSeek）的 API Key。请在设置中完成配置后重试。')
      return
    }
    ai.resetResults()
    showAiSummaryDialog.value = true
    ai.generateSummary(contentState.markdownContent.value).catch(() => {})
  }

  function openAiImage() {
    if (!ai.hasImageApiKey()) {
      showKeyMissing('使用生成配图功能需要配置图片模型（Gemini）的 API Key。请在设置中完成配置后重试。')
      return
    }
    ai.resetResults()
    showAiImageDialog.value = true
  }

  function closeAiDialogs() {
    showAiPolishDialog.value = false
    showAiTitleDialog.value = false
    showAiSummaryDialog.value = false
    showAiImageDialog.value = false
    showAiKeyMissingDialog.value = false
  }

  async function handlePolishRequest({ content, instructions }) {
    try {
      await ai.polishText(content, instructions)
    } catch {
      // error 已在 useAI 中设置
    }
  }

  function handlePolishReplace(polishedText) {
    sharedEditor.replaceSelectedText(polishedText)
    notification.showNotification('文字已润色并替换', 'success')
    showAiPolishDialog.value = false
  }

  function handleTitleInsert(title) {
    const currentContent = contentState.markdownContent.value
    const prefix = currentContent.startsWith('# ') ? '' : '# '
    contentState.updateMarkdownContent(prefix + title + '\n\n' + currentContent)
    notification.showNotification('标题已插入', 'success')
    showAiTitleDialog.value = false
  }

  function handleSummaryInsert(summary) {
    const content = contentState.markdownContent.value
    contentState.updateMarkdownContent(content + '\n\n> **摘要**：' + summary)
    notification.showNotification('摘要已插入', 'success')
    showAiSummaryDialog.value = false
  }

  async function handleImageGenerate(prompt) {
    try {
      await ai.generateImage(prompt)
    } catch {
      // error 已在 useAI 中设置
    }
  }

  function handleAiSelect(action) {
    switch (action) {
      case 'polish': openAiPolish(); break
      case 'title': openAiTitle(); break
      case 'summary': openAiSummary(); break
      case 'image': openAiImage(); break
    }
  }

  return {
    // 内容状态 (来自 useContentState)
    markdownContent: contentState.markdownContent,
    htmlContent: contentState.htmlContent,
    hasContent: contentState.hasContent,
    isHtmlReady: contentState.isHtmlReady,
    characterCount: contentState.characterCount,
    lineCount: contentState.lineCount,
    wordCount: contentState.wordCount,
    estimatedReadTime: contentState.estimatedReadTime,
    updateMarkdownContent: contentState.updateMarkdownContent,
    updateHtmlContent: contentState.updateHtmlContent,
    clearContent: contentState.clearContent,
    loadSample: contentState.loadSample,

    // UI状态 (来自 useUIState)
    showSettingsPanel: uiState.showSettingsPanel,
    showMarkdownGuide: uiState.showMarkdownGuide,
    syncScrollEnabled: uiState.syncScrollEnabled,
    viewMode: uiState.viewMode,
    toggleSettingsPanel: uiState.toggleSettingsPanel,
    closeSettingsPanel: uiState.closeSettingsPanel,
    showGuide: uiState.showGuide,
    closeGuide: uiState.closeGuide,
    toggleSyncScroll: uiState.toggleSyncScroll,
    enableSyncScroll: uiState.enableSyncScroll,
    disableSyncScroll: uiState.disableSyncScroll,
    setViewMode: uiState.setViewMode,
    toggleViewMode: uiState.toggleViewMode,
    showBothPanes: uiState.showBothPanes,
    showEditorOnly: uiState.showEditorOnly,
    showPreviewOnly: uiState.showPreviewOnly,

    // 通知系统 (来自 useNotification)
    notifications: notification.notifications,
    showNotification: notification.showNotification,
    removeNotification: notification.removeNotification,

    // 剪贴板功能 (来自 useClipboard)
    copyFormatOptions: clipboard.copyFormatOptions,
    selectedCopyFormat: clipboard.selectedCopyFormat,
    handleCopyFormatSelect: clipboard.handleCopyFormatSelect,

    // 导出功能 (来自 useExport)
    exportFormatOptions: exportState.exportFormatOptions,
    isExporting: exportState.isExporting,
    handleExportFormatSelect: exportState.handleExportFormatSelect,

    // 其他功能
    openGithub,

    // AI 功能
    isPolishing: ai.isPolishing,
    isGeneratingTitle: ai.isGeneratingTitle,
    isGeneratingSummary: ai.isGeneratingSummary,
    isGeneratingImage: ai.isGeneratingImage,
    polishResult: ai.polishResult,
    titleResults: ai.titleResults,
    summaryResult: ai.summaryResult,
    imageResult: ai.imageResult,
    aiError: ai.aiError,
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
  }
}
