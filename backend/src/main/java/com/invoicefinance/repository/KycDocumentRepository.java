package com.invoicefinance.repository;

import com.invoicefinance.entity.KycDocument;
import com.invoicefinance.entity.KycStatus;
import com.invoicefinance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KycDocumentRepository extends JpaRepository<KycDocument, Long> {
    
    Optional<KycDocument> findByUser(User user);
    
    List<KycDocument> findByStatus(KycStatus status);
    
    @Query("SELECT COUNT(k) FROM KycDocument k WHERE k.status = :status")
    long countByStatus(@Param("status") KycStatus status);
    
    boolean existsByUser(User user);
}








