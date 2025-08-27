package com.invoicefinance.controller;

import com.invoicefinance.dto.ApiResponse;
import com.invoicefinance.entity.Favorite;
import com.invoicefinance.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {
    
    private final FavoriteService favoriteService;
    
    @PostMapping("/{invoiceId}")
    public ResponseEntity<ApiResponse<Favorite>> addToFavorites(@PathVariable Long invoiceId) {
        Favorite favorite = favoriteService.addToFavorites(invoiceId);
        return ResponseEntity.ok(ApiResponse.success("Added to favorites successfully", favorite));
    }
    
    @DeleteMapping("/{invoiceId}")
    public ResponseEntity<ApiResponse<Void>> removeFromFavorites(@PathVariable Long invoiceId) {
        favoriteService.removeFromFavorites(invoiceId);
        return ResponseEntity.ok(ApiResponse.success("Removed from favorites successfully", null));
    }
    
    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<Favorite>>> getMyFavorites() {
        List<Favorite> favorites = favoriteService.getUserFavorites();
        return ResponseEntity.ok(ApiResponse.success("Favorites retrieved successfully", favorites));
    }
    
    @GetMapping("/{invoiceId}/check")
    public ResponseEntity<ApiResponse<Boolean>> checkIfFavorited(@PathVariable Long invoiceId) {
        boolean isFavorited = favoriteService.isFavorited(invoiceId);
        return ResponseEntity.ok(ApiResponse.success("Favorite status checked successfully", isFavorited));
    }
}

