package com.invoicefinance.repository;

import com.invoicefinance.entity.Document;
import com.invoicefinance.entity.DocumentType;
import com.invoicefinance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    List<Document> findByOwnerUserOrderByCreatedAtDesc(User ownerUser);
    
    List<Document> findByOwnerUserAndTypeOrderByCreatedAtDesc(User ownerUser, DocumentType type);
    
    Optional<Document> findByS3Key(String s3Key);
    
    boolean existsByS3Key(String s3Key);
}








