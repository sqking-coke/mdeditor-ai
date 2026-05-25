package com.mdeditor.ai.exception;

import com.mdeditor.ai.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.RestClientException;

import java.util.stream.Collectors;

/**
 * 全局异常处理。
 * 将各类异常统一转换为 {@link ApiResponse} 格式返回前端。
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** 前端未传 API Key Header 时返回 400，提示用户在设置中配置 */
    @ExceptionHandler(MissingRequestHeaderException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleMissingHeader(MissingRequestHeaderException ex) {
        String keyName = "X-Text-Api-Key".equals(ex.getHeaderName()) ? "text_api_key" : "image_api_key";
        return ApiResponse.error(400, "缺少 API Key，请在设置中配置 " + keyName);
    }

    /** 请求参数校验失败 */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return ApiResponse.error(400, message);
    }

    /** AI 上游服务调用失败（网络错误、API 错误等） */
    @ExceptionHandler(RestClientException.class)
    @ResponseStatus(HttpStatus.BAD_GATEWAY)
    public ApiResponse<Void> handleRestClient(RestClientException ex) {
        log.error("AI 服务调用失败", ex);
        return ApiResponse.error(502, "AI 服务请求失败：" + ex.getMessage());
    }

    /** 兜底处理其他未捕获异常 */
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Void> handleRuntime(RuntimeException ex) {
        log.error("服务器内部错误", ex);
        return ApiResponse.error(500, "服务器内部错误：" + ex.getMessage());
    }
}
