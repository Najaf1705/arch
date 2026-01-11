package com.arch.server.services.AuthServices;

import com.arch.server.DTOs.LocalRegisterDTO;
import com.arch.server.DTOs.UserDTO;
import com.arch.server.exceptions.AuthExceptions.EmailAlreadyExistsException;
import com.arch.server.models.*;
import com.arch.server.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterServices {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    public RegisterServices(
            UserRepository userRepository,
            PasswordEncoder encoder
    ) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    public UserDTO localRegister(LocalRegisterDTO req) {

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new EmailAlreadyExistsException();
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setAuthProvider(AuthProvider.LOCAL);
        user.setRole(Role.USER);
//        user.setPasswordSet(true);

        User savedUser = userRepository.save(user);

        return new UserDTO(savedUser);
    }
}

