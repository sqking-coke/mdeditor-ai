package com.mdeditor.ai.controller;

import com.mdeditor.ai.dto.ApiResponse;
import com.mdeditor.ai.dto.ImageRequest;
import com.mdeditor.ai.dto.PolishRequest;
import com.mdeditor.ai.dto.SummaryRequest;
import com.mdeditor.ai.dto.TitleRequest;
import com.mdeditor.ai.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * AI 功能 REST 控制器。
 * API Key 和模型名均从前端传入：Key 走 Header，模型名在请求体中。
 * 后端仅做转发，不持有也不存储任何用户密钥。
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    /** AI 文本润色：根据指令优化选中文本 */
    @PostMapping("/polish")
    public ApiResponse<Map<String, String>> polish(
            @RequestHeader("X-Text-Api-Key") String textApiKey,
            @Valid @RequestBody PolishRequest request) {
        String result = aiService.polish(textApiKey, request.model(), request.content(), request.instructions());
        return ApiResponse.success(Map.of("polishedText", result));
    }

    /** AI 生成标题：分析全文，返回 5 个标题建议 */
    @PostMapping("/title")
    public ApiResponse<Map<String, Object>> generateTitles(
            @RequestHeader("X-Text-Api-Key") String textApiKey,
            @Valid @RequestBody TitleRequest request) {
        List<String> titles = aiService.generateTitles(textApiKey, request.model(), request.content());
        return ApiResponse.success(Map.of("titles", titles));
    }

    /** AI 生成摘要：分析全文，返回 2-3 句摘要 */
    @PostMapping("/summary")
    public ApiResponse<Map<String, String>> generateSummary(
            @RequestHeader("X-Text-Api-Key") String textApiKey,
            @Valid @RequestBody SummaryRequest request) {
        String summary = aiService.generateSummary(textApiKey, request.model(), request.content());
        return ApiResponse.success(Map.of("summary", summary));
    }

    /** AI 生成配图：根据文本描述生成图片，返回 base64 data URL */
    @PostMapping("/image")
    public ApiResponse<Map<String, String>> generateImage(
            @RequestHeader("X-Image-Api-Key") String imageApiKey,
            @Valid @RequestBody ImageRequest request) {
        Map<String, String> result = aiService.generateImage(imageApiKey, request.model(), request.prompt());
        return ApiResponse.success(result);
    }
}
