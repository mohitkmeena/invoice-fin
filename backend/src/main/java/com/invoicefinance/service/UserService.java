package com.invoicefinance.service;

import com.invoicefinance.dto.ProfileResponse;
import com.invoicefinance.dto.UpdateProfileRequest;
import com.invoicefinance.dto.KycStatusUpdateRequest;
import com.invoicefinance.dto.UserResponse;
import com.invoicefinance.entity.User;
import com.invoicefinance.entity.KycStatus;
import com.invoicefinance.exception.BadRequestException;
import com.invoicefinance.exception.ResourceNotFoundException;
import com.invoicefinance.exception.UnauthorizedException;
import com.invoicefinance.repository.UserRepository;
import com.invoicefinance.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return getUserById(userPrincipal.getId());
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
    
    @Transactional
    public UserResponse getCurrentUserProfile() {
        User user = getCurrentUser();
        return mapToUserResponse(user);
    }
    
    @Transactional
    public ProfileResponse updateProfile(UpdateProfileRequest updateRequest) {
        User user = getCurrentUser();
        
        // Update only non-null fields
        if (updateRequest.getFullName() != null) {
            user.setFullName(updateRequest.getFullName());
        }
        if (updateRequest.getCompanyName() != null) {
            user.setCompanyName(updateRequest.getCompanyName());
        }
        if (updateRequest.getGstin() != null) {
            user.setGstin(updateRequest.getGstin());
        }
        if (updateRequest.getPan() != null) {
            user.setPan(updateRequest.getPan());
        }
        if (updateRequest.getAddress() != null) {
            user.setAddress(updateRequest.getAddress());
        }
        if (updateRequest.getCity() != null) {
            user.setCity(updateRequest.getCity());
        }
        if (updateRequest.getState() != null) {
            user.setState(updateRequest.getState());
        }
        if (updateRequest.getPincode() != null) {
            user.setPincode(updateRequest.getPincode());
        }
        if (updateRequest.getWebsite() != null) {
            user.setWebsite(updateRequest.getWebsite());
        }
        if (updateRequest.getSector() != null) {
            user.setSector(updateRequest.getSector());
        }
        
        user = userRepository.save(user);
        return mapToProfileResponse(user);
    }
    
    @Transactional
    public ProfileResponse getProfile() {
        User user = getCurrentUser();
        return mapToProfileResponse(user);
    }
    
    @Transactional
    public ProfileResponse uploadKycDocument(String documentUrl) {
        User user = getCurrentUser();
        
        if (user.getKycStatus() == KycStatus.VERIFIED) {
            throw new BadRequestException("KYC is already verified");
        }
        
        user.setKycDocumentUrl(documentUrl);
        user.setKycStatus(KycStatus.PENDING);
        user.setKycSubmittedAt(LocalDateTime.now());
        
        user = userRepository.save(user);
        return mapToProfileResponse(user);
    }
    
    @Transactional
    public ProfileResponse updateKycStatus(Long userId, KycStatusUpdateRequest request) {
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new UnauthorizedException("Only admins can update KYC status");
        }
        
        User user = getUserById(userId);
        
        user.setKycStatus(request.getKycStatus());
        
        if (request.getKycStatus() == KycStatus.VERIFIED) {
            user.setKycApprovedAt(LocalDateTime.now());
            user.setKycRejectedAt(null);
            user.setKycRejectionReason(null);
        } else if (request.getKycStatus() == KycStatus.REJECTED) {
            user.setKycRejectedAt(LocalDateTime.now());
            user.setKycApprovedAt(null);
            user.setKycRejectionReason(request.getRejectionReason());
        }
        
        user = userRepository.save(user);
        return mapToProfileResponse(user);
    }
    
    public UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId().toString())
                .email(user.getEmail())
                .phone(user.getPhone())
                .roles(user.getRoles())
                .status(user.getStatus())
                .fullName(user.getFullName())
                .companyName(user.getCompanyName())
                .gstin(user.getGstin())
                .pan(user.getPan())
                .address(user.getAddress())
                .city(user.getCity())
                .state(user.getState())
                .pincode(user.getPincode())
                .website(user.getWebsite())
                .sector(user.getSector())
                .creditScore(user.getCreditScore())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .updatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null)
                .lastLogin(user.getLastLogin() != null ? user.getLastLogin().toString() : null)
                .kycStatus(user.getKycStatus())
                .kycDocumentUrl(user.getKycDocumentUrl())
                .kycSubmittedAt(user.getKycSubmittedAt() != null ? user.getKycSubmittedAt().toString() : null)
                .kycApprovedAt(user.getKycApprovedAt() != null ? user.getKycApprovedAt().toString() : null)
                .kycRejectedAt(user.getKycRejectedAt() != null ? user.getKycRejectedAt().toString() : null)
                .kycRejectionReason(user.getKycRejectionReason())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }
    
    public ProfileResponse mapToProfileResponse(User user) {
        ProfileResponse response = new ProfileResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setFullName(user.getFullName());
        response.setCompanyName(user.getCompanyName());
        response.setGstin(user.getGstin());
        response.setPan(user.getPan());
        response.setAddress(user.getAddress());
        response.setCity(user.getCity());
        response.setState(user.getState());
        response.setPincode(user.getPincode());
        response.setWebsite(user.getWebsite());
        response.setSector(user.getSector());
        response.setCreditScore(user.getCreditScore());
        response.setRoles(user.getRoles());
        response.setStatus(user.getStatus());
        response.setEnabled(user.getEnabled());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        response.setLastLogin(user.getLastLogin());
        
        // KYC information
        response.setKycStatus(user.getKycStatus());
        response.setKycDocumentUrl(user.getKycDocumentUrl());
        response.setKycSubmittedAt(user.getKycSubmittedAt());
        response.setKycApprovedAt(user.getKycApprovedAt());
        response.setKycRejectedAt(user.getKycRejectedAt());
        response.setKycRejectionReason(user.getKycRejectionReason());
        
        // Profile image
        response.setProfileImageUrl(user.getProfileImageUrl());
        
        return response;
    }
}






