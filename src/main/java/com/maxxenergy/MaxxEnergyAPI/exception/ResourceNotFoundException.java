package com.maxxenergy.MaxxEnergyAPI.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        System.out.println("ResourceNotFoundException: " + message);
    }
}
