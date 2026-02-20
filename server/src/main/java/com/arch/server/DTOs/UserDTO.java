package com.arch.server.DTOs;

import com.arch.server.models.Graph.Graph;
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
    private List<Graph> graphsDetail;

    public UserDTO(User user, List<Graph> graphsDetail) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.graphs=user.getGraphs();
        this.profilePicture= user.getProfilePicture();
        this.graphsDetail=graphsDetail;
    }
}
