package com.invoicefinance.dto;

import com.invoicefinance.entity.ContactVisibility;
import com.invoicefinance.entity.DealStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DealResponse {
    private String id;
    private String financingRequestId;
    private String lenderUserId;
    private String borrowerUserId;
    private String selectedOfferId;
    private DealStatus status;
    private ContactVisibility contactVisibility;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Nested objects for convenience
    private InvoiceResponse invoice;
    private FundingOfferResponse selectedOffer;
    private UserResponse lender;
    private UserResponse borrower;
    
    // Contact information (unlocked after both parties complete KYC)
    private boolean contactsUnlocked;
    private ContactInfo lenderContact;
    private ContactInfo borrowerContact;
}




