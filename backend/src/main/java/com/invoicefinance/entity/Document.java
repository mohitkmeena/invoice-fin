package com.invoicefinance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_user_id", nullable = false)
    private User ownerUser;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType type;
    
    @NotBlank
    @Column(name = "s3_key", nullable = false)
    private String s3Key;
    
    @NotBlank
    @Column(name = "original_filename", nullable = false)
    private String originalFilename;
    
    @NotBlank
    @Column(name = "mime_type", nullable = false)
    private String mimeType;
    
    @Positive
    @Column(name = "size_bytes", nullable = false)
    private Long sizeBytes;
    
    @NotBlank
    @Column(name = "sha256", nullable = false)
    private String sha256;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DocumentVisibility visibility = DocumentVisibility.PRIVATE;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}









