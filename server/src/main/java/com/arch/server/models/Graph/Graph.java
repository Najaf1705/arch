package com.arch.server.models.Graph;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "graphs")
public class Graph {

    @Id
    private String id;

    private String ownerId;   // immutable user id
    private String name;
    private String description;

    private List<GraphNode> nodes;
    private List<GraphEdge> edges;

    private int version;

    private Instant createdAt;
    private Instant updatedAt;
}
