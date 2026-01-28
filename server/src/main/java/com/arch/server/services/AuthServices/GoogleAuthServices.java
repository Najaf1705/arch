package com.arch.server.services.AuthServices;


import com.arch.server.models.AuthProvider;
import com.arch.server.models.GoogleUserInfo;
import com.arch.server.models.User;
import com.arch.server.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GoogleAuthServices {

    private final GoogleTokenVerifier googleTokenVerifier;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public GoogleUserInfo verify(String idToken) {
        GoogleUserInfo info = googleTokenVerifier.verify(idToken);
        if (info == null) {
            throw new IllegalArgumentException("Invalid Google token");
        }
        return info;
    }

    public User createGoogleUser(GoogleUserInfo info, String rawPassword) {

        if (userRepository.existsByEmail(info.getEmail())) {
            throw new IllegalStateException("User already exists");
        }

        User user = new User();
        user.setEmail(info.getEmail());
        user.setName(info.getName());
        user.setAuthProvider(AuthProvider.GOOGLE);
        user.setProviderId(info.getGoogleId());
        user.setProfilePicture(info.getProfilePicture());
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setPasswordSet(true);

        return userRepository.save(user);
    }
}
