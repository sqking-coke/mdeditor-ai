package com.mdeditor.ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * Markdown 编辑器 AI 后端服务入口。
 * 纯转发代理：不持有 API Key，不存储用户数据。
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class MdEditorAiApplication {

    public static void main(String[] args) {
        SpringApplication.run(MdEditorAiApplication.class, args);
    }
}
