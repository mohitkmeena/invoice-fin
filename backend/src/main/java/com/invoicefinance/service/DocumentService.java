package com.invoicefinance.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.invoicefinance.dto.*;
import com.invoicefinance.entity.Document;
import com.invoicefinance.entity.DocumentType;
import com.invoicefinance.entity.User;
import com.invoicefinance.exception.BadRequestException;
import com.invoicefinance.exception.ResourceNotFoundException;
import com.invoicefinance.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URL;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {
    
    private final DocumentRepository documentRepository;
    private final UserService userService;
    private final AmazonS3 amazonS3;
    
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;
    
    public PresignedUrlResponse generatePresignedUrl(DocumentType type, PresignedUrlRequest request) {
        User currentUser = userService.getCurrentUser();
        
        // Validate file size (50MB limit)
        if (request.getSize() > 50 * 1024 * 1024) {
            throw new BadRequestException("File size cannot exceed 50MB");
        }
        
        // Generate unique S3 key
        String key = generateS3Key(currentUser.getId(), type);
        
        // Generate presigned URL for upload (valid for 15 minutes)
        Date expiration = new Date(System.currentTimeMillis() + (15 * 60 * 1000));
        GeneratePresignedUrlRequest presignedUrlRequest = new GeneratePresignedUrlRequest(bucketName, key)
                .withMethod(HttpMethod.PUT)
                .withExpiration(expiration);
        
        presignedUrlRequest.setContentType(request.getContentType());
        
        URL url = amazonS3.generatePresignedUrl(presignedUrlRequest);
        
        log.info("Generated presigned URL for user {} and document type {}", currentUser.getId(), type);
        
        return PresignedUrlResponse.builder()
                .url(url.toString())
                .key(key)
                .build();
    }
    
    @Transactional
    public DocumentResponse completeUpload(CompleteDocumentUploadRequest request) {
        User currentUser = userService.getCurrentUser();
        
        // Verify the S3 key belongs to the current user
        if (!request.getKey().contains("/" + currentUser.getId() + "/")) {
            throw new BadRequestException("Invalid document key");
        }
        
        // Determine document type from S3 key
        DocumentType type = extractDocumentType(request.getKey());
        
        Document document = Document.builder()
                .ownerUser(currentUser)
                .type(type)
                .s3Key(request.getKey())
                .originalFilename(request.getOriginalFilename())
                .mimeType(request.getMimeType())
                .sizeBytes(request.getSize())
                .sha256(request.getSha256())
                .build();
        
        document = documentRepository.save(document);
        
        log.info("Document upload completed for user {} with ID {}", currentUser.getId(), document.getId());
        
        return mapToDocumentResponse(document);
    }
    
    public DocumentResponse getDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        
        User currentUser = userService.getCurrentUser();
        
        // Check if user has access to this document
        if (!document.getOwnerUser().getId().equals(currentUser.getId()) && !currentUser.isAdmin()) {
            throw new BadRequestException("Access denied to this document");
        }
        
        return mapToDocumentResponse(document);
    }
    
    public PresignedUrlResponse getDownloadUrl(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        
        User currentUser = userService.getCurrentUser();
        
        // Check if user has access to this document
        if (!document.getOwnerUser().getId().equals(currentUser.getId()) && !currentUser.isAdmin()) {
            throw new BadRequestException("Access denied to this document");
        }
        
        // Generate presigned URL for download (valid for 1 hour)
        Date expiration = new Date(System.currentTimeMillis() + (60 * 60 * 1000));
        GeneratePresignedUrlRequest presignedUrlRequest = new GeneratePresignedUrlRequest(bucketName, document.getS3Key())
                .withMethod(HttpMethod.GET)
                .withExpiration(expiration);
        
        URL url = amazonS3.generatePresignedUrl(presignedUrlRequest);
        
        return PresignedUrlResponse.builder()
                .url(url.toString())
                .key(document.getS3Key())
                .build();
    }
    
    public List<DocumentResponse> getUserDocuments(DocumentType type) {
        User currentUser = userService.getCurrentUser();
        
        List<Document> documents;
        if (type != null) {
            documents = documentRepository.findByOwnerUserAndTypeOrderByCreatedAtDesc(currentUser, type);
        } else {
            documents = documentRepository.findByOwnerUserOrderByCreatedAtDesc(currentUser);
        }
        
        return documents.stream()
                .map(this::mapToDocumentResponse)
                .collect(Collectors.toList());
    }
    
    private String generateS3Key(Long userId, DocumentType type) {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        return String.format("documents/%d/%s/%s-%s", userId, type.name().toLowerCase(), timestamp, uuid);
    }
    
    private DocumentType extractDocumentType(String s3Key) {
        if (s3Key.contains("/invoice/")) return DocumentType.INVOICE;
        if (s3Key.contains("/purchase_order/")) return DocumentType.PURCHASE_ORDER;
        if (s3Key.contains("/kyc_aadhaar/")) return DocumentType.KYC_AADHAAR;
        if (s3Key.contains("/kyc_pan/")) return DocumentType.KYC_PAN;
        return DocumentType.OTHER;
    }
    
    private DocumentResponse mapToDocumentResponse(Document document) {
        return DocumentResponse.builder()
                .id(document.getId().toString())
                .ownerUserId(document.getOwnerUser().getId().toString())
                .type(document.getType())
                .s3Key(document.getS3Key())
                .originalFilename(document.getOriginalFilename())
                .mimeType(document.getMimeType())
                .sizeBytes(document.getSizeBytes())
                .sha256(document.getSha256())
                .visibility(document.getVisibility())
                .createdAt(document.getCreatedAt())
                .build();
    }
}








