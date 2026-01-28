package com.arch.server.repositories;

import com.arch.server.models.PendingOtpRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PendingOtpRequestRepository
        extends MongoRepository<PendingOtpRequest, String> {
}
