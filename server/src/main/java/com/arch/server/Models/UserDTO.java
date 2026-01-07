package com.arch.server.Models;

import lombok.Data;

@Data
public class UserDTO {
    private String id;
    private String name;
    private String email;

    public UserDTO(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
