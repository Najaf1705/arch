package com.arch.server.exceptions.AuthExceptions;

public class GoogleLoginException extends RuntimeException {
    public GoogleLoginException(){
        super("Email is not verified");
    }
}
