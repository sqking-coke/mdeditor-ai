package com.mdeditor.ai.dto;

import jakarta.validation.constraints.NotBlank;

/** AI 文本润色请求 */
public record PolishRequest(
        @NotBlank(message = "文本内容不能为空") String content,
        String instructions,
        String model) {

    public PolishRequest {
        if (instructions == null) {
            instructions = "";
        }
    }
}
