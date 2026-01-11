package com.arch.server.controllers;

import com.arch.server.DTOs.LocalRegisterDTO;
import com.arch.server.services.AuthServices.RegisterServices;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final RegisterServices registerServices;

    public AuthController(RegisterServices registerServices) {
        this.registerServices = registerServices;
    }

    // ---------------- REGISTER ----------------

    @PostMapping("/register/local")
    public ResponseEntity<?> register(@Valid @RequestBody LocalRegisterDTO request) {
        return ResponseEntity.ok(registerServices.localRegister(request));
    }

    // ---------------- LOGIN ----------------

//    @PostMapping("/login")
//    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request) {
//        User user = authService.login(request);
//        return ResponseEntity.ok(new UserResponse(user));
//    }
}
