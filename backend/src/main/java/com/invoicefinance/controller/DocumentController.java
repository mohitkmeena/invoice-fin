package com.invoicefinance.controller;

import com.invoicefinance.dto.*;
import com.invoicefinance.entity.DocumentType;
import com.invoicefinance.service.DocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController {
    
    private final DocumentService documentService;
    
    @PostMapping("/presign")
    public ResponseEntity<ApiResponse<PresignedUrlResponse>> generatePresignedUrl(
            @RequestParam DocumentType type,
            @Valid @RequestBody PresignedUrlRequest request) {
        PresignedUrlResponse response = documentService.generatePresignedUrl(type, request);
        return ResponseEntity.ok(ApiResponse.success("Presigned URL generated", response));
    }
    
    @PostMapping("/complete")
    public ResponseEntity<ApiResponse<DocumentResponse>> completeUpload(
            @Valid @RequestBody CompleteDocumentUploadRequest request) {
        DocumentResponse document = documentService.completeUpload(request);
        return ResponseEntity.ok(ApiResponse.success("Document upload completed", document));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DocumentResponse>> getDocument(@PathVariable Long id) {
        DocumentResponse document = documentService.getDocument(id);
        return ResponseEntity.ok(ApiResponse.success("Document retrieved", document));
    }
    
    @GetMapping("/{id}/download")
    public ResponseEntity<ApiResponse<PresignedUrlResponse>> getDownloadUrl(@PathVariable Long id) {
        PresignedUrlResponse response = documentService.getDownloadUrl(id);
        return ResponseEntity.ok(ApiResponse.success("Download URL generated", response));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getUserDocuments(
            @RequestParam(required = false) DocumentType type) {
        List<DocumentResponse> documents = documentService.getUserDocuments(type);
        return ResponseEntity.ok(ApiResponse.success("Documents retrieved", documents));
    }
}








