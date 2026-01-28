package com.arch.server.DTOs.AuthDTOs;

import lombok.Data;

@Data
public class VerifyOtpDTO {
    private String email;
    private String otpRequestId;
    private String otp;
}
