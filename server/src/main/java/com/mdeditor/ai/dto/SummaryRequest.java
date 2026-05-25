package com.mdeditor.ai.dto;

import jakarta.validation.constraints.NotBlank;

/** AI 生成摘要请求 */
public record SummaryRequest(
        @NotBlank(message = "文章内容不能为空") String content,
        String model) {}
