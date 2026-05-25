package com.mdeditor.ai.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 统一 API 响应格式。
 * {@code code} 200 表示成功，非 200 为错误码。
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(int code, T data, String message) {

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, data, "success");
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, null, message);
    }
}
