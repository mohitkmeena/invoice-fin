package com.invoicefinance.controller;

import com.invoicefinance.dto.ApiResponse;
import com.invoicefinance.dto.ProfileResponse;
import com.invoicefinance.dto.UpdateProfileRequest;
import com.invoicefinance.dto.KycStatusUpdateRequest;
import com.invoicefinance.dto.UserResponse;
import com.invoicefinance.service.UserService;
import com.invoicefinance.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserResponse user = userService.getCurrentUserProfile();
        return ResponseEntity.ok(ApiResponse.success("Current user retrieved successfully", user));
    }
    
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile() {
        ProfileResponse profile = userService.getProfile();
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile));
    }
    
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        ProfileResponse profile = userService.updateProfile(request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }
    
    @PostMapping("/kyc/upload")
    public ResponseEntity<ApiResponse<ProfileResponse>> uploadKycDocument(@RequestParam String documentUrl) {
        ProfileResponse profile = userService.uploadKycDocument(documentUrl);
        return ResponseEntity.ok(ApiResponse.success("KYC document uploaded successfully", profile));
    }
    
    @PutMapping("/admin/{userId}/kyc-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateKycStatus(
            @PathVariable Long userId,
            @Valid @RequestBody KycStatusUpdateRequest request) {
        ProfileResponse profile = userService.updateKycStatus(userId, request);
        return ResponseEntity.ok(ApiResponse.success("KYC status updated successfully", profile));
    }
}






