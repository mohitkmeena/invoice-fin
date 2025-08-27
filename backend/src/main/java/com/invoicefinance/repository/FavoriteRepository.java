package com.invoicefinance.repository;

import com.invoicefinance.entity.Favorite;
import com.invoicefinance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    
    List<Favorite> findByUserOrderByCreatedAtDesc(User user);
    
    Optional<Favorite> findByUserAndInvoice(User user, com.invoicefinance.entity.Invoice invoice);
    
    boolean existsByUserAndInvoice(User user, com.invoicefinance.entity.Invoice invoice);
    
    @Query("SELECT f FROM Favorite f JOIN FETCH f.invoice WHERE f.user = :user ORDER BY f.createdAt DESC")
    List<Favorite> findByUserWithInvoice(@Param("user") User user);
}

