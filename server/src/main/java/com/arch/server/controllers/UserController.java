package com.arch.server.controllers;

import com.arch.server.models.User;
import com.arch.server.DTOs.UserDTO;
import com.arch.server.services.UserService;
import com.arch.server.services.UserServices.GetAllUsers;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService service;
    private final GetAllUsers getAllUsers;

    public UserController(UserService service, GetAllUsers getAllUsers) {
        this.service = service;
        this.getAllUsers = getAllUsers;
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return service.create(user);
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAll() {
        return getAllUsers.execute(null);
    }
}
