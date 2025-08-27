package com.invoicefinance.dto;

import com.invoicefinance.entity.KycStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KycResponse {
    private String id;
    private String userId;
    private String aadhaarLast4;
    private String panLast4;
    private String aadhaarS3Key;
    private String panS3Key;
    private KycStatus status;
    private String providerRef;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}








