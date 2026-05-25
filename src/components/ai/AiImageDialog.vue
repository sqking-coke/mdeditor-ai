<template>
  <div v-if="visible" class="dialog-backdrop" @click.self="$emit('close')">
    <div class="ai-dialog">
      <div class="dialog-header">
        <h3>{{ $t('ai.image.title') }}</h3>
        <button class="close-btn" @click="$emit('close')">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </button>
      </div>

      <div class="dialog-body">
        <div v-if="error" class="error-message">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16"/>
          </svg>
          <span>{{ error }}</span>
        </div>

        <div class="field-group">
          <label class="field-label">{{ $t('ai.image.prompt') }}</label>
          <textarea
            v-model="prompt"
            class="instructions-input"
            :placeholder="$t('ai.image.promptPlaceholder')"
            rows="3"
          ></textarea>
        </div>

        <div v-if="isLoading" class="loading-area">
          <div class="spinner"></div>
          <span>{{ $t('ai.image.generating') }}</span>
        </div>

        <div v-if="imageData && !isLoading" class="field-group">
          <label class="field-label">{{ $t('ai.image.preview') }}</label>
          <div class="image-preview">
            <img :src="imageData.imageUrl" :alt="imageData.altText" />
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <button v-if="!imageData" class="btn btn-primary" @click="handleGenerate" :disabled="!prompt.trim() || isLoading">
          {{ $t('ai.image.title') }}
        </button>
        <template v-else>
          <button class="btn btn-primary" @click="handleDownload">{{ $t('ai.image.download') }}</button>
          <button class="btn btn-secondary" @click="startOver">{{ $t('common.cancel') }}</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  isLoading: Boolean,
  imageData: Object,
  error: String
})

const emit = defineEmits(['close', 'generate'])

const prompt = ref('')

function handleGenerate() {
  emit('generate', prompt.value)
}

const MIME_TO_EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }

function handleDownload() {
  const { imageUrl, altText } = props.imageData
  const link = document.createElement('a')
  const mimeMatch = imageUrl.match(/^data:(image\/[^;]+);/)
  const mime = mimeMatch ? mimeMatch[1] : ''
  const ext = MIME_TO_EXT[mime] || 'jpg'
  link.href = imageUrl
  link.download = `${altText || 'image'}.${ext}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function startOver() {
  prompt.value = ''
  emit('close')
}
</script>

<style scoped>
@import './ai-dialog.css';
</style>
