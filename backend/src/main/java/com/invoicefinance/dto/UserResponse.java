package com.invoicefinance.dto;

import com.invoicefinance.entity.KycStatus;
import com.invoicefinance.entity.UserRole;
import com.invoicefinance.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private String id;
    private String email;
    private String phone;
    private Set<UserRole> roles;
    private UserStatus status;
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
    private String createdAt;
    private String updatedAt;
    private String lastLogin;
    
    // KYC information
    private KycStatus kycStatus;
    private String kycDocumentUrl;
    private String kycSubmittedAt;
    private String kycApprovedAt;
    private String kycRejectedAt;
    private String kycRejectionReason;
    
    // Profile image
    private String profileImageUrl;
}






