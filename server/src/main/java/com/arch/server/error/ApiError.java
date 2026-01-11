package com.arch.server.error;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Data
public class ApiError {

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final String code;
    private final String message;
    private final int status;
    private final String timestamp;
    private final Map<String, String> errors;

    // Constructor for normal errors
    public ApiError(String code, String message, int status) {
        this(code, message, status, null);
    }

    // Constructor for validation errors
    public ApiError(
            String code,
            String message,
            int status,
            Map<String, String> errors
    ) {
        this.code = code;
        this.message = message;
        this.status = status;
        this.errors = errors;
        this.timestamp = LocalDateTime.now().format(FORMATTER); // 👈 ALWAYS set
    }
}
