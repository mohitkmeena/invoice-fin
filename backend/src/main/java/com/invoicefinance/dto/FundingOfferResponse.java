package com.invoicefinance.dto;

import com.invoicefinance.entity.FundingOfferStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FundingOfferResponse {
    private String id;
    private String financingRequestId;
    private String lenderUserId;
    private BigDecimal offerAmount;
    private BigDecimal interestRatePa;
    private BigDecimal processingFee;
    private Integer tenorDays;
    private LocalDateTime validUntil;
    private String notes;
    private FundingOfferStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}








