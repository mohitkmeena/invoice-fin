package com.invoicefinance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    
    @NotBlank(message = "Full name is required")
    @Size(max = 255, message = "Full name must be less than 255 characters")
    private String fullName;
    
    @Size(max = 255, message = "Company name must be less than 255 characters")
    private String companyName;
    
    @Size(max = 15, message = "GSTIN must be less than 15 characters")
    private String gstin;
    
    @Size(max = 10, message = "PAN must be less than 10 characters")
    private String pan;
    
    @Size(max = 500, message = "Address must be less than 500 characters")
    private String address;
    
    @Size(max = 100, message = "City must be less than 100 characters")
    private String city;
    
    @Size(max = 100, message = "State must be less than 100 characters")
    private String state;
    
    @Size(max = 10, message = "Pincode must be less than 10 characters")
    private String pincode;
    
    @Size(max = 255, message = "Website must be less than 255 characters")
    private String website;
    
    @Size(max = 100, message = "Sector must be less than 100 characters")
    private String sector;
}


