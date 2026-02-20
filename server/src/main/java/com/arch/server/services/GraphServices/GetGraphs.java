package com.arch.server.services.GraphServices;

import com.arch.server.models.Graph.Graph;
import com.arch.server.repositories.GraphRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetGraphs {
    private final GraphRepository graphRepository;

    public List<Graph> getGraphs(List<String> graphIds) {
        return graphRepository.findAllById(graphIds);
    }

}
