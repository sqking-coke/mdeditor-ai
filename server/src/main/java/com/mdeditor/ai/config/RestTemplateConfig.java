package com.mdeditor.ai.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.net.ProxySelector;
import java.net.http.HttpClient;
import java.time.Duration;

/**
 * HTTP 客户端配置。
 * 使用 JDK HttpClient（非 SimpleClientHttpRequestFactory），
 * 因为 HttpsURLConnection 对某些 HTTPS 端点（如 DeepSeek）存在 SSL 兼容性问题。
 * 通过 ProxySelector.getDefault() 读取系统代理，确保 VPN/系统代理能生效。
 */
@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(60))
                .proxy(ProxySelector.getDefault())
                .build();
        JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory(httpClient);
        factory.setReadTimeout(Duration.ofSeconds(300));
        return new RestTemplate(factory);
    }
}
