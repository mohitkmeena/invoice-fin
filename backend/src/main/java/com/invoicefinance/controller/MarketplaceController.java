package com.invoicefinance.controller;

import com.invoicefinance.dto.ApiResponse;
import com.invoicefinance.dto.InvoiceResponse;
import com.invoicefinance.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {
    
    private final InvoiceService invoiceService;
    
    @GetMapping("/invoices")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> discoverInvoices(
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(required = false) String buyerGstin,
            @RequestParam(required = false) String search) {
        
        List<InvoiceResponse> invoices = invoiceService.getMarketplaceInvoices(
                minAmount, maxAmount, buyerGstin, search);
        
        return ResponseEntity.ok(ApiResponse.success("Marketplace invoices retrieved", invoices));
    }
}








