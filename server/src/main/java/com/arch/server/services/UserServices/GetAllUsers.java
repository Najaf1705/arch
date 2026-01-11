package com.arch.server.services.UserServices;

import com.arch.server.models.User;
import com.arch.server.DTOs.UserDTO;
import com.arch.server.Query;
import com.arch.server.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetAllUsers implements Query<Void, List<UserDTO>> {

    private final UserRepository userRepository;

    public GetAllUsers(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public ResponseEntity<List<UserDTO>> execute(Void input) {
        List<User> users=userRepository.findAll();
        List<UserDTO> userDTOs=users.stream().map(UserDTO::new).toList();
        return ResponseEntity.status(HttpStatus.OK).body(userDTOs);
    }
}
