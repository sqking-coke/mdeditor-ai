import { ref } from 'vue'

const STORAGE_KEY_TEXT = 'ai_text_api_key'
const STORAGE_KEY_IMAGE = 'ai_image_api_key'
const STORAGE_KEY_TEXT_MODEL = 'ai_text_model'
const STORAGE_KEY_IMAGE_MODEL = 'ai_image_model'

const DEFAULT_TEXT_MODEL = 'deepseek-v4-flash'
const DEFAULT_IMAGE_MODEL = 'gemini-3.1-flash-image-preview'

const textApiKey = ref(loadKey(STORAGE_KEY_TEXT))
const imageApiKey = ref(loadKey(STORAGE_KEY_IMAGE))
const textModel = ref(loadKey(STORAGE_KEY_TEXT_MODEL) || DEFAULT_TEXT_MODEL)
const imageModel = ref(loadKey(STORAGE_KEY_IMAGE_MODEL) || DEFAULT_IMAGE_MODEL)

function loadKey(key) {
  try {
    return localStorage.getItem(key) || ''
  } catch {
    return ''
  }
}

export function useAISettings() {
  function getTextApiKey() {
    return textApiKey.value
  }

  function getImageApiKey() {
    return imageApiKey.value
  }

  function getTextModel() {
    return textModel.value || DEFAULT_TEXT_MODEL
  }

  function getImageModel() {
    return imageModel.value || DEFAULT_IMAGE_MODEL
  }

  function setTextApiKey(key) {
    textApiKey.value = key
    try { localStorage.setItem(STORAGE_KEY_TEXT, key) } catch { /* ignore */ }
  }

  function setImageApiKey(key) {
    imageApiKey.value = key
    try { localStorage.setItem(STORAGE_KEY_IMAGE, key) } catch { /* ignore */ }
  }

  function setTextModel(model) {
    textModel.value = model
    try { localStorage.setItem(STORAGE_KEY_TEXT_MODEL, model) } catch { /* ignore */ }
  }

  function setImageModel(model) {
    imageModel.value = model
    try { localStorage.setItem(STORAGE_KEY_IMAGE_MODEL, model) } catch { /* ignore */ }
  }

  function hasTextApiKey() {
    return textApiKey.value.trim().length > 0
  }

  function hasImageApiKey() {
    return imageApiKey.value.trim().length > 0
  }

  return {
    textApiKey,
    imageApiKey,
    textModel,
    imageModel,
    getTextApiKey,
    getImageApiKey,
    getTextModel,
    getImageModel,
    setTextApiKey,
    setImageApiKey,
    setTextModel,
    setImageModel,
    hasTextApiKey,
    hasImageApiKey
  }
}
