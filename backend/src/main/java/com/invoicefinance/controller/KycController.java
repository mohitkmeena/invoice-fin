package com.invoicefinance.controller;

import com.invoicefinance.dto.*;
import com.invoicefinance.service.KycService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/kyc")
@RequiredArgsConstructor
public class KycController {
    
    private final KycService kycService;
    
    @PostMapping("/aadhaar/presign")
    public ResponseEntity<ApiResponse<PresignedUrlResponse>> getAadhaarPresignedUrl(
            @Valid @RequestBody PresignedUrlRequest request) {
        PresignedUrlResponse response = kycService.getAadhaarPresignedUrl(request);
        return ResponseEntity.ok(ApiResponse.success("Aadhaar presigned URL generated", response));
    }
    
    @PostMapping("/pan/presign")
    public ResponseEntity<ApiResponse<PresignedUrlResponse>> getPanPresignedUrl(
            @Valid @RequestBody PresignedUrlRequest request) {
        PresignedUrlResponse response = kycService.getPanPresignedUrl(request);
        return ResponseEntity.ok(ApiResponse.success("PAN presigned URL generated", response));
    }
    
    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<KycResponse>> submitKyc(
            @Valid @RequestBody KycSubmissionRequest request) {
        KycResponse kyc = kycService.submitKyc(request);
        return ResponseEntity.ok(ApiResponse.success("KYC submitted successfully", kyc));
    }
    
    @GetMapping("/status/{userId}")
    public ResponseEntity<ApiResponse<KycResponse>> getKycStatus(@PathVariable Long userId) {
        KycResponse kyc = kycService.getKycStatus(userId);
        return ResponseEntity.ok(ApiResponse.success("KYC status retrieved", kyc));
    }
    
    @PostMapping("/{userId}/approve")
    public ResponseEntity<ApiResponse<KycResponse>> approveKyc(
            @PathVariable Long userId,
            @RequestParam(required = false) String remarks) {
        KycResponse kyc = kycService.approveKyc(userId, remarks);
        return ResponseEntity.ok(ApiResponse.success("KYC approved successfully", kyc));
    }
    
    @PostMapping("/{userId}/reject")
    public ResponseEntity<ApiResponse<KycResponse>> rejectKyc(
            @PathVariable Long userId,
            @RequestParam String remarks) {
        KycResponse kyc = kycService.rejectKyc(userId, remarks);
        return ResponseEntity.ok(ApiResponse.success("KYC rejected", kyc));
    }
}








