package com.mdeditor.ai.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * AI 服务配置（仅 base-url，不含 API Key 和模型名）。
 * API Key 和模型名由前端请求时传入，后端不做持久化。
 */
@Data
@ConfigurationProperties("ai")
public class AiConfig {

    private DeepSeek deepseek = new DeepSeek();
    private Gemini gemini = new Gemini();

    @Data
    public static class DeepSeek {
        /** DeepSeek API 基础地址，默认指向 v1 */
        private String baseUrl = "https://api.deepseek.com/v1";
    }

    @Data
    public static class Gemini {
        /** Gemini API 基础地址 */
        private String baseUrl = "https://generativelanguage.googleapis.com/v1beta";
    }
}
