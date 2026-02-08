package com.arch.server.models.Graph;

public record CreateGraphRequest(
        String name,
        String description,
        String type
) {}
