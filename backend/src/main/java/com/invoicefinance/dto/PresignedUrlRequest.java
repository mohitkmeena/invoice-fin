package com.invoicefinance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PresignedUrlRequest {
    @NotBlank(message = "Content type is required")
    private String contentType;
    
    @Positive(message = "Size must be positive")
    private Long size;
}








