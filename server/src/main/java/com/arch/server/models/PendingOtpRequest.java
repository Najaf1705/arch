package com.arch.server.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document
@Data
public class PendingOtpRequest {

    @Id
    private String otpRequestId;
    private String email;

    private String name;
    private String passwordHash;
    private String otpHash;
    private Instant otpExpiry;

    // getters/setters
}
