package com.arch.server.controllers;

import com.arch.server.models.User;
import com.arch.server.DTOs.UserDTO;
import com.arch.server.services.UserService;
import com.arch.server.services.UserServices.GetAllUsers;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final GetAllUsers getAllUsers;

    @PostMapping
    public User create(@RequestBody User user) {
        return userService.create(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        return getAllUsers.execute(null);
    }
}
