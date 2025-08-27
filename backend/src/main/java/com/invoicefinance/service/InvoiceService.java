package com.invoicefinance.service;

import com.invoicefinance.dto.CreateFinancingRequestForm;
import com.invoicefinance.dto.InvoiceResponse;
import com.invoicefinance.entity.*;
import com.invoicefinance.exception.BadRequestException;
import com.invoicefinance.exception.ResourceNotFoundException;
import com.invoicefinance.repository.DocumentRepository;
import com.invoicefinance.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceService {
    
    private final InvoiceRepository invoiceRepository;
    private final DocumentRepository documentRepository;
    private final UserService userService;
    private final DocumentService documentService;
    
    @Transactional
    public InvoiceResponse createFinancingRequest(CreateFinancingRequestForm request) {
        User currentUser = userService.getCurrentUser();
        
        if (!currentUser.isBorrower()) {
            throw new BadRequestException("Only borrowers can create financing requests");
        }
        
        // Validate amounts
        if (request.getRequestedAmount().compareTo(request.getInvoiceAmount()) > 0) {
            throw new BadRequestException("Requested amount cannot exceed invoice amount");
        }
        
        if (request.getMinAcceptAmount().compareTo(request.getRequestedAmount()) > 0) {
            throw new BadRequestException("Minimum accept amount cannot exceed requested amount");
        }
        
        Invoice invoice = Invoice.builder()
                .borrowerUser(currentUser)
                .type(request.getType())
                .invoiceNumber(request.getInvoiceNumber())
                .buyerName(request.getBuyerName())
                .buyerGstin(request.getBuyerGstin())
                .invoiceDate(request.getInvoiceDate())
                .dueDate(request.getDueDate())
                .invoiceAmount(request.getInvoiceAmount())
                .requestedAmount(request.getRequestedAmount())
                .minAcceptAmount(request.getMinAcceptAmount())
                .expectedInterestRate(request.getExpectedInterestRate())
                .totalAmount(request.getInvoiceAmount()) // Set total amount to invoice amount
                .currency(request.getCurrency())
                .location(request.getLocation())
                .status(FinancingRequestStatus.DRAFT)
                .build();
        
        invoice = invoiceRepository.save(invoice);
        
        log.info("Created financing request with ID: {} for user: {}", invoice.getId(), currentUser.getId());
        return mapToInvoiceResponse(invoice);
    }
    
    public List<InvoiceResponse> getMyInvoices() {
        User currentUser = userService.getCurrentUser();
        
        if (currentUser.isBorrower()) {
            // Borrowers see their own invoices
            List<Invoice> invoices = invoiceRepository.findByBorrowerUserOrderByCreatedAtDesc(currentUser);
            return invoices.stream()
                    .map(this::mapToInvoiceResponse)
                    .collect(Collectors.toList());
        } else if (currentUser.isLender()) {
            // Lenders see the marketplace (all open invoices)
            return getMarketplaceInvoices(null, null, null, null);
        } else {
            throw new BadRequestException("Access denied: User must be either a borrower or lender");
        }
    }
    
    public List<InvoiceResponse> getBorrowerInvoices(Long borrowerId) {
        User borrower = userService.getUserById(borrowerId);
        
        // Check if current user has permission to view this borrower's invoices
        User currentUser = userService.getCurrentUser();
        if (!currentUser.isLender() && !currentUser.isAdmin() && 
            !currentUser.getId().equals(borrowerId)) {
            throw new BadRequestException("Access denied to view this borrower's invoices");
        }
        
        List<Invoice> invoices = invoiceRepository.findByBorrowerUserOrderByCreatedAtDesc(borrower);
        
        return invoices.stream()
                .map(this::mapToInvoiceResponse)
                .collect(Collectors.toList());
    }
    
    public InvoiceResponse getInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
        
        // Invoice details are fully transparent for marketplace visibility
        // Any authenticated user can view invoice details and download PDFs
        
        return mapToInvoiceResponse(invoice);
    }
    
    @Transactional
    public InvoiceResponse updateInvoice(Long id, CreateFinancingRequestForm request) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
        
        User currentUser = userService.getCurrentUser();
        
        if (!invoice.getBorrowerUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You can only update your own invoices");
        }
        
        if (!FinancingRequestStatus.DRAFT.equals(invoice.getStatus())) {
            throw new BadRequestException("Can only update draft invoices");
        }
        
        // Update fields
        invoice.setType(request.getType());
        invoice.setInvoiceNumber(request.getInvoiceNumber());
        invoice.setBuyerName(request.getBuyerName());
        invoice.setBuyerGstin(request.getBuyerGstin());
        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setDueDate(request.getDueDate());
        invoice.setInvoiceAmount(request.getInvoiceAmount());
        invoice.setRequestedAmount(request.getRequestedAmount());
        invoice.setMinAcceptAmount(request.getMinAcceptAmount());
        invoice.setExpectedInterestRate(request.getExpectedInterestRate());
        invoice.setTotalAmount(request.getInvoiceAmount()); // Update total amount
        invoice.setCurrency(request.getCurrency());
        invoice.setLocation(request.getLocation());
        
        invoice = invoiceRepository.save(invoice);
        
        log.info("Updated invoice with ID: {}", invoice.getId());
        return mapToInvoiceResponse(invoice);
    }
    
    @Transactional
    public InvoiceResponse listInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
        
        User currentUser = userService.getCurrentUser();
        
        if (!invoice.getBorrowerUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You can only list your own invoices");
        }
        
        if (!FinancingRequestStatus.DRAFT.equals(invoice.getStatus())) {
            throw new BadRequestException("Invoice is already listed or processed");
        }
        
        invoice.setStatus(FinancingRequestStatus.OPEN);
        invoice = invoiceRepository.save(invoice);
        
        log.info("Listed invoice with ID: {} in marketplace", invoice.getId());
        return mapToInvoiceResponse(invoice);
    }
    
    public List<InvoiceResponse> getMarketplaceInvoices(
            BigDecimal minAmount, BigDecimal maxAmount, String buyerGstin, String search) {
        
        // Marketplace is now fully public - any authenticated user can browse
        // This allows full transparency for lenders to discover opportunities
        
        List<Invoice> invoices = invoiceRepository.findOpenInvoicesWithFilters(
                FinancingRequestStatus.OPEN, minAmount, maxAmount, buyerGstin, search);
        
        return invoices.stream()
                .map(this::mapToInvoiceResponse)
                .collect(Collectors.toList());
    }
    
    private InvoiceResponse mapToInvoiceResponse(Invoice invoice) {
        // Get document download URL if document exists
        String documentDownloadUrl = null;
        if (invoice.getDocument() != null) {
            try {
                documentDownloadUrl = documentService.getDownloadUrl(invoice.getDocument().getId()).getUrl();
            } catch (Exception e) {
                log.warn("Failed to generate download URL for document {}: {}", 
                        invoice.getDocument().getId(), e.getMessage());
            }
        }
        
        return InvoiceResponse.builder()
                .id(invoice.getId().toString())
                .borrowerUserId(invoice.getBorrowerUser().getId().toString())
                .borrowerCompanyName(invoice.getBorrowerUser().getCompanyName())
                .borrowerFullName(invoice.getBorrowerUser().getFullName())
                .type(invoice.getType())
                .invoiceNumber(invoice.getInvoiceNumber())
                .buyerName(invoice.getBuyerName())
                .buyerGstin(invoice.getBuyerGstin())
                .invoiceDate(invoice.getInvoiceDate())
                .dueDate(invoice.getDueDate())
                .invoiceAmount(invoice.getInvoiceAmount())
                .requestedAmount(invoice.getRequestedAmount())
                .minAcceptAmount(invoice.getMinAcceptAmount())
                .expectedInterestRate(invoice.getExpectedInterestRate())
                .currency(invoice.getCurrency())
                .location(invoice.getLocation())
                .documentId(invoice.getDocument() != null ? invoice.getDocument().getId().toString() : null)
                .documentDownloadUrl(documentDownloadUrl)
                .status(invoice.getStatus())
                .createdAt(invoice.getCreatedAt())
                .updatedAt(invoice.getUpdatedAt())
                .tenorDays(invoice.getTenorDays())
                .build();
    }
}



