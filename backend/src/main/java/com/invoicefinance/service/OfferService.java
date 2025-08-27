package com.invoicefinance.service;

import com.invoicefinance.dto.CreateFundingOfferForm;
import com.invoicefinance.dto.FundingOfferResponse;
import com.invoicefinance.entity.*;
import com.invoicefinance.exception.BadRequestException;
import com.invoicefinance.exception.ResourceNotFoundException;
import com.invoicefinance.repository.FundingOfferRepository;
import com.invoicefinance.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OfferService {
    
    private final FundingOfferRepository offerRepository;
    private final InvoiceRepository invoiceRepository;
    private final UserService userService;
    
    @Transactional
    public FundingOfferResponse createOffer(CreateFundingOfferForm request) {
        User currentUser = userService.getCurrentUser();
        
        if (!currentUser.isLender()) {
            throw new BadRequestException("Only lenders can create funding offers");
        }
        
        Invoice invoice = invoiceRepository.findById(Long.parseLong(request.getFinancingRequestId()))
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
        
        if (!FinancingRequestStatus.OPEN.equals(invoice.getStatus())) {
            throw new BadRequestException("Can only make offers on open invoices");
        }
        
        // Check if lender already has an active offer for this invoice
        if (offerRepository.existsByInvoiceAndLenderUser(invoice, currentUser)) {
            throw new BadRequestException("You already have an offer for this invoice");
        }
        
        // Validate offer amount
        if (request.getOfferAmount().compareTo(invoice.getMinAcceptAmount()) < 0) {
            throw new BadRequestException("Offer amount must be at least the minimum accept amount");
        }
        
        if (request.getOfferAmount().compareTo(invoice.getRequestedAmount()) > 0) {
            throw new BadRequestException("Offer amount cannot exceed requested amount");
        }
        
        FundingOffer offer = FundingOffer.builder()
                .invoice(invoice)
                .lenderUser(currentUser)
                .offerAmount(request.getOfferAmount())
                .interestRatePa(request.getInterestRatePa())
                .processingFee(request.getProcessingFee())
                .tenorDays(request.getTenorDays())
                .validUntil(request.getValidUntil())
                .notes(request.getNotes())
                .status(FundingOfferStatus.ACTIVE)
                .build();
        
        offer = offerRepository.save(offer);
        
        log.info("Created funding offer with ID: {} for invoice: {} by lender: {}", 
                offer.getId(), invoice.getId(), currentUser.getId());
        
        return mapToOfferResponse(offer);
    }
    
    public List<FundingOfferResponse> getMyOffers() {
        User currentUser = userService.getCurrentUser();
        
        if (!currentUser.isLender()) {
            throw new BadRequestException("Only lenders can view their offers");
        }
        
        List<FundingOffer> offers = offerRepository.findByLenderUserOrderByCreatedAtDesc(currentUser);
        
        return offers.stream()
                .map(this::mapToOfferResponse)
                .collect(Collectors.toList());
    }
    
    public List<FundingOfferResponse> getInvoiceOffers(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
        
        User currentUser = userService.getCurrentUser();
        
        // Access control based on user role and invoice status
        if (currentUser.isBorrower()) {
            // Borrowers can only see offers on their own invoices
            if (!invoice.getBorrowerUser().getId().equals(currentUser.getId())) {
                throw new BadRequestException("Access denied to view offers for this invoice");
            }
            // Borrowers see ALL offers on their invoice
            List<FundingOffer> offers = offerRepository.findByInvoiceAndStatusOrderByCreatedAtDesc(
                    invoice, FundingOfferStatus.ACTIVE);
            return offers.stream()
                    .map(this::mapToOfferResponse)
                    .collect(Collectors.toList());
            
        } else if (currentUser.isLender()) {
            // Lenders can view offers on OPEN invoices (for marketplace transparency)
            if (!FinancingRequestStatus.OPEN.equals(invoice.getStatus())) {
                throw new BadRequestException("Can only view offers on open invoices");
            }
            // Lenders see only their own offers on this invoice
            List<FundingOffer> offers = offerRepository.findByInvoiceAndLenderUserOrderByCreatedAtDesc(
                    invoice, currentUser);
            return offers.stream()
                    .map(this::mapToOfferResponse)
                    .collect(Collectors.toList());
            
        } else if (currentUser.isAdmin()) {
            // Admins see all offers
            List<FundingOffer> offers = offerRepository.findByInvoiceOrderByCreatedAtDesc(invoice);
            return offers.stream()
                    .map(this::mapToOfferResponse)
                    .collect(Collectors.toList());
        } else {
            throw new BadRequestException("Access denied to view offers for this invoice");
        }
    }
    
    @Transactional
    public FundingOfferResponse withdrawOffer(Long offerId) {
        FundingOffer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found"));
        
        User currentUser = userService.getCurrentUser();
        
        if (!offer.getLenderUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You can only withdraw your own offers");
        }
        
        if (!FundingOfferStatus.ACTIVE.equals(offer.getStatus())) {
            throw new BadRequestException("Can only withdraw active offers");
        }
        
        offer.setStatus(FundingOfferStatus.WITHDRAWN);
        offer = offerRepository.save(offer);
        
        log.info("Withdrawn offer with ID: {} by lender: {}", offerId, currentUser.getId());
        return mapToOfferResponse(offer);
    }
    
    @Transactional
    public void markExpiredOffers() {
        List<FundingOffer> expiredOffers = offerRepository.findExpiredOffers(LocalDateTime.now());
        
        for (FundingOffer offer : expiredOffers) {
            offer.setStatus(FundingOfferStatus.EXPIRED);
            offerRepository.save(offer);
        }
        
        if (!expiredOffers.isEmpty()) {
            log.info("Marked {} offers as expired", expiredOffers.size());
        }
    }
    
    private FundingOfferResponse mapToOfferResponse(FundingOffer offer) {
        return FundingOfferResponse.builder()
                .id(offer.getId().toString())
                .financingRequestId(offer.getInvoice().getId().toString())
                .lenderUserId(offer.getLenderUser().getId().toString())
                .offerAmount(offer.getOfferAmount())
                .interestRatePa(offer.getInterestRatePa())
                .processingFee(offer.getProcessingFee())
                .tenorDays(offer.getTenorDays())
                .validUntil(offer.getValidUntil())
                .notes(offer.getNotes())
                .status(offer.getStatus())
                .createdAt(offer.getCreatedAt())
                .updatedAt(offer.getUpdatedAt())
                .build();
    }
}





