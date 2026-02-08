package com.arch.server.models.Graph;

import java.util.List;

public record SaveGraphRequest(
        List<GraphNode> nodes,
        List<GraphEdge> edges,
        int version
) {}
