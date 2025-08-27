package com.invoicefinance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "kyc_documents")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KycDocument {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Size(max = 4)
    @Column(name = "aadhaar_last_4")
    private String aadhaarLast4;
    
    @Size(max = 4)
    @Column(name = "pan_last_4")
    private String panLast4;
    
    @Size(max = 255)
    @Column(name = "aadhaar_s3_key")
    private String aadhaarS3Key;
    
    @Size(max = 255)
    @Column(name = "pan_s3_key")
    private String panS3Key;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private KycStatus status = KycStatus.PENDING;
    
    @Size(max = 255)
    @Column(name = "provider_ref")
    private String providerRef;
    
    @Column(columnDefinition = "TEXT")
    private String remarks;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Helper methods
    public boolean isVerified() {
        return KycStatus.VERIFIED.equals(status);
    }
    
    public boolean isPending() {
        return KycStatus.PENDING.equals(status);
    }
    
    public boolean isRejected() {
        return KycStatus.REJECTED.equals(status);
    }
    
}









