<template>
  <section class="ai-settings-section">
    <h3 class="section-title">{{ $t('settings.ai.title') }}</h3>

    <div class="setting-item">
      <label class="setting-label" for="text-api-key">{{ $t('settings.ai.textApiKey') }}</label>
      <div class="key-input-row">
        <input
          id="text-api-key"
          :type="showTextKey ? 'text' : 'password'"
          class="key-input"
          :placeholder="$t('settings.ai.textApiKeyPlaceholder')"
          :value="textApiKey"
          @input="onTextKeyChange"
        />
        <button class="toggle-btn" @click="showTextKey = !showTextKey" type="button">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" v-if="showTextKey" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
            <path fill="currentColor" v-else d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="setting-item">
      <label class="setting-label" for="text-model">{{ $t('settings.ai.textModel') }}</label>
      <input
        id="text-model"
        type="text"
        class="key-input"
        :placeholder="$t('settings.ai.textModelPlaceholder')"
        :value="textModel"
        @input="onTextModelChange"
      />
    </div>

    <div class="setting-item">
      <label class="setting-label" for="image-api-key">{{ $t('settings.ai.imageApiKey') }}</label>
      <div class="key-input-row">
        <input
          id="image-api-key"
          :type="showImageKey ? 'text' : 'password'"
          class="key-input"
          :placeholder="$t('settings.ai.imageApiKeyPlaceholder')"
          :value="imageApiKey"
          @input="onImageKeyChange"
        />
        <button class="toggle-btn" @click="showImageKey = !showImageKey" type="button">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" v-if="showImageKey" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
            <path fill="currentColor" v-else d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="setting-item">
      <label class="setting-label" for="image-model">{{ $t('settings.ai.imageModel') }}</label>
      <input
        id="image-model"
        type="text"
        class="key-input"
        :placeholder="$t('settings.ai.imageModelPlaceholder')"
        :value="imageModel"
        @input="onImageModelChange"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAISettings } from '../../composables/useAISettings.js'

const { textApiKey, imageApiKey, textModel, imageModel, setTextApiKey, setImageApiKey, setTextModel, setImageModel } = useAISettings()

const showTextKey = ref(false)
const showImageKey = ref(false)

function onTextKeyChange(e) { setTextApiKey(e.target.value) }
function onImageKeyChange(e) { setImageKey(e.target.value) }
function onTextModelChange(e) { setTextModel(e.target.value) }
function onImageModelChange(e) { setImageModel(e.target.value) }
</script>

<style scoped>
.ai-settings-section {
  padding: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin: 0 0 16px 0;
}

.setting-item {
  margin-bottom: 16px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--theme-text-secondary);
  margin-bottom: 6px;
}

.key-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.key-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--theme-border-light);
  border-radius: 6px;
  font-size: 13px;
  font-family: monospace;
  background: var(--theme-bg-primary);
  color: var(--theme-text-primary);
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.key-input:focus {
  border-color: var(--theme-primary);
}

.key-input::placeholder {
  color: var(--theme-text-tertiary);
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--theme-border-light);
  border-radius: 6px;
  background: var(--theme-bg-primary);
  color: var(--theme-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.toggle-btn:hover {
  background: var(--theme-bg-secondary);
  color: var(--theme-primary);
}
</style>
