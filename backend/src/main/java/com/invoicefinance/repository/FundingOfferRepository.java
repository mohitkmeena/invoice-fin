package com.invoicefinance.repository;

import com.invoicefinance.entity.FundingOffer;
import com.invoicefinance.entity.FundingOfferStatus;
import com.invoicefinance.entity.Invoice;
import com.invoicefinance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FundingOfferRepository extends JpaRepository<FundingOffer, Long> {
    
    List<FundingOffer> findByLenderUserOrderByCreatedAtDesc(User lenderUser);
    
    List<FundingOffer> findByInvoiceOrderByCreatedAtDesc(Invoice invoice);
    
    List<FundingOffer> findByInvoiceAndStatusOrderByCreatedAtDesc(Invoice invoice, FundingOfferStatus status);
    
    List<FundingOffer> findByInvoiceAndLenderUserOrderByCreatedAtDesc(Invoice invoice, User lenderUser);
    
    @Query("SELECT fo FROM FundingOffer fo WHERE fo.status = 'ACTIVE' AND fo.validUntil < :now")
    List<FundingOffer> findExpiredOffers(@Param("now") LocalDateTime now);
    
    @Query("SELECT COUNT(fo) FROM FundingOffer fo WHERE fo.lenderUser = :user")
    long countByLenderUser(@Param("user") User user);
    
    @Query("SELECT COUNT(fo) FROM FundingOffer fo WHERE fo.lenderUser = :user AND fo.status = :status")
    long countByLenderUserAndStatus(@Param("user") User user, @Param("status") FundingOfferStatus status);
    
    boolean existsByInvoiceAndLenderUser(Invoice invoice, User lenderUser);
}





