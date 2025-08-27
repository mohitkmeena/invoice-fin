package com.invoicefinance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactInfo {
    private String fullName;
    private String companyName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String website;
    private String gstin;
    private String pan;
    
    // KYC verification status
    private boolean kycVerified;
    private String kycStatus;
}




