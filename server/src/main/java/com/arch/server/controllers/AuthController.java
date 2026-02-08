package com.arch.server.controllers;

import com.arch.server.DTOs.AuthDTOs.*;
import com.arch.server.DTOs.EmailDTO;
import com.arch.server.DTOs.UserDTO;
import com.arch.server.models.GoogleUserInfo;
import com.arch.server.models.User;
import com.arch.server.repositories.UserRepository;
import com.arch.server.security.JwtUtil;
import com.arch.server.services.AuthServices.*;
import com.arch.server.services.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
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
    private final CookieService cookieService;


    // ---------------- Me ----------------

    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(Authentication auth){
        return userService.me(auth);
    }




    // ---------------- OTP ----------------

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


    @PostMapping("/register/verify-otp")
    public ResponseEntity<?> verifyRegisterOtp(
            @RequestBody VerifyOtpDTO req,
            HttpServletResponse res
    ) {
        User user = registerServices.verifyOtpAndRegister(req);
        cookieService.setJwtCookie(res,jwtUtil.generateToken(user.getId()));
        return ResponseEntity.ok().build();
    }



    // ---------------- LOGIN ----------------

    @PostMapping("/login/local")
    public ResponseEntity<?> login(
            @Valid @RequestBody LocalLoginDTO request,
            HttpServletResponse res
    ) {
        String userId = loginServices.localLogin(request);
        cookieService.setJwtCookie(res,userId);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/login/verify-otp")
    public ResponseEntity<?> verifyLoginOtp(
            @RequestBody VerifyOtpDTO req,
            HttpServletResponse res
    ) {
        User user=loginServices.verifyOtpAndLogin(req);
        cookieService.setJwtCookie(res, jwtUtil.generateToken(user.getId()));

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
            cookieService.setJwtCookie(res, jwt);
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

        cookieService.setJwtCookie(res, jwtUtil.generateToken(newUser.getId()));
        return ResponseEntity.ok().build();
    }



    // ---------------- LOGOUT ----------------

    @PostMapping("/logout")
    public void logout(HttpServletResponse response) {
        cookieService.clearJwtCookie(response);
    }
}