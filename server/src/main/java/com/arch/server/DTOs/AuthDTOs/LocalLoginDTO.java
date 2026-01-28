package com.arch.server.DTOs.AuthDTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LocalLoginDTO {
    @Email
    @NotBlank
    private String email;

    private String password;
}
