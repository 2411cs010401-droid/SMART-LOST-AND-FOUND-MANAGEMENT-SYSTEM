package com.mru.lostandfound.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    @Autowired
    private JavaMailSender mailSender;

    // UPDATED: Now accepts the dynamic recipient email directly
    public void sendVerificationAlert(String proofDescription, Long claimId, String recipientEmail) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("security@recovery-network.com"); 
            message.setTo(recipientEmail); // Dynamically sends to the specific public user!
            message.setSubject("🔒 Security Alert: Lost & Found Claim Verified");
            
            String emailBody = "Hello,\n\n"
                    + "Good news! Your security verification claim has been successfully approved.\n\n"
                    + "📝 Claim Details:\n"
                    + "- Claim ID: " + claimId + "\n"
                    + "- Verified Item Proof: " + proofDescription + "\n\n"
                    + "Status: VERIFIED via Cryptographic SHA-256 Protocol.\n\n"
                    + "Please visit the designated public recovery center with a valid government-issued ID (Passport, Driver's License, etc.) to collect your belongings.\n\n"
                    + "Best regards,\n"
                    + "Global Lost & Found Security Team";
                    
            message.setText(emailBody);
            mailSender.send(message);
            System.out.println(">>> Security Notification Dispatch Success for " + recipientEmail);
        } catch (Exception e) {
            System.err.println("Failed to dispatch security notification email: " + e.getMessage());
        }
    }
}