package com.invoicefinance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "funding_offers")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FundingOffer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lender_user_id", nullable = false)
    private User lenderUser;
    
    @NotNull
    @DecimalMin(value = "0.01")
    @Column(name = "offer_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal offerAmount;
    
    @NotNull
    @DecimalMin(value = "0.01")
    @Column(name = "interest_rate_pa", nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRatePa;
    
    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "processing_fee", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal processingFee = BigDecimal.ZERO;
    
    @NotNull
    @Positive
    @Column(name = "tenor_days", nullable = false)
    private Integer tenorDays;
    
    @NotNull
    @Column(name = "valid_until", nullable = false)
    private LocalDateTime validUntil;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private FundingOfferStatus status = FundingOfferStatus.ACTIVE;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Helper methods
    public boolean isActive() {
        return FundingOfferStatus.ACTIVE.equals(status) && 
               LocalDateTime.now().isBefore(validUntil);
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(validUntil) || 
               FundingOfferStatus.EXPIRED.equals(status);
    }
    
    public boolean isAccepted() {
        return FundingOfferStatus.ACCEPTED.equals(status);
    }
}






