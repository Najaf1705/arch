package com.arch.server.services;

import com.arch.server.models.Graph.Graph;
import com.arch.server.models.User;
import com.arch.server.DTOs.UserDTO;
import com.arch.server.repositories.GraphRepository;
import com.arch.server.repositories.UserRepository;
import com.arch.server.services.GraphServices.GetGraphs;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final GetGraphs getGraphs;

    public User create(User user) {
        return userRepository.save(user);
    }

//    public List<UserDTO> getAll() {
//        List<User> users=userRepository.findAll();
//        //        System.out.println(userDTOs);
//        return users.stream().map(UserDTO::new).toList();
//    }

    public ResponseEntity<UserDTO> me(Authentication auth){
        if (auth == null || !auth.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        String userId=auth.getPrincipal().toString();
        User user=userRepository.findById(userId).orElseThrow();
        List<Graph> userGraphs=getGraphs.getGraphs(user.getGraphs());
        UserDTO userDTO=new UserDTO(user,userGraphs);
        return ResponseEntity.ok(userDTO);
    }
}

