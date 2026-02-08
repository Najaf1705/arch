package com.arch.server.repositories;

import com.arch.server.models.Graph.Graph;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GraphRepository extends MongoRepository<Graph, String> {

    List<Graph> findByOwnerId(String ownerId);
}
