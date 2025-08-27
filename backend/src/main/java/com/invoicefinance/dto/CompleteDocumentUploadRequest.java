package com.invoicefinance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompleteDocumentUploadRequest {
    @NotBlank(message = "S3 key is required")
    private String key;
    
    @NotBlank(message = "Original filename is required")
    private String originalFilename;
    
    @NotBlank(message = "SHA256 hash is required")
    private String sha256;
    
    @NotBlank(message = "MIME type is required")
    private String mimeType;
    
    @Positive(message = "Size must be positive")
    private Long size;
}








