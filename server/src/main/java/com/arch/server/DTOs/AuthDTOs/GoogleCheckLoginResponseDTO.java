package com.arch.server.DTOs.AuthDTOs;

import com.arch.server.models.GoogleLoginStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GoogleCheckLoginResponseDTO {
    private GoogleLoginStatus status;
    private String email;
}
