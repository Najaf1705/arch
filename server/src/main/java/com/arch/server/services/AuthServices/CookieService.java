package com.arch.server.services.AuthServices;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CookieService {

    public void setJwtCookie(HttpServletResponse res, String jwt) {

        ResponseCookie cookie = ResponseCookie.from("jwt", jwt)
                .httpOnly(true)
                .secure(true)          // REQUIRED in prod (HTTPS)
                .sameSite("None")     // REQUIRED for cross-domain
                .path("/")
                .maxAge(60 * 60)
                .build();

        res.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void clearJwtCookie(HttpServletResponse res) {

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
