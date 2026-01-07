package com.arch.server.Repositories;
import com.arch.server.Models.User;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository
        extends MongoRepository<User, String> {
            Optional<User> findByEmail(String email);
}