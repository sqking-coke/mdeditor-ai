<template>
  <div v-if="visible" class="dialog-backdrop" @click.self="$emit('close')">
    <div class="ai-dialog">
      <div class="dialog-header">
        <h3>{{ $t('ai.polish.title') }}</h3>
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
          <label class="field-label">{{ $t('ai.polish.selectedText') }}</label>
          <div class="selected-text">{{ selectedText }}</div>
        </div>

        <div class="field-group">
          <label class="field-label">{{ $t('ai.polish.instructions') }}</label>
          <textarea
            v-model="instructions"
            class="instructions-input"
            :placeholder="$t('ai.polish.instructionsPlaceholder')"
            rows="3"
          ></textarea>
        </div>

        <div v-if="result && !isLoading" class="field-group">
          <label class="field-label">{{ $t('ai.polish.result') }}</label>
          <div class="result-text">{{ result }}</div>
        </div>

        <div v-if="isLoading" class="loading-area">
          <div class="spinner"></div>
          <span>{{ $t('ai.polish.polishing') }}</span>
        </div>
      </div>

      <div class="dialog-footer">
        <button v-if="!result" class="btn btn-primary" @click="handlePolish" :disabled="isLoading">
          {{ $t('ai.polish.title') }}
        </button>
        <template v-else>
          <button class="btn btn-primary" @click="handleReplace">{{ $t('ai.polish.replace') }}</button>
          <button class="btn btn-secondary" @click="$emit('close')">{{ $t('ai.polish.cancel') }}</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  selectedText: String,
  isLoading: Boolean,
  result: String,
  error: String
})

const emit = defineEmits(['close', 'polish', 'replace'])

const instructions = ref('')

function handlePolish() {
  emit('polish', {
    content: props.selectedText,
    instructions: instructions.value
  })
}

function handleReplace() {
  emit('replace', props.result)
}
</script>

<style scoped>
@import './ai-dialog.css';
</style>
