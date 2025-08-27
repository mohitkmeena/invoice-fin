package com.invoicefinance.dto;

import com.invoicefinance.entity.KycStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class KycStatusUpdateRequest {
    
    @NotNull(message = "KYC status is required")
    private KycStatus kycStatus;
    
    private String rejectionReason;
}


