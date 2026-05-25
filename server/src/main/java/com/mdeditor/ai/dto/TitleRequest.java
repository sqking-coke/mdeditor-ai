package com.mdeditor.ai.dto;

import jakarta.validation.constraints.NotBlank;

/** AI 生成标题请求 */
public record TitleRequest(
        @NotBlank(message = "文章内容不能为空") String content,
        String model) {}
