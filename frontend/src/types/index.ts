// User and Authentication Types
export interface User {
  id: number | string; // Support both for compatibility
  email: string;
  phone: string;
  roles: UserRole[];
  status: UserStatus;
  fullName?: string;
  companyName?: string;
  gstin?: string;
  pan?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  website?: string;
  sector?: string;
  creditScore?: number;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export type UserRole = 'BORROWER' | 'LENDER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'KYC_PENDING' | 'KYC_VERIFIED';

// Profile Types
export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  dob?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  contactVisibility: ContactVisibility;
}

export interface ProfileData {
  id: number;
  email: string;
  phone: string;
  fullName: string;
  companyName: string;
  gstin: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  website: string;
  sector: string;
  creditScore: number;
  roles: UserRole[];
  status: UserStatus;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  kycStatus: KYCStatus;
  kycDocumentUrl: string;
  kycSubmittedAt: string;
  kycApprovedAt: string;
  kycRejectedAt: string;
  kycRejectionReason: string;
  profileImageUrl: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  companyName: string;
  gstin: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  website: string;
  sector: string;
}

export interface KycStatusUpdateRequest {
  kycStatus: KYCStatus;
  rejectionReason?: string;
}

export type ContactVisibility = 'MASKED' | 'VISIBLE';

// Company Types
export interface Company {
  id: string;
  userId: string;
  legalName: string;
  brandName?: string;
  cin?: string;
  gstin?: string;
  pan?: string;
  incorporationDate?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  website?: string;
  sector?: string;
  revenueRange?: string;
  creditScore?: number;
}

// KYC Types
export interface KYCRequest {
  id: string;
  userId: string;
  aadhaarNumber?: string;
  panNumber?: string;
  aadhaarImageS3Key?: string;
  panImageS3Key?: string;
  status: KYCStatus;
  providerRef?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export type KYCStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

// Document Types
export interface Document {
  id: number | string;
  ownerUserId: number | string;
  type: DocumentType;
  s3Key: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  visibility: DocumentVisibility;
  createdAt: string;
}

export type DocumentType = 'INVOICE' | 'PURCHASE_ORDER' | 'KYC_AADHAAR' | 'KYC_PAN' | 'AGREEMENT' | 'OTHER';
export type DocumentVisibility = 'PRIVATE' | 'LENDER_MATCHED' | 'COUNTERPARTY';

// Invoice Types (matches backend InvoiceResponse)
export interface Invoice {
  id: number | string;
  borrowerUserId: number | string;
  borrowerCompanyName?: string;
  borrowerFullName?: string;
  type: 'INVOICE' | 'PURCHASE_ORDER' | 'TRADE' | 'SERVICE' | 'MIXED';
  invoiceNumber: string;
  buyerName: string;
  buyerGstin?: string;
  invoiceDate: string;
  dueDate: string;
  invoiceAmount: number;
  requestedAmount: number;
  minAcceptAmount: number;
  expectedInterestRate: number;
  currency: string;
  location?: string;
  documentId?: number | string;
  documentDownloadUrl?: string;
  status: FinancingRequestStatus;
  createdAt: string;
  updatedAt: string;
  tenorDays?: number;
}

// Alias for backward compatibility
export interface FinancingRequest extends Invoice {}

export type FinancingRequestStatus = 
  | 'DRAFT' 
  | 'PENDING'
  | 'LISTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'FUNDED'
  | 'EXPIRED';

// Lender Preference Types
export interface LenderPreference {
  id: string;
  lenderUserId: string;
  sectorsAllowed: string[];
  minAmount: number;
  maxAmount: number;
  maxTenorDays: number;
  rateRangeMin: number;
  rateRangeMax: number;
  minCreditScore?: number;
  statesAllowed: string[];
}

// Funding Offer Types
export interface FundingOffer {
  id: number | string;
  invoiceId: number | string;
  lenderUserId: number | string;
  offerAmount: number;
  interestRatePa: number;
  processingFee: number;
  tenorDays: number;
  validUntil: string;
  notes?: string;
  status: FundingOfferStatus;
  createdAt: string;
  updatedAt: string;
}

export type FundingOfferStatus = 'ACTIVE' | 'WITHDRAWN' | 'EXPIRED' | 'ACCEPTED' | 'REJECTED';

// Match Types
export interface Match {
  id: string;
  financingRequestId: string;
  lenderUserId: string;
  score: number;
  reason?: string;
  createdAt: string;
}

// Deal Types
export interface Deal {
  id: number | string;
  invoiceId: number | string;
  lenderUserId: number | string;
  borrowerUserId: number | string;
  selectedOfferId: number | string;
  status: DealStatus;
  contactVisibility: ContactVisibility;
  createdAt: string;
  updatedAt: string;
}

export type DealStatus = 
  | 'KYC_PENDING' 
  | 'KYC_VERIFIED' 
  | 'AGREEMENT_SIGNED' 
  | 'DISBURSEMENT' 
  | 'ACTIVE' 
  | 'OVERDUE' 
  | 'SETTLED' 
  | 'CANCELLED';

// Repayment Types
export interface Repayment {
  id: string;
  dealId: string;
  dueDate: string;
  principalDue: number;
  interestDue: number;
  totalDue: number;
  paidAmount?: number;
  paidDate?: string;
  status: RepaymentStatus;
}

export type RepaymentStatus = 'DUE' | 'PARTIAL' | 'PAID' | 'LATE';

// Audit Log Types
export interface AuditLog {
  id: string;
  actorUserId: string;
  entityType: string;
  entityId: string;
  action: string;
  payloadJson: string;
  createdAt: string;
  ip?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  roles: UserRole[];
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Form Types
export interface CreateFinancingRequestForm {
  type: 'INVOICE' | 'PURCHASE_ORDER' | 'TRADE' | 'SERVICE' | 'MIXED';
  invoiceNumber: string;
  buyerName: string;
  buyerGstin?: string;
  invoiceDate: string;
  dueDate: string;
  invoiceAmount: number;
  requestedAmount: number;
  minAcceptAmount: number;
  expectedInterestRate: number;
  currency: string;
  location?: string;
}

export interface CreateFundingOfferForm {
  invoiceId: number | string;
  offerAmount: number;
  interestRatePa: number;
  processingFee: number;
  tenorDays: number;
  validUntil: string;
  notes?: string;
}

export interface KYCForm {
  aadhaarNumber: string;
  panNumber: string;
}

// Dashboard Types
export interface DashboardStats {
  totalFinancingRequests: number;
  activeDeals: number;
  totalAmountFinanced: number;
  pendingKYC: number;
  overdueRepayments: number;
}

export interface ChartData {
  name: string;
  value: number;
}