package com.invoicefinance.service;

import com.invoicefinance.dto.ContactInfo;
import com.invoicefinance.dto.DealResponse;
import com.invoicefinance.dto.UserResponse;
import com.invoicefinance.entity.*;
import com.invoicefinance.exception.BadRequestException;
import com.invoicefinance.exception.ResourceNotFoundException;
import com.invoicefinance.repository.DealRepository;
import com.invoicefinance.repository.FundingOfferRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DealService {
    
    private final DealRepository dealRepository;
    private final FundingOfferRepository offerRepository;
    private final UserService userService;
    private final InvoiceService invoiceService;
    private final KycService kycService;
    
    @Transactional
    public DealResponse acceptOffer(Long offerId) {
        FundingOffer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found"));
        
        User currentUser = userService.getCurrentUser();
        
        // Only the borrower who owns the invoice can accept offers
        if (!offer.getInvoice().getBorrowerUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You can only accept offers on your own invoices");
        }
        
        if (!FundingOfferStatus.ACTIVE.equals(offer.getStatus())) {
            throw new BadRequestException("Can only accept active offers");
        }
        
        if (!offer.isActive()) {
            throw new BadRequestException("Offer has expired");
        }
        
        // Mark offer as accepted
        offer.setStatus(FundingOfferStatus.ACCEPTED);
        offerRepository.save(offer);
        
        // Update invoice status
        Invoice invoice = offer.getInvoice();
        invoice.setStatus(FinancingRequestStatus.OFFER_ACCEPTED);
        
        // Create deal
        Deal deal = Deal.builder()
                .invoice(invoice)
                .lenderUser(offer.getLenderUser())
                .borrowerUser(currentUser)
                .selectedOffer(offer)
                .status(DealStatus.KYC_PENDING)
                .contactVisibility(ContactVisibility.MASKED)
                .build();
        
        deal = dealRepository.save(deal);
        
        // Mark other offers for this invoice as rejected
        List<FundingOffer> otherOffers = offerRepository.findByInvoiceAndStatusOrderByCreatedAtDesc(
                invoice, FundingOfferStatus.ACTIVE);
        
        for (FundingOffer otherOffer : otherOffers) {
            if (!otherOffer.getId().equals(offerId)) {
                otherOffer.setStatus(FundingOfferStatus.REJECTED);
                offerRepository.save(otherOffer);
            }
        }
        
        log.info("Created deal with ID: {} for offer: {} between borrower: {} and lender: {}", 
                deal.getId(), offerId, currentUser.getId(), offer.getLenderUser().getId());
        
        return mapToDealResponse(deal);
    }
    
    public List<DealResponse> getMyDeals() {
        User currentUser = userService.getCurrentUser();
        
        List<Deal> deals = dealRepository.findByUser(currentUser);
        
        return deals.stream()
                .map(this::mapToDealResponse)
                .collect(Collectors.toList());
    }
    
    public DealResponse getDeal(Long dealId) {
        Deal deal = dealRepository.findById(dealId)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found"));
        
        User currentUser = userService.getCurrentUser();
        
        // Only parties involved in the deal can view it
        if (!deal.getBorrowerUser().getId().equals(currentUser.getId()) && 
            !deal.getLenderUser().getId().equals(currentUser.getId()) && 
            !currentUser.isAdmin()) {
            throw new BadRequestException("Access denied to view this deal");
        }
        
        return mapToDealResponse(deal);
    }
    
    public Map<String, UserResponse> getDealContacts(Long dealId) {
        Deal deal = dealRepository.findById(dealId)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found"));
        
        User currentUser = userService.getCurrentUser();
        
        // Only parties involved in the deal can view contacts
        if (!deal.getBorrowerUser().getId().equals(currentUser.getId()) && 
            !deal.getLenderUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Access denied to view contacts for this deal");
        }
        
        // Contacts are visible only if both parties are KYC verified
        if (!ContactVisibility.VISIBLE.equals(deal.getContactVisibility()) && 
            !DealStatus.KYC_VERIFIED.equals(deal.getStatus())) {
            throw new BadRequestException("Contacts are not yet visible for this deal");
        }
        
        UserResponse borrower = userService.mapToUserResponse(deal.getBorrowerUser());
        UserResponse lender = userService.mapToUserResponse(deal.getLenderUser());
        
        return Map.of(
                "borrower", borrower,
                "lender", lender
        );
    }
    
    @Transactional
    public DealResponse updateDealStatus(Long dealId, DealStatus newStatus) {
        Deal deal = dealRepository.findById(dealId)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found"));
        
        User currentUser = userService.getCurrentUser();
        
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("Only admins can update deal status");
        }
        
        DealStatus oldStatus = deal.getStatus();
        deal.setStatus(newStatus);
        
        // If moving to KYC_VERIFIED, make contacts visible
        if (DealStatus.KYC_VERIFIED.equals(newStatus)) {
            deal.setContactVisibility(ContactVisibility.VISIBLE);
        }
        
        deal = dealRepository.save(deal);
        
        log.info("Updated deal {} status from {} to {} by admin: {}", 
                dealId, oldStatus, newStatus, currentUser.getId());
        
        return mapToDealResponse(deal);
    }
    
    private DealResponse mapToDealResponse(Deal deal) {
        // Check if both parties have completed KYC
        boolean borrowerKycVerified = kycService.isUserKycVerified(deal.getBorrowerUser().getId());
        boolean lenderKycVerified = kycService.isUserKycVerified(deal.getLenderUser().getId());
        boolean contactsUnlocked = borrowerKycVerified && lenderKycVerified;
        
        // Create contact info if contacts are unlocked
        ContactInfo borrowerContact = null;
        ContactInfo lenderContact = null;
        
        if (contactsUnlocked) {
            borrowerContact = createContactInfo(deal.getBorrowerUser(), borrowerKycVerified);
            lenderContact = createContactInfo(deal.getLenderUser(), lenderKycVerified);
        }
        
        return DealResponse.builder()
                .id(deal.getId().toString())
                .financingRequestId(deal.getInvoice().getId().toString())
                .lenderUserId(deal.getLenderUser().getId().toString())
                .borrowerUserId(deal.getBorrowerUser().getId().toString())
                .selectedOfferId(deal.getSelectedOffer().getId().toString())
                .status(deal.getStatus())
                .contactVisibility(deal.getContactVisibility())
                .contactsUnlocked(contactsUnlocked)
                .borrowerContact(borrowerContact)
                .lenderContact(lenderContact)
                .createdAt(deal.getCreatedAt())
                .updatedAt(deal.getUpdatedAt())
                .build();
    }
    
    private ContactInfo createContactInfo(User user, boolean kycVerified) {
        return ContactInfo.builder()
                .fullName(user.getFullName())
                .companyName(user.getCompanyName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .city(user.getCity())
                .state(user.getState())
                .pincode(user.getPincode())
                .website(user.getWebsite())
                .gstin(user.getGstin())
                .pan(user.getPan())
                .kycVerified(kycVerified)
                .kycStatus(kycVerified ? "VERIFIED" : "PENDING")
                .build();
    }
}




