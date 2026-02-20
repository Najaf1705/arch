package com.arch.server.services.AuthServices;

import com.arch.server.DTOs.AuthDTOs.LocalLoginDTO;
import com.arch.server.DTOs.AuthDTOs.OtpVerificationResult;
import com.arch.server.DTOs.AuthDTOs.VerifyOtpDTO;
import com.arch.server.exceptions.AuthExceptions.InvalidCredentialsException;
import com.arch.server.models.User;
import com.arch.server.repositories.UserRepository;
import com.arch.server.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class LoginServices {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    public String localLogin(LocalLoginDTO req) {

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        if (!user.isPasswordSet() ||
                !passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        return jwtUtil.generateToken(user.getId());
    }


    public User verifyOtpAndLogin(VerifyOtpDTO req){
        OtpVerificationResult result = otpService.verifyOtp(req);

        if (!result.isVerified()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    result.getMessage()
            );
        }

        System.out.println("otp verified");


        return userRepository
                .findByEmail(req.getEmail())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );
    }

}