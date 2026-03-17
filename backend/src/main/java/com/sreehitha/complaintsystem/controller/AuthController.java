package com.sreehitha.complaintsystem.controller;

import com.sreehitha.complaintsystem.entity.User;
import com.sreehitha.complaintsystem.repository.UserRepository;
import com.sreehitha.complaintsystem.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional; // ✅ ADD THIS IMPORT

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public String login(@RequestBody User user) {

        // ✅ CHANGE HERE (User → Optional<User>)
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        // ✅ CHANGE CONDITION
        if (existingUser.isEmpty() ||
            !existingUser.get().getPasswordHash().equals(user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        // ✅ CHANGE HERE
        return JwtUtil.generateToken(existingUser.get().getEmail());
    }
}