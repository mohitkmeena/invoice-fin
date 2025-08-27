package com.invoicefinance.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateFundingOfferForm {
    @NotBlank(message = "Financing request ID is required")
    private String financingRequestId;
    
    @NotNull(message = "Offer amount is required")
    @DecimalMin(value = "0.01", message = "Offer amount must be positive")
    private BigDecimal offerAmount;
    
    @NotNull(message = "Interest rate is required")
    @DecimalMin(value = "0.01", message = "Interest rate must be positive")
    private BigDecimal interestRatePa;
    
    @NotNull(message = "Processing fee is required")
    @DecimalMin(value = "0.0", message = "Processing fee cannot be negative")
    private BigDecimal processingFee;
    
    @NotNull(message = "Tenor days is required")
    @Positive(message = "Tenor days must be positive")
    private Integer tenorDays;
    
    @NotNull(message = "Valid until date is required")
    private LocalDateTime validUntil;
    
    private String notes;
}








