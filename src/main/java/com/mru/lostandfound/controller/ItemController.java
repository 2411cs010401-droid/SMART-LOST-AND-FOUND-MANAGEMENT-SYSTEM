package com.mru.lostandfound.controller;

import com.mru.lostandfound.entity.Item;
import com.mru.lostandfound.entity.ReportType;
import com.mru.lostandfound.entity.User;
import com.mru.lostandfound.repository.ItemRepository;
import com.mru.lostandfound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createItem(@RequestBody ItemReportRequest request) {
        String email = request.getReporterEmail() == null ? "" : request.getReporterEmail().trim().toLowerCase();
        if (email.isEmpty() || request.getTitle() == null || request.getReportType() == null) {
            return ResponseEntity.badRequest().build();
        }

        User reporter = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(request.getReporterName() == null || request.getReporterName().isBlank() ? email : request.getReporterName());
            newUser.setPasswordHash(SecurityUtils.hashSHA256("prototype"));
            return userRepository.save(newUser);
        });

        Item item = Item.builder()
                .reporter(reporter)
                .reportType(ReportType.valueOf(request.getReportType().toUpperCase()))
                .category(request.getCategory())
                .title(request.getTitle())
                .brand(request.getBrand())
                .description(request.getDescription())
                .location(request.getLocation())
                .imageUrl(request.getImageUrl())
                .verificationSecret(request.getVerificationSecret())
                .build();

        Item savedItem = itemRepository.save(item);
        return ResponseEntity.ok(Map.of(
                "id", savedItem.getId(),
                "status", "saved",
                "table", "items"
        ));
    }
}
