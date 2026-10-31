package com.mru.lostandfound.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "claims")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long itemId;

    @Column(nullable = false)
    private Long claimerId;

    // ADD THIS NEW FIELD FOR THE PUBLIC EMAIL
    @Column(nullable = false)
    private String claimerEmail; 

    @Column(nullable = false)
    private String proofProvided; 

    @Column(nullable = false)
    private String status = "PENDING";

    public Claim() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public Long getClaimerId() { return claimerId; }
    public void setClaimerId(Long claimerId) { this.claimerId = claimerId; }

    // ADD THESE GETTER/SETTER METHODS
    public String getClaimerEmail() { return claimerEmail; }
    public void setClaimerEmail(String claimerEmail) { this.claimerEmail = claimerEmail; }

    public String getProofProvided() { return proofProvided; }
    public void setProofProvided(String proofProvided) { this.proofProvided = proofProvided; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}