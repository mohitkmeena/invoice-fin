-- Add profile and KYC fields to users table
-- Migration: V3__Add_profile_kyc_fields.sql

-- Add KYC status column
ALTER TABLE users ADD COLUMN kyc_status ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- Add KYC document URL column
ALTER TABLE users ADD COLUMN kyc_document_url VARCHAR(500);

-- Add KYC submission timestamp
ALTER TABLE users ADD COLUMN kyc_submitted_at TIMESTAMP NULL;

-- Add KYC approval timestamp
ALTER TABLE users ADD COLUMN kyc_approved_at TIMESTAMP NULL;

-- Add KYC rejection timestamp
ALTER TABLE users ADD COLUMN kyc_rejected_at TIMESTAMP NULL;

-- Add KYC rejection reason
ALTER TABLE users ADD COLUMN kyc_rejection_reason TEXT;

-- Add profile image URL
ALTER TABLE users ADD COLUMN profile_image_url VARCHAR(500);

-- Add indexes for better performance
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_users_kyc_submitted_at ON users(kyc_submitted_at);
