package com.invoicefinance.service;

import com.invoicefinance.dto.KycResponse;
import com.invoicefinance.dto.KycSubmissionRequest;
import com.invoicefinance.dto.PresignedUrlRequest;
import com.invoicefinance.dto.PresignedUrlResponse;
import com.invoicefinance.entity.DocumentType;
import com.invoicefinance.entity.KycDocument;
import com.invoicefinance.entity.KycStatus;
import com.invoicefinance.entity.User;
import com.invoicefinance.exception.BadRequestException;
import com.invoicefinance.exception.ResourceNotFoundException;
import com.invoicefinance.repository.KycDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class KycService {
    
    private final KycDocumentRepository kycDocumentRepository;
    private final DocumentService documentService;
    private final UserService userService;
    
    public PresignedUrlResponse getAadhaarPresignedUrl(PresignedUrlRequest request) {
        return documentService.generatePresignedUrl(DocumentType.KYC_AADHAAR, request);
    }
    
    public PresignedUrlResponse getPanPresignedUrl(PresignedUrlRequest request) {
        return documentService.generatePresignedUrl(DocumentType.KYC_PAN, request);
    }
    
    @Transactional
    public KycResponse submitKyc(KycSubmissionRequest request) {
        User currentUser = userService.getCurrentUser();
        
        // Check if user already has KYC submitted
        Optional<KycDocument> existingKyc = kycDocumentRepository.findByUser(currentUser);
        if (existingKyc.isPresent() && !KycStatus.REJECTED.equals(existingKyc.get().getStatus())) {
            throw new BadRequestException("KYC already submitted for this user");
        }
        
        KycDocument kycDocument;
        if (existingKyc.isPresent()) {
            // Update existing rejected KYC
            kycDocument = existingKyc.get();
            kycDocument.setAadhaarLast4(request.getAadhaarLast4());
            kycDocument.setPanLast4(request.getPanLast4());
            kycDocument.setAadhaarS3Key(request.getAadhaarKey());
            kycDocument.setPanS3Key(request.getPanKey());
            kycDocument.setStatus(KycStatus.PENDING);
            kycDocument.setRemarks(null);
        } else {
            // Create new KYC document
            kycDocument = KycDocument.builder()
                    .user(currentUser)
                    .aadhaarLast4(request.getAadhaarLast4())
                    .panLast4(request.getPanLast4())
                    .aadhaarS3Key(request.getAadhaarKey())
                    .panS3Key(request.getPanKey())
                    .status(KycStatus.PENDING)
                    .build();
        }
        
        kycDocument = kycDocumentRepository.save(kycDocument);
        
        log.info("KYC submitted for user: {}", currentUser.getId());
        return mapToKycResponse(kycDocument);
    }
    
    public KycResponse getKycStatus(Long userId) {
        User requestedUser;
        User currentUser = userService.getCurrentUser();
        
        // Users can view their own KYC status, admins can view any
        if (userId.equals(currentUser.getId()) || currentUser.isAdmin()) {
            requestedUser = userService.getUserById(userId);
        } else {
            throw new BadRequestException("Access denied to view this KYC status");
        }
        
        KycDocument kycDocument = kycDocumentRepository.findByUser(requestedUser)
                .orElseThrow(() -> new ResourceNotFoundException("No KYC record found for this user"));
        
        return mapToKycResponse(kycDocument);
    }
    
    @Transactional
    public KycResponse approveKyc(Long userId, String remarks) {
        User currentUser = userService.getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("Only admins can approve KYC");
        }
        
        User targetUser = userService.getUserById(userId);
        KycDocument kycDocument = kycDocumentRepository.findByUser(targetUser)
                .orElseThrow(() -> new ResourceNotFoundException("No KYC record found for this user"));
        
        kycDocument.setStatus(KycStatus.VERIFIED);
        kycDocument.setRemarks(remarks);
        kycDocument = kycDocumentRepository.save(kycDocument);
        
        log.info("KYC approved for user: {} by admin: {}", userId, currentUser.getId());
        return mapToKycResponse(kycDocument);
    }
    
    @Transactional
    public KycResponse rejectKyc(Long userId, String remarks) {
        User currentUser = userService.getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("Only admins can reject KYC");
        }
        
        User targetUser = userService.getUserById(userId);
        KycDocument kycDocument = kycDocumentRepository.findByUser(targetUser)
                .orElseThrow(() -> new ResourceNotFoundException("No KYC record found for this user"));
        
        kycDocument.setStatus(KycStatus.REJECTED);
        kycDocument.setRemarks(remarks);
        kycDocument = kycDocumentRepository.save(kycDocument);
        
        log.info("KYC rejected for user: {} by admin: {}", userId, currentUser.getId());
        return mapToKycResponse(kycDocument);
    }
    
    public boolean isUserKycVerified(Long userId) {
        try {
            User user = userService.getUserById(userId);
            Optional<KycDocument> kycDocument = kycDocumentRepository.findByUser(user);
            return kycDocument.isPresent() && KycStatus.VERIFIED.equals(kycDocument.get().getStatus());
        } catch (Exception e) {
            log.warn("Failed to check KYC status for user {}: {}", userId, e.getMessage());
            return false;
        }
    }
    
    private KycResponse mapToKycResponse(KycDocument kycDocument) {
        return KycResponse.builder()
                .id(kycDocument.getId().toString())
                .userId(kycDocument.getUser().getId().toString())
                .aadhaarLast4(kycDocument.getAadhaarLast4())
                .panLast4(kycDocument.getPanLast4())
                .aadhaarS3Key(kycDocument.getAadhaarS3Key())
                .panS3Key(kycDocument.getPanS3Key())
                .status(kycDocument.getStatus())
                .providerRef(kycDocument.getProviderRef())
                .remarks(kycDocument.getRemarks())
                .createdAt(kycDocument.getCreatedAt())
                .updatedAt(kycDocument.getUpdatedAt())
                .build();
    }
}




