package com.mdeditor.ai.dto;

import java.util.List;

/** DeepSeek Chat Completion API 请求体 */
public record DeepSeekChatRequest(String model, List<Message> messages, double temperature) {

    public record Message(String role, String content) {}
}
