package com.invoicefinance.service;

import com.invoicefinance.dto.*;
import com.invoicefinance.entity.User;
import com.invoicefinance.entity.UserStatus;
import com.invoicefinance.exception.BadRequestException;
import com.invoicefinance.repository.UserRepository;
import com.invoicefinance.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering user with email: {}", request.getEmail());
        
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number is already registered");
        }
        
        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .roles(request.getRoles())
                .status(UserStatus.ACTIVE)
                .fullName(request.getFullName())
                .companyName(request.getCompanyName())
                .gstin(request.getGstin())
                .pan(request.getPan())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .build();
        
        user = userRepository.save(user);
        
        // Generate tokens
        String accessToken = tokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());
        
        UserResponse userResponse = userService.mapToUserResponse(user);
        
        log.info("User registered successfully with ID: {}", user.getId());
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userResponse)
                .build();
    }
    
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("User login attempt with email: {}", request.getEmail());
        
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        // Update last login
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));
        
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        // Generate tokens
        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());
        
        UserResponse userResponse = userService.mapToUserResponse(user);
        
        log.info("User logged in successfully with ID: {}", user.getId());
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userResponse)
                .build();
    }
    
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid refresh token");
        }
        
        String email = tokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        
        String newAccessToken = tokenProvider.generateAccessToken(email);
        String newRefreshToken = tokenProvider.generateRefreshToken(email);
        
        UserResponse userResponse = userService.mapToUserResponse(user);
        
        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .user(userResponse)
                .build();
    }
}








