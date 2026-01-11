package com.arch.server.services;

import com.arch.server.models.User;
import com.arch.server.DTOs.UserDTO;
import com.arch.server.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    public User create(User user) {
        return userRepository.save(user);
    }

    public List<UserDTO> getAll() {
        List<User> users=userRepository.findAll();
        //        System.out.println(userDTOs);
        return users.stream().map(UserDTO::new).toList();
    }
}

