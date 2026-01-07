package com.arch.server.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "registerations")
public class User {

    @Id
    private String id;

    private String name;
    private String email;
}
