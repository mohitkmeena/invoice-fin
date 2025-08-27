package com.invoicefinance.dto;

import com.invoicefinance.entity.DocumentType;
import com.invoicefinance.entity.DocumentVisibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentResponse {
    private String id;
    private String ownerUserId;
    private DocumentType type;
    private String s3Key;
    private String originalFilename;
    private String mimeType;
    private Long sizeBytes;
    private String sha256;
    private DocumentVisibility visibility;
    private LocalDateTime createdAt;
}








