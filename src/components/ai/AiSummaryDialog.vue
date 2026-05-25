<template>
  <div v-if="visible" class="dialog-backdrop" @click.self="$emit('close')">
    <div class="ai-dialog">
      <div class="dialog-header">
        <h3>{{ $t('ai.summary.title') }}</h3>
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

        <div v-if="isLoading" class="loading-area">
          <div class="spinner"></div>
          <span>{{ $t('ai.summary.generating') }}</span>
        </div>

        <div v-if="summary && !isLoading" class="field-group">
          <label class="field-label">{{ $t('ai.summary.result') }}</label>
          <div class="summary-text">{{ summary }}</div>
        </div>
      </div>

      <div class="dialog-footer">
        <button v-if="summary && !isLoading" class="btn btn-primary" @click="$emit('insert', summary)">
          {{ $t('ai.summary.insert') }}
        </button>
        <button class="btn btn-secondary" @click="$emit('close')">{{ $t('common.cancel') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  isLoading: Boolean,
  summary: String,
  error: String
})

defineEmits(['close', 'insert'])
</script>

<style scoped>
@import './ai-dialog.css';
</style>
