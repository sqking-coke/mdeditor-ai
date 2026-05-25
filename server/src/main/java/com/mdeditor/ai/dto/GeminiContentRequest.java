package com.mdeditor.ai.dto;

import java.util.List;

/** Gemini GenerateContent API 请求体 */
public record GeminiContentRequest(List<Content> contents, GenerationConfig generationConfig) {

    public record Content(List<Part> parts) {}

    public record Part(String text) {}

    public record GenerationConfig(List<String> responseModalities) {}
}
