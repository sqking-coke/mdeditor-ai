package com.mdeditor.ai.service.impl;

import com.mdeditor.ai.config.AiConfig;
import com.mdeditor.ai.dto.DeepSeekChatRequest;
import com.mdeditor.ai.dto.GeminiContentRequest;
import com.mdeditor.ai.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * AI 服务实现。
 * 通过 RestTemplate 调用 DeepSeek 和 Gemini 的 HTTP API，
 * API Key 从请求 Header 获取（由前端传入），不落盘。
 */
@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {

    private final RestTemplate restTemplate;
    private final AiConfig aiConfig;

    @Override
    public String polish(String apiKey, String model, String content, String instructions) {
        String systemPrompt = "你是一个专业的中文文本编辑助手。请根据用户的要求润色文本，只返回润色后的文本内容，不要添加任何解释或前缀。";
        String userPrompt = (instructions != null && !instructions.isBlank())
                ? "请按照以下要求润色文本：\n要求：" + instructions + "\n\n文本内容：\n" + content
                : "请润色以下文本，使其表达更流畅、更专业：\n\n" + content;
        return callDeepSeek(apiKey, model, systemPrompt, userPrompt);
    }

    @Override
    public List<String> generateTitles(String apiKey, String model, String content) {
        String systemPrompt = "你是一个专业的内容编辑。根据文章内容生成5个吸引人的标题。每个标题占一行，不要带序号、数字前缀或任何标记。只返回纯标题文本。";
        String userPrompt = "请为以下文章生成5个标题建议：\n\n" + content;
        String result = callDeepSeek(apiKey, model, systemPrompt, userPrompt);
        return Arrays.stream(result.split("\n"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    @Override
    public String generateSummary(String apiKey, String model, String content) {
        String systemPrompt = "你是一个专业的内容编辑。请根据文章内容生成一段简洁的摘要（2-3句话）。只返回摘要内容，不要添加任何解释或前缀。";
        String userPrompt = "请为以下文章生成摘要：\n\n" + content;
        return callDeepSeek(apiKey, model, systemPrompt, userPrompt);
    }

    @Override
    @SuppressWarnings("unchecked")
    public Map<String, String> generateImage(String apiKey, String model, String prompt) {
        String url = aiConfig.getGemini().getBaseUrl() + "/models/"
                + model + ":generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        var requestBody = new GeminiContentRequest(
                List.of(new GeminiContentRequest.Content(
                        List.of(new GeminiContentRequest.Part(
                                "Generate an image based on this description: " + prompt)))),
                new GeminiContentRequest.GenerationConfig(List.of("IMAGE", "TEXT")));

        ResponseEntity<Map> response = restTemplate.postForEntity(url, new HttpEntity<>(requestBody, headers), Map.class);

        Map<String, Object> responseBody = response.getBody();
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
        Map<String, Object> candidate = candidates.get(0);
        Map<String, Object> contentMap = (Map<String, Object>) candidate.get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");

        // Gemini 图片生成返回 inlineData（base64），提取后拼装为 data URL
        for (Map<String, Object> part : parts) {
            if (part.containsKey("inlineData")) {
                Map<String, Object> inlineData = (Map<String, Object>) part.get("inlineData");
                String mimeType = (String) inlineData.get("mimeType");
                String data = (String) inlineData.get("data");
                Map<String, String> result = new HashMap<>();
                result.put("imageUrl", "data:" + mimeType + ";base64," + data);
                result.put("altText", prompt);
                return result;
            }
        }
        throw new RuntimeException("Gemini 未返回图片数据");
    }

    @SuppressWarnings("unchecked")
    private String callDeepSeek(String apiKey, String model, String systemPrompt, String userPrompt) {
        String url = aiConfig.getDeepseek().getBaseUrl() + "/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        var requestBody = new DeepSeekChatRequest(
                model,
                List.of(
                        new DeepSeekChatRequest.Message("system", systemPrompt),
                        new DeepSeekChatRequest.Message("user", userPrompt)),
                0.7);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, new HttpEntity<>(requestBody, headers), Map.class);

        Map<String, Object> responseBody = response.getBody();
        List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }
}
