package com.arch.server.DTOs.AuthDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GoogleLoginRequestDTO {
    private String idToken;
    private String password;
}
