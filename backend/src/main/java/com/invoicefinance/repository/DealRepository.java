package com.invoicefinance.repository;

import com.invoicefinance.entity.Deal;
import com.invoicefinance.entity.DealStatus;
import com.invoicefinance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {
    
    List<Deal> findByBorrowerUserOrderByCreatedAtDesc(User borrowerUser);
    
    List<Deal> findByLenderUserOrderByCreatedAtDesc(User lenderUser);
    
    @Query("SELECT d FROM Deal d WHERE (d.borrowerUser = :user OR d.lenderUser = :user) ORDER BY d.createdAt DESC")
    List<Deal> findByUser(@Param("user") User user);
    
    @Query("SELECT d FROM Deal d WHERE (d.borrowerUser = :user OR d.lenderUser = :user) AND d.status = :status ORDER BY d.createdAt DESC")
    List<Deal> findByUserAndStatus(@Param("user") User user, @Param("status") DealStatus status);
    
    @Query("SELECT COUNT(d) FROM Deal d WHERE d.borrowerUser = :user")
    long countByBorrowerUser(@Param("user") User user);
    
    @Query("SELECT COUNT(d) FROM Deal d WHERE d.lenderUser = :user")
    long countByLenderUser(@Param("user") User user);
    
    @Query("SELECT COUNT(d) FROM Deal d WHERE d.borrowerUser = :user AND d.status = :status")
    long countByBorrowerUserAndStatus(@Param("user") User user, @Param("status") DealStatus status);
    
    @Query("SELECT COUNT(d) FROM Deal d WHERE d.lenderUser = :user AND d.status = :status")
    long countByLenderUserAndStatus(@Param("user") User user, @Param("status") DealStatus status);
}








