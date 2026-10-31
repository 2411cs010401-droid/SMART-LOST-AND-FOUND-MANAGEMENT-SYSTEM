package com.mru.lostandfound.controller;

import com.mru.lostandfound.entity.User;
import com.mru.lostandfound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody Map<String, String> request) {
        String email = request.getOrDefault("email", "").trim().toLowerCase();
        String fullName = request.getOrDefault("fullName", "").trim();
        String password = request.getOrDefault("password", "");

        if (email.isEmpty() || fullName.isEmpty() || password.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user = userRepository.findByEmail(email).orElseGet(User::new);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(SecurityUtils.hashSHA256(password));

        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody Map<String, String> request) {
        String email = request.getOrDefault("email", "").trim().toLowerCase();
        String password = request.getOrDefault("password", "");
        String passwordHash = SecurityUtils.hashSHA256(password);

        return userRepository.findByEmail(email)
                .filter(user -> passwordHash.equals(user.getPasswordHash()))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(401).build());
    }
}
