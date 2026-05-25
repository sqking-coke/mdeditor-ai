import { ref } from 'vue'
import { useAISettings } from './useAISettings.js'
import { i18n } from '../plugins/i18n.js'

const API_BASE = '/api/ai'

function t(key) {
  return i18n?.global?.t?.(key) || key
}

export function useAI() {
  const { getTextApiKey, getImageApiKey, getTextModel, getImageModel, hasTextApiKey, hasImageApiKey } = useAISettings()

  const isPolishing = ref(false)
  const isGeneratingTitle = ref(false)
  const isGeneratingSummary = ref(false)
  const isGeneratingImage = ref(false)

  const polishResult = ref('')
  const titleResults = ref([])
  const summaryResult = ref('')
  const imageResult = ref(null)
  const aiError = ref(null)

  function clearError() {
    aiError.value = null
  }

  function resetResults() {
    polishResult.value = ''
    titleResults.value = []
    summaryResult.value = ''
    imageResult.value = null
    aiError.value = null
  }

  async function postAI(endpoint, body, headers = {}) {
    let response
    try {
      response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(body)
      })
    } catch {
      throw new Error(t('ai.error.networkError'))
    }

    let data
    try {
      data = await response.json()
    } catch {
      throw new Error(t('ai.error.apiFailed', { message: `HTTP ${response.status}` }))
    }

    if (data.code !== 200) {
      throw new Error(data.message || t('ai.error.apiFailed', { message: '' }))
    }

    return data.data
  }

  async function polishText(content, instructions) {
    isPolishing.value = true
    aiError.value = null
    polishResult.value = ''

    try {
      const data = await postAI('/polish', { content, instructions, model: getTextModel() }, {
        'X-Text-Api-Key': getTextApiKey()
      })
      polishResult.value = data.polishedText
      return data.polishedText
    } catch (e) {
      aiError.value = e.message
      throw e
    } finally {
      isPolishing.value = false
    }
  }

  async function generateTitles(content) {
    isGeneratingTitle.value = true
    aiError.value = null
    titleResults.value = []

    try {
      const data = await postAI('/title', { content, model: getTextModel() }, {
        'X-Text-Api-Key': getTextApiKey()
      })
      titleResults.value = data.titles || []
      return titleResults.value
    } catch (e) {
      aiError.value = e.message
      throw e
    } finally {
      isGeneratingTitle.value = false
    }
  }

  async function generateSummary(content) {
    isGeneratingSummary.value = true
    aiError.value = null
    summaryResult.value = ''

    try {
      const data = await postAI('/summary', { content, model: getTextModel() }, {
        'X-Text-Api-Key': getTextApiKey()
      })
      summaryResult.value = data.summary
      return data.summary
    } catch (e) {
      aiError.value = e.message
      throw e
    } finally {
      isGeneratingSummary.value = false
    }
  }

  async function generateImage(prompt) {
    isGeneratingImage.value = true
    aiError.value = null
    imageResult.value = null

    try {
      const data = await postAI('/image', { prompt, model: getImageModel() }, {
        'X-Image-Api-Key': getImageApiKey()
      })
      imageResult.value = data
      return data
    } catch (e) {
      aiError.value = e.message
      throw e
    } finally {
      isGeneratingImage.value = false
    }
  }

  return {
    isPolishing,
    isGeneratingTitle,
    isGeneratingSummary,
    isGeneratingImage,
    polishResult,
    titleResults,
    summaryResult,
    imageResult,
    aiError,
    hasTextApiKey,
    hasImageApiKey,
    polishText,
    generateTitles,
    generateSummary,
    generateImage,
    clearError,
    resetResults
  }
}
