package com.invoicefinance.dto;

import com.invoicefinance.entity.InvoiceType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateFinancingRequestForm {
    @NotNull(message = "Type is required")
    private InvoiceType type;
    
    @NotBlank(message = "Invoice number is required")
    @Size(max = 100)
    private String invoiceNumber;
    
    @NotBlank(message = "Buyer name is required")
    @Size(max = 255)
    private String buyerName;
    
    @Size(max = 15)
    private String buyerGstin;
    
    @NotNull(message = "Invoice date is required")
    private LocalDate invoiceDate;
    
    @NotNull(message = "Due date is required")
    private LocalDate dueDate;
    
    @NotNull(message = "Invoice amount is required")
    @DecimalMin(value = "0.01", message = "Invoice amount must be positive")
    private BigDecimal invoiceAmount;
    
    @NotNull(message = "Requested amount is required")
    @DecimalMin(value = "0.01", message = "Requested amount must be positive")
    private BigDecimal requestedAmount;
    
    @NotNull(message = "Minimum accept amount is required")
    @DecimalMin(value = "0.01", message = "Minimum accept amount must be positive")
    private BigDecimal minAcceptAmount;
    
    @NotNull(message = "Expected interest rate is required")
    @DecimalMin(value = "0.01", message = "Expected interest rate must be positive")
    private BigDecimal expectedInterestRate;
    
    @NotBlank(message = "Currency is required")
    @Size(max = 3)
    private String currency = "INR";
    
    @Size(max = 255)
    private String location;
}




