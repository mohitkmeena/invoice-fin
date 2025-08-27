package com.invoicefinance.controller;

import com.invoicefinance.dto.ApiResponse;
import com.invoicefinance.dto.CreateFundingOfferForm;
import com.invoicefinance.dto.DealResponse;
import com.invoicefinance.dto.FundingOfferResponse;
import com.invoicefinance.service.DealService;
import com.invoicefinance.service.OfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/offers")
@RequiredArgsConstructor
public class OfferController {
    
    private final OfferService offerService;
    private final DealService dealService;
    
    // POST /api/offers → Lender makes offer (with interest rate)
    @PostMapping
    public ResponseEntity<ApiResponse<FundingOfferResponse>> createOffer(
            @Valid @RequestBody CreateFundingOfferForm request) {
        FundingOfferResponse offer = offerService.createOffer(request);
        return ResponseEntity.ok(ApiResponse.success("Funding offer created successfully", offer));
    }
    
    // GET /api/offers/invoice/{id} → List all offers on a given invoice
    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<ApiResponse<List<FundingOfferResponse>>> getInvoiceOffers(@PathVariable Long invoiceId) {
        List<FundingOfferResponse> offers = offerService.getInvoiceOffers(invoiceId);
        return ResponseEntity.ok(ApiResponse.success("Invoice offers retrieved successfully", offers));
    }
    
    // POST /api/offers/{id}/accept → Borrower accepts lender offer
    @PostMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<DealResponse>> acceptOffer(@PathVariable Long id) {
        DealResponse deal = dealService.acceptOffer(id);
        return ResponseEntity.ok(ApiResponse.success("Offer accepted successfully", deal));
    }
    
    // Additional endpoints for offer management
    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<FundingOfferResponse>>> getMyOffers() {
        List<FundingOfferResponse> offers = offerService.getMyOffers();
        return ResponseEntity.ok(ApiResponse.success("Offers retrieved successfully", offers));
    }
    
    @PostMapping("/{id}/withdraw")
    public ResponseEntity<ApiResponse<FundingOfferResponse>> withdrawOffer(@PathVariable Long id) {
        FundingOfferResponse offer = offerService.withdrawOffer(id);
        return ResponseEntity.ok(ApiResponse.success("Offer withdrawn successfully", offer));
    }
}




