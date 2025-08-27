package com.invoicefinance.service;

import com.invoicefinance.entity.Favorite;
import com.invoicefinance.entity.Invoice;
import com.invoicefinance.entity.User;
import com.invoicefinance.exception.BadRequestException;
import com.invoicefinance.exception.ResourceNotFoundException;
import com.invoicefinance.repository.FavoriteRepository;
import com.invoicefinance.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FavoriteService {
    
    private final FavoriteRepository favoriteRepository;
    private final InvoiceRepository invoiceRepository;
    private final UserService userService;
    
    @Transactional
    public Favorite addToFavorites(Long invoiceId) {
        User currentUser = userService.getCurrentUser();
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + invoiceId));
        
        // Check if already favorited
        if (favoriteRepository.existsByUserAndInvoice(currentUser, invoice)) {
            throw new BadRequestException("Invoice is already in favorites");
        }
        
        Favorite favorite = Favorite.builder()
                .user(currentUser)
                .invoice(invoice)
                .build();
        
        return favoriteRepository.save(favorite);
    }
    
    @Transactional
    public void removeFromFavorites(Long invoiceId) {
        User currentUser = userService.getCurrentUser();
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + invoiceId));
        
        Favorite favorite = favoriteRepository.findByUserAndInvoice(currentUser, invoice)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found"));
        
        favoriteRepository.delete(favorite);
    }
    
    @Transactional(readOnly = true)
    public List<Favorite> getUserFavorites() {
        User currentUser = userService.getCurrentUser();
        return favoriteRepository.findByUserWithInvoice(currentUser);
    }
    
    @Transactional(readOnly = true)
    public boolean isFavorited(Long invoiceId) {
        User currentUser = userService.getCurrentUser();
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + invoiceId));
        
        return favoriteRepository.existsByUserAndInvoice(currentUser, invoice);
    }
}

