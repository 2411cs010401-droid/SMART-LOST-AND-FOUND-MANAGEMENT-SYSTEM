package com.mru.lostandfound.controller;

import com.mru.lostandfound.entity.Claim;
import com.mru.lostandfound.repository.ClaimRepository;
import com.mru.lostandfound.service.EmailNotificationService; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "http://localhost:3000")
public class ClaimController {

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private EmailNotificationService emailService; 

    @GetMapping
    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Claim> submitClaim(@RequestBody Claim claim) {
        Claim savedClaim = claimRepository.save(claim);
        return ResponseEntity.ok(savedClaim);
    }

    @PostMapping("/verify/{claimId}")
    public ResponseEntity<String> verifyClaim(@PathVariable Long claimId, @RequestBody Map<String, String> requestBody) {
        Claim claim = claimRepository.findById(claimId)
                        .orElseThrow(() -> new RuntimeException("Claim not found"));
        
        String providedSecret = requestBody.get("providedSecret");
        if (providedSecret == null) {
            return ResponseEntity.badRequest().body("Missing passkey field.");
        }
        
        String hashedInput = SecurityUtils.hashSHA256(providedSecret.trim());
        String expectedSecureHash = "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3";
        
        if (expectedSecureHash.equals(hashedInput)) { 
            claim.setStatus("VERIFIED");
            claimRepository.save(claim);
            
            // DYNAMIC ALERT: Sends directly to the email saved in the claim record
            emailService.sendVerificationAlert(claim.getProofProvided(), claim.getId(), claim.getClaimerEmail());
            
            return ResponseEntity.ok("Claim Verified Successfully using SHA-256 Authentication and User Notified via Mail!");
        } else {
            // THIS WAS THE MISSING PIECE! Java needs to know what to return if it fails.
            return ResponseEntity.status(403).body("Invalid Verification Code! Cryptographic match failed.");
        }
    }
}