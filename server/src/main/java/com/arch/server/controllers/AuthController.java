package com.arch.server.controllers;

import com.arch.server.DTOs.AuthDTOs.*;
import com.arch.server.DTOs.EmailDTO;
import com.arch.server.DTOs.UserDTO;
import com.arch.server.models.GoogleUserInfo;
import com.arch.server.models.User;
import com.arch.server.repositories.UserRepository;
import com.arch.server.security.JwtUtil;
import com.arch.server.services.AuthServices.GoogleAuthServices;
import com.arch.server.services.AuthServices.LoginServices;
import com.arch.server.services.AuthServices.OtpService;
import com.arch.server.services.AuthServices.RegisterServices;
import com.arch.server.services.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final RegisterServices registerServices;
    private final LoginServices loginServices;
    private final GoogleAuthServices googleAuthServices;
    private final OtpService otpService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;


    // ---------------- Me ----------------

    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(Authentication auth){
        return userService.me(auth);
    }


    @PostMapping("/generate-otp")
    public ResponseEntity<?> generateOtp(@RequestBody EmailDTO req){
        System.out.println("regenerate otp req: "+req.getEmail());
        return ResponseEntity.ok(otpService.generateOtp(req.getEmail()));
    }


    @PostMapping("/regenerate-otp")
    public ResponseEntity<?> regenerateOtp(@RequestBody OtpRequestDTO req){
        System.out.println("regenerate otp req: "+req.getOtpRequestId());
        return otpService.regenerateOtp(req.getOtpRequestId());
    }


    // ---------------- REGISTER ----------------



    @PostMapping("/register/local")
    public ResponseEntity<?> register(@RequestBody LocalRegisterDTO req) {
        return registerServices.localRegister(req);
    }


    @PostMapping("/login/verify-otp")
    public ResponseEntity<?> verifyLoginOtp(
            @RequestBody VerifyOtpDTO req,
            HttpServletResponse res
    ) {
        // 1. Verify OTP
        OtpVerificationResult result = otpService.verifyOtp(req);

        if (!result.isVerified()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired OTP");
        }

        // 2. Fetch user safely
        User user = userRepository
                .findByEmail(req.getEmail())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        setJwtCookie(res, jwtUtil.generateToken(user.getId()));

        return ResponseEntity.ok().build();
    }



    @PostMapping("/register/verify-otp")
    public ResponseEntity<?> verifyRegisterOtp(
            @RequestBody VerifyOtpDTO req,
            HttpServletResponse res
    ) {
        User user = registerServices.verifyOtpAndRegister(req);
        setJwtCookie(res,jwtUtil.generateToken(user.getId()));
        return ResponseEntity.ok().build();
    }

    // ---------------- LOGIN ----------------

    @PostMapping("/login/local")
    public ResponseEntity<?> login(
            @Valid @RequestBody LocalLoginDTO request,
            HttpServletResponse res
    ) {
        String userId = loginServices.localLogin(request);
        setJwtCookie(res,userId);
        return ResponseEntity.ok().build();
    }


    // ---------------- GOOGLE LOGIN ----------------

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(
            @RequestBody GoogleLoginRequestDTO req,
            HttpServletResponse res
    ) {
        GoogleUserInfo info = googleAuthServices.verify(req.getIdToken());
        String email = info.getEmail();

        // ---- CASE 1: User exists → login ----
        User existingUser = userRepository.findByEmail(email).orElse(null);

        if (existingUser != null) {
            String jwt = jwtUtil.generateToken(existingUser.getId());
            setJwtCookie(res, jwt);
            return ResponseEntity.ok().build();
        }

        // ---- CASE 2: User does not exist, password missing ----
        if (req.getPassword() == null || req.getPassword().isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.ACCEPTED)
                    .body(Map.of(
                            "status", "NEW_USER",
                            "email", email,
                            "name", info.getName()
                    ));
        }

        // ---- CASE 3: User does not exist, password provided → register ----
        User newUser = googleAuthServices.createGoogleUser(info, req.getPassword());

        setJwtCookie(res, jwtUtil.generateToken(newUser.getId()));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public void logout(HttpServletResponse response) {
        clearJwtCookie(response);
    }

    // =====================================================
    // 🔐 MODERN COOKIE HANDLING (THIS IS THE IMPORTANT PART)
    // =====================================================

    private void setJwtCookie(HttpServletResponse res, String jwt) {

        ResponseCookie cookie = ResponseCookie.from("jwt", jwt)
                .httpOnly(true)
                .secure(true)          // REQUIRED in prod (HTTPS)
                .sameSite("None")     // REQUIRED for cross-domain
                .path("/")
                .maxAge(60 * 60)
                .build();

        res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearJwtCookie(HttpServletResponse res) {

        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0)
                .build();

        res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}