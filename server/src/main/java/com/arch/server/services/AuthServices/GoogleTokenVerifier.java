package com.arch.server.services.AuthServices;

import com.arch.server.models.GoogleUserInfo;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class GoogleTokenVerifier {

    private final GoogleIdTokenVerifier verifier;

    public GoogleTokenVerifier(
            @Value("${GOOGLE_CLIENT_ID}") String clientId
    ) {
        this.verifier =
                new GoogleIdTokenVerifier.Builder(
                        new NetHttpTransport(),
                        JacksonFactory.getDefaultInstance()
                )
                        .setAudience(List.of(clientId))
                        .build();
    }

    public GoogleUserInfo verify(String idTokenString) {

        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken == null) {
                throw new IllegalArgumentException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
                throw new IllegalArgumentException("Google email not verified");
            }

            log.info("Google user verified: {}", payload.getEmail());

            return new GoogleUserInfo(
                    payload.getSubject(),                 // Google user ID (sub)
                    payload.getEmail(),
                    (String) payload.get("name"),
                    (String) payload.get("picture")
            );

        } catch (Exception e) {
            log.error("Google token verification failed", e);
            throw new IllegalArgumentException("Invalid Google token");
        }
    }
}
