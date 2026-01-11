package com.arch.server.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LocalRegisterDTO {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    private String password;
}
