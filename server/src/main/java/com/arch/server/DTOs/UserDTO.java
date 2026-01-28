package com.arch.server.DTOs;

import com.arch.server.models.User;
import lombok.Data;

import java.util.List;

@Data
public class UserDTO {
    private String id;
    private String name;
    private String email;
    private List<String> graphs;
    private String profilePicture;

    public UserDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.graphs=user.getGraphs();
        this.profilePicture= user.getProfilePicture();
    }
}
