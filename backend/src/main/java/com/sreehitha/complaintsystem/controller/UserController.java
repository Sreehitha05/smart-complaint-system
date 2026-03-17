package com.sreehitha.complaintsystem.controller;

import com.sreehitha.complaintsystem.entity.User;
import com.sreehitha.complaintsystem.repository.UserRepository;
import com.sreehitha.complaintsystem.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping
    public java.util.List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}