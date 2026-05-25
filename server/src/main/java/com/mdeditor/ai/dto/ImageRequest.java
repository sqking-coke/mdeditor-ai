package com.mdeditor.ai.dto;

import jakarta.validation.constraints.NotBlank;

/** AI 生成配图请求 */
public record ImageRequest(
        @NotBlank(message = "图片描述不能为空") String prompt,
        String model) {}
