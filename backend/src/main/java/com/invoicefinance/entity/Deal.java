package com.invoicefinance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "deals")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deal {
    
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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrower_user_id", nullable = false)
    private User borrowerUser;
    
    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_offer_id", nullable = false)
    private FundingOffer selectedOffer;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private DealStatus status = DealStatus.KYC_PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "contact_visibility", nullable = false, length = 20)
    @Builder.Default
    private ContactVisibility contactVisibility = ContactVisibility.MASKED;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Helper methods
    public boolean isActive() {
        return DealStatus.ACTIVE.equals(status);
    }
    
    public boolean isSettled() {
        return DealStatus.SETTLED.equals(status);
    }
    
    public boolean areContactsVisible() {
        return ContactVisibility.VISIBLE.equals(contactVisibility);
    }
}






