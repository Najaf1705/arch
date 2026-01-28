package com.arch.server.exceptions.AuthExceptions;

public class InvalidCredentialsException extends RuntimeException{
    public InvalidCredentialsException(){
        super("Invalid Credentials");
    }
}
