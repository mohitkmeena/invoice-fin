package com.invoicefinance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "invoices")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrower_user_id", nullable = false)
    private User borrowerUser;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceType type;
    
    @NotBlank
    @Size(max = 100)
    @Column(name = "invoice_number", nullable = false)
    private String invoiceNumber;
    
    @NotBlank
    @Size(max = 255)
    @Column(name = "buyer_name", nullable = false)
    private String buyerName;
    
    @Size(max = 15)
    @Column(name = "buyer_gstin")
    private String buyerGstin;
    
    @NotNull
    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;
    
    @NotNull
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;
    
    @NotNull
    @DecimalMin(value = "0.01")
    @Column(name = "invoice_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal invoiceAmount;
    
    @NotNull
    @DecimalMin(value = "0.01")
    @Column(name = "requested_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal requestedAmount;
    
    @NotNull
    @DecimalMin(value = "0.01")
    @Column(name = "min_accept_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal minAcceptAmount;
    
    @NotNull
    @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;
    
    @NotNull
    @DecimalMin(value = "0.01")
    @Column(name = "expected_interest_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal expectedInterestRate;
    
    @NotBlank
    @Size(max = 3)
    @Builder.Default
    private String currency = "INR";
    
    @Size(max = 255)
    private String location;
    
    @Column(name = "share_token")
    @Builder.Default
    private String shareToken = "";
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private Document document;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private FinancingRequestStatus status = FinancingRequestStatus.DRAFT;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<FundingOffer> offers = new HashSet<>();
    
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Deal> deals = new HashSet<>();
    
    // Helper methods
    public Long getTenorDays() {
        return java.time.temporal.ChronoUnit.DAYS.between(invoiceDate, dueDate);
    }
    
    public boolean isOverdue() {
        return LocalDate.now().isAfter(dueDate) && !isSettled();
    }
    
    public boolean isSettled() {
        return FinancingRequestStatus.SETTLED.equals(status);
    }
    
    public boolean isOpen() {
        return FinancingRequestStatus.OPEN.equals(status);
    }
}



