package com.arch.server.services.AuthServices;

import com.arch.server.DTOs.AuthDTOs.LocalLoginDTO;
import com.arch.server.DTOs.UserDTO;
import com.arch.server.exceptions.AuthExceptions.InvalidCredentialsException;
import com.arch.server.models.User;
import com.arch.server.repositories.UserRepository;
import com.arch.server.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginServices {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String localLogin(LocalLoginDTO req) {

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        if (!user.isPasswordSet() ||
                !passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        return jwtUtil.generateToken(user.getId());
    }

}