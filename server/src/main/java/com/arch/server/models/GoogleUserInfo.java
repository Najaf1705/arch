package com.arch.server.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GoogleUserInfo {
    private String googleId;
    private String email;
    private String name;
    private String profilePicture;
}
