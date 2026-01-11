package com.arch.server.models;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@ToString(exclude = "password")
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Indexed(unique = true)
    private String email;

    @NotBlank(message = "Password is required")
//    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private String profilePicture;

    @NotNull(message = "Auth provider is required")
    private AuthProvider authProvider;

    private String providerId;

    @NotNull(message = "Role is required")
    private Role role;
}
