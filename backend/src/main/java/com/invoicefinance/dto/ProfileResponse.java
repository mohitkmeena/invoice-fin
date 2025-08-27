package com.invoicefinance.dto;

import com.invoicefinance.entity.KycStatus;
import com.invoicefinance.entity.UserRole;
import com.invoicefinance.entity.UserStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class ProfileResponse {
    
    private Long id;
    private String email;
    private String phone;
    private String fullName;
    private String companyName;
    private String gstin;
    private String pan;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String website;
    private String sector;
    private Integer creditScore;
    private Set<UserRole> roles;
    private UserStatus status;
    private Boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;
    
    // KYC information
    private KycStatus kycStatus;
    private String kycDocumentUrl;
    private LocalDateTime kycSubmittedAt;
    private LocalDateTime kycApprovedAt;
    private LocalDateTime kycRejectedAt;
    private String kycRejectionReason;
    
    // Profile image
    private String profileImageUrl;
}
