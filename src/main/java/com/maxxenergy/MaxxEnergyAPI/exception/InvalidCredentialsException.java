package com.maxxenergy.MaxxEnergyAPI.exception;

public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException(String message) {
        System.out.println("InvalidCredentialsException: " + message);
    }
}
