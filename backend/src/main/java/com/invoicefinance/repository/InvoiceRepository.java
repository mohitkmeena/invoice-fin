package com.invoicefinance.repository;

import com.invoicefinance.entity.FinancingRequestStatus;
import com.invoicefinance.entity.Invoice;
import com.invoicefinance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
    List<Invoice> findByBorrowerUserOrderByCreatedAtDesc(User borrowerUser);
    
    List<Invoice> findByStatusOrderByCreatedAtDesc(FinancingRequestStatus status);
    
    @Query("SELECT i FROM Invoice i WHERE i.status = :status " +
           "AND (:minAmount IS NULL OR i.invoiceAmount >= :minAmount) " +
           "AND (:maxAmount IS NULL OR i.invoiceAmount <= :maxAmount) " +
           "AND (:buyerGstin IS NULL OR i.buyerGstin = :buyerGstin) " +
           "AND (:search IS NULL OR LOWER(i.buyerName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "    OR LOWER(i.invoiceNumber) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY i.createdAt DESC")
    List<Invoice> findOpenInvoicesWithFilters(
            @Param("status") FinancingRequestStatus status,
            @Param("minAmount") BigDecimal minAmount,
            @Param("maxAmount") BigDecimal maxAmount,
            @Param("buyerGstin") String buyerGstin,
            @Param("search") String search
    );
    
    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.borrowerUser = :user")
    long countByBorrowerUser(@Param("user") User user);
    
    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.borrowerUser = :user AND i.status = :status")
    long countByBorrowerUserAndStatus(@Param("user") User user, @Param("status") FinancingRequestStatus status);
}




