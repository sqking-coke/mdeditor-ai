package com.mdeditor.ai.service;

import java.util.List;
import java.util.Map;

/**
 * AI 服务接口。
 * API Key 和模型名均由调用方通过参数传入，后端不做持久化。
 */
public interface AiService {

    String polish(String apiKey, String model, String content, String instructions);

    List<String> generateTitles(String apiKey, String model, String content);

    String generateSummary(String apiKey, String model, String content);

    Map<String, String> generateImage(String apiKey, String model, String prompt);
}
