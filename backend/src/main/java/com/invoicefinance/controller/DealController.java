package com.invoicefinance.controller;

import com.invoicefinance.dto.ApiResponse;
import com.invoicefinance.dto.DealResponse;
import com.invoicefinance.dto.UserResponse;
import com.invoicefinance.service.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/deals")
@RequiredArgsConstructor
public class DealController {
    
    private final DealService dealService;
    
    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<DealResponse>>> getMyDeals() {
        List<DealResponse> deals = dealService.getMyDeals();
        return ResponseEntity.ok(ApiResponse.success("Deals retrieved successfully", deals));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DealResponse>> getDeal(@PathVariable Long id) {
        DealResponse deal = dealService.getDeal(id);
        return ResponseEntity.ok(ApiResponse.success("Deal retrieved successfully", deal));
    }
    
    @GetMapping("/{id}/contacts")
    public ResponseEntity<ApiResponse<Map<String, UserResponse>>> getDealContacts(@PathVariable Long id) {
        Map<String, UserResponse> contacts = dealService.getDealContacts(id);
        return ResponseEntity.ok(ApiResponse.success("Deal contacts retrieved successfully", contacts));
    }
}








