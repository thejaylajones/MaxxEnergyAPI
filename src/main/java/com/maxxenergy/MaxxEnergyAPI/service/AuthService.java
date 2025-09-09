package com.maxxenergy.MaxxEnergyAPI.service;

import com.maxxenergy.MaxxEnergyAPI.dto.*;
import com.maxxenergy.MaxxEnergyAPI.entity.User;
import com.maxxenergy.MaxxEnergyAPI.exception.InvalidCredentialsException;
import com.maxxenergy.MaxxEnergyAPI.exception.ResourceNotFoundException;
import com.maxxenergy.MaxxEnergyAPI.repository.UserRepository;
import com.maxxenergy.MaxxEnergyAPI.security.JwtUtil;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    // ================= REGISTER =================
    public String register(RegisterRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            new InvalidCredentialsException("Username already exists");
            return "Username already exists";
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            new InvalidCredentialsException("Email already exists");
            return "Email already exists";
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setEmployeeId(request.getEmployeeId());

        userRepository.save(user);

        System.out.println("User registered: " + user.getUsername());
        return "User registered successfully";
    }

    // ================= LOGIN =================
    public String login(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername()).orElse(null);

        if (user == null) {
            new ResourceNotFoundException("User not found");
            return "User not found";
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            new InvalidCredentialsException("Invalid password");
            return "Invalid password";
        }

        String token = jwtUtil.generateToken(user.getUsername());
        System.out.println("User logged in: " + user.getUsername());
        return token;  // return JWT token
    }

    // ================= CHANGE PASSWORD =================
    public String changePassword(String username, PasswordChangeRequest request) {

        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            new ResourceNotFoundException("User not found");
            return "User not found";
        }

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            new InvalidCredentialsException("Old password is incorrect");
            return "Old password is incorrect";
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        System.out.println("Password changed for user: " + user.getUsername());
        return "Password changed successfully";
    }

    // ================= RESET PASSWORD =================
    public String resetPassword(PasswordResetRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            new ResourceNotFoundException("User not found");
            return "User not found";
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        System.out.println("Password reset for user: " + user.getUsername());
        return "Password reset successfully";
    }
}
