<template>
  <div v-if="visible" class="dialog-backdrop" @click.self="$emit('close')">
    <div class="ai-dialog key-missing-dialog">
      <div class="dialog-header">
        <h3>{{ $t('ai.keyMissing.title') }}</h3>
        <button class="close-btn" @click="$emit('close')">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </button>
      </div>

      <div class="dialog-body">
        <div class="key-missing-message">
          <svg viewBox="0 0 24 24" width="40" height="40" class="warning-icon">
            <path fill="currentColor" d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16"/>
          </svg>
          <p>{{ message }}</p>
        </div>
      </div>

      <div class="dialog-footer">
        <button class="btn btn-primary" @click="$emit('go-settings')">
          {{ $t('ai.keyMissing.goSettings') }}
        </button>
        <button class="btn btn-secondary" @click="$emit('close')">
          {{ $t('common.cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  message: String
})

defineEmits(['close', 'go-settings'])
</script>

<style scoped>
@import './ai-dialog.css';

.key-missing-dialog {
  width: 420px;
}

.key-missing-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  padding: 8px 0;
}

.warning-icon {
  color: #faad14;
}

.key-missing-message p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--theme-text-primary, #333);
}
</style>
