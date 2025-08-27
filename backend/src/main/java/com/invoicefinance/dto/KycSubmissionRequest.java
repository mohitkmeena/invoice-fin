package com.invoicefinance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KycSubmissionRequest {
    @NotBlank(message = "Aadhaar last 4 digits are required")
    @Size(min = 4, max = 4, message = "Aadhaar last 4 must be exactly 4 digits")
    private String aadhaarLast4;
    
    @NotBlank(message = "PAN last 4 characters are required")
    @Size(min = 4, max = 4, message = "PAN last 4 must be exactly 4 characters")
    private String panLast4;
    
    @NotBlank(message = "Aadhaar S3 key is required")
    private String aadhaarKey;
    
    @NotBlank(message = "PAN S3 key is required")
    private String panKey;
}








