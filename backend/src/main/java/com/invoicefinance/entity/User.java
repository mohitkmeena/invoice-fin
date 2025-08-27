package com.invoicefinance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotBlank(message = "Phone number is required")
    @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 characters")
    @Column(unique = true, nullable = false)
    private String phone;
    
    @NotBlank(message = "Password is required")
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @Enumerated(EnumType.STRING)
    @ElementCollection(targetClass = UserRole.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role", nullable = false)
    @Builder.Default
    private Set<UserRole> roles = new HashSet<>();
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean enabled = true;
    
    // Profile information
    @Size(max = 255)
    @Column(name = "full_name")
    private String fullName;
    
    @Size(max = 255) 
    @Column(name = "company_name")
    private String companyName;
    
    @Size(max = 15)
    @Column(name = "gstin")
    private String gstin;
    
    @Size(max = 10)
    @Column(name = "pan")
    private String pan;
    
    @Column(columnDefinition = "TEXT")
    private String address;
    
    @Size(max = 100)
    private String city;
    
    @Size(max = 100)
    private String state;
    
    @Size(max = 10)
    private String pincode;
    
    @Size(max = 255)
    private String website;
    
    @Size(max = 100)
    private String sector;
    
    @Column(name = "credit_score")
    private Integer creditScore;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    // KYC fields
    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status", nullable = false)
    @Builder.Default
    private KycStatus kycStatus = KycStatus.PENDING;
    
    @Column(name = "kyc_document_url")
    private String kycDocumentUrl;
    
    @Column(name = "kyc_submitted_at")
    private LocalDateTime kycSubmittedAt;
    
    @Column(name = "kyc_approved_at")
    private LocalDateTime kycApprovedAt;
    
    @Column(name = "kyc_rejected_at")
    private LocalDateTime kycRejectedAt;
    
    @Column(name = "kyc_rejection_reason")
    private String kycRejectionReason;
    
    // Profile image
    @Column(name = "profile_image_url")
    private String profileImageUrl;
    
    // Helper methods
    public boolean hasRole(UserRole role) {
        return this.roles.contains(role);
    }
    
    public boolean isBorrower() {
        return hasRole(UserRole.BORROWER);
    }
    
    public boolean isLender() {
        return hasRole(UserRole.LENDER);
    }
    
    public boolean isAdmin() {
        return hasRole(UserRole.ADMIN);
    }
    
    public boolean isKycVerified() {
        return KycStatus.VERIFIED.equals(this.kycStatus);
    }
}

