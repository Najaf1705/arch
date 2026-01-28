package com.arch.server.handler;

import com.arch.server.error.ApiError;
import com.arch.server.exceptions.AuthExceptions.EmailAlreadyExistsException;
import com.arch.server.exceptions.AuthExceptions.GoogleLoginException;
import com.arch.server.exceptions.AuthExceptions.InvalidCredentialsException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleEmailAlreadyExists(
            EmailAlreadyExistsException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT) // 409
                .body(new ApiError(
                        "EMAIL_ALREADY_EXISTS",
                        ex.getMessage(),
                        HttpStatus.CONFLICT.value()
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationErrors(
            MethodArgumentNotValidException ex
    ) {
        Map<String, String> fieldErrors = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        fieldErrors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        ApiError apiError = new ApiError(
                "VALIDATION_FAILED",
                "Validation failed for request",
                HttpStatus.BAD_REQUEST.value(),
                fieldErrors
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(apiError);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiError> handleInvalidCredentials(
            InvalidCredentialsException ex
    ){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                new ApiError(
                        "INVALID_CREDENTIALS",
                        ex.getMessage(),
                        HttpStatus.BAD_REQUEST.value()
                )
        );
    }


    @ExceptionHandler(GoogleLoginException.class)
    public ResponseEntity<ApiError> handleGoogleLogin(
            GoogleLoginException ex
    ){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ApiError(
                        "EMAIL_UNVERIFIED",
                        ex.getMessage(),
                        HttpStatus.UNAUTHORIZED.value()
                )
        );
    }


}
