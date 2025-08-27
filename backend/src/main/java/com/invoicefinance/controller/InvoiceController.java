
package com.invoicefinance.controller;

import com.invoicefinance.dto.*;
import com.invoicefinance.service.InvoiceService;
import com.invoicefinance.service.OfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
public class InvoiceController {
    
    private final InvoiceService invoiceService;
    private final OfferService offerService;
    
    // POST /api/invoices → Upload invoice + expected rate
    @PostMapping
    public ResponseEntity<ApiResponse<InvoiceResponse>> createInvoice(
            @Valid @RequestBody CreateFinancingRequestForm request) {
        InvoiceResponse invoice = invoiceService.createFinancingRequest(request);
        return ResponseEntity.ok(ApiResponse.success("Invoice created successfully", invoice));
    }
    
    // GET /api/invoices → List all open invoices (public marketplace for lenders)
    @GetMapping
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getAllOpenInvoices(
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(required = false) String buyerGstin,
            @RequestParam(required = false) String search) {
        
        List<InvoiceResponse> invoices = invoiceService.getMarketplaceInvoices(
                minAmount, maxAmount, buyerGstin, search);
        return ResponseEntity.ok(ApiResponse.success("Open invoices retrieved", invoices));
    }
    
    // GET /api/invoices/{id} → Get invoice details + S3 file link
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoice(@PathVariable Long id) {
        InvoiceResponse invoice = invoiceService.getInvoice(id);
        return ResponseEntity.ok(ApiResponse.success("Invoice retrieved successfully", invoice));
    }
    
    // GET /api/invoices/borrower/{id} → List borrower's invoices
    @GetMapping("/borrower/{borrowerId}")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getBorrowerInvoices(@PathVariable Long borrowerId) {
        List<InvoiceResponse> invoices = invoiceService.getBorrowerInvoices(borrowerId);
        return ResponseEntity.ok(ApiResponse.success("Borrower invoices retrieved", invoices));
    }
    
    // Additional endpoints for internal use
    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getMyInvoices() {
        List<InvoiceResponse> invoices = invoiceService.getMyInvoices();
        return ResponseEntity.ok(ApiResponse.success("My invoices retrieved successfully", invoices));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> updateInvoice(
            @PathVariable Long id, 
            @Valid @RequestBody CreateFinancingRequestForm request) {
        InvoiceResponse invoice = invoiceService.updateInvoice(id, request);
        return ResponseEntity.ok(ApiResponse.success("Invoice updated successfully", invoice));
    }
    
    @PostMapping("/{id}/list")
    public ResponseEntity<ApiResponse<InvoiceResponse>> listInvoice(@PathVariable Long id) {
        InvoiceResponse invoice = invoiceService.listInvoice(id);
        return ResponseEntity.ok(ApiResponse.success("Invoice listed in marketplace", invoice));
    }
}
