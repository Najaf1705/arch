package com.arch.server.services.AuthServices;

import com.arch.server.DTOs.AuthDTOs.LocalRegisterDTO;
import com.arch.server.DTOs.AuthDTOs.OtpVerificationResult;
import com.arch.server.DTOs.AuthDTOs.VerifyOtpDTO;
import com.arch.server.models.*;
import com.arch.server.repositories.PendingOtpRequestRepository;
import com.arch.server.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RegisterServices {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final PendingOtpRequestRepository pendingOtpRequestRepository;
    private final OtpService otpService;


    public ResponseEntity<?> localRegister(LocalRegisterDTO req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        PendingOtpRequest pending=otpService.generateOtp(req.getEmail());

        pending.setName(req.getName());
        pending.setEmail(req.getEmail());
        pending.setPasswordHash(encoder.encode(req.getPassword()));

        pendingOtpRequestRepository.save(pending);

        return ResponseEntity.ok(
                Map.of("otpRequestId", pending.getOtpRequestId())
        );
    }


     @Transactional
    public User verifyOtpAndRegister(VerifyOtpDTO req) {

        OtpVerificationResult result = otpService.verifyOtp(req);

        if (!result.isVerified()) {
            throw new RuntimeException(result.getMessage());
        }

        PendingOtpRequest pending = result.getPendingOtpRequest();

        User user = new User();
        user.setName(pending.getName());
        user.setEmail(pending.getEmail());
        user.setPassword(pending.getPasswordHash());
        user.setPasswordSet(true);
        user.setAuthProvider(AuthProvider.LOCAL);
        user.setRole(Role.USER);

        userRepository.save(user);
        pendingOtpRequestRepository.deleteById(req.getOtpRequestId());

        return user;
    }


}

