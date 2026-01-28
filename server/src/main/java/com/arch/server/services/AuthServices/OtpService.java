package com.arch.server.services.AuthServices;

import com.arch.server.DTOs.AuthDTOs.OtpVerificationResult;
import com.arch.server.DTOs.AuthDTOs.VerifyOtpDTO;
import com.arch.server.models.PendingOtpRequest;
import com.arch.server.repositories.PendingOtpRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final PendingOtpRequestRepository pendingOtpRequestRepository;


    public PendingOtpRequest generateOtp(String email){
        String otp = String.valueOf(100000 + new SecureRandom().nextInt(900000));

        PendingOtpRequest pendingOtpRequest = new PendingOtpRequest();
        pendingOtpRequest.setOtpHash(passwordEncoder.encode(otp));
        pendingOtpRequest.setOtpExpiry(Instant.now().plus(5, ChronoUnit.MINUTES));
        pendingOtpRequest.setEmail(email);

        pendingOtpRequestRepository.save(pendingOtpRequest);

        emailService.sendOtp(email, otp);

        return pendingOtpRequest;
    }




    public ResponseEntity<?> regenerateOtp(String otpRequestId){
        String otp = String.valueOf(100000 + new SecureRandom().nextInt(900000));

        PendingOtpRequest pendingOtpRequest =
                pendingOtpRequestRepository.findById(otpRequestId)
                        .orElseThrow(() -> new RuntimeException("OTP not found"));

        pendingOtpRequest.setOtpHash(passwordEncoder.encode(otp));
        pendingOtpRequest.setOtpExpiry(Instant.now().plus(5, ChronoUnit.MINUTES));

        pendingOtpRequestRepository.save(pendingOtpRequest);

        emailService.sendOtp(pendingOtpRequest.getEmail(), otp);

        return ResponseEntity.ok().build();
    }




    public OtpVerificationResult verifyOtp(VerifyOtpDTO req){

        var pendingOtpRequest = pendingOtpRequestRepository.findById(req.getOtpRequestId());
        if (pendingOtpRequest.isEmpty()) {
            return new OtpVerificationResult(false, null, "OTP not found");
        }

        PendingOtpRequest pending = pendingOtpRequest.get();
        if (pending.getOtpExpiry().isBefore(Instant.now())) {
            return new OtpVerificationResult(false, null, "OTP expired");
        }

        if (!passwordEncoder.matches(req.getOtp(), pending.getOtpHash())) {
            return new OtpVerificationResult(false, null, "Invalid OTP");
        }

        return new OtpVerificationResult(true, pending, "Verified");
    }
}
