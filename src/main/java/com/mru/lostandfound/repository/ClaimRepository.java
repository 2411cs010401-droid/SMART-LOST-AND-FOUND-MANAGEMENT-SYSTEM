package com.mru.lostandfound.repository;

import com.mru.lostandfound.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    // Custom method to easily find all claims for a specific item
    List<Claim> findByItemId(Long itemId);
}