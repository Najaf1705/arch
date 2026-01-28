package com.arch.server.DTOs.AuthDTOs;

import com.arch.server.models.PendingOtpRequest;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OtpVerificationResult {
    private boolean verified;
    private PendingOtpRequest pendingOtpRequest;
    private String message;
}
