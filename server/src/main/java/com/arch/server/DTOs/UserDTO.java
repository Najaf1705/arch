package com.arch.server.DTOs;

import com.arch.server.models.User;
import lombok.Data;

@Data
public class UserDTO {
    private String id;
    private String name;
    private String email;

    public UserDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
    }
}
