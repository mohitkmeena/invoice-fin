package com.invoicefinance.dto;

import com.invoicefinance.entity.FinancingRequestStatus;
import com.invoicefinance.entity.InvoiceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceResponse {
    private String id;
    private String borrowerUserId;
    private String borrowerCompanyName;
    private String borrowerFullName;
    private InvoiceType type;
    private String invoiceNumber;
    private String buyerName;
    private String buyerGstin;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private BigDecimal invoiceAmount;
    private BigDecimal requestedAmount;
    private BigDecimal minAcceptAmount;
    private BigDecimal expectedInterestRate;
    private String currency;
    private String location;
    private String documentId;
    private String documentDownloadUrl;
    private FinancingRequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long tenorDays;
}




