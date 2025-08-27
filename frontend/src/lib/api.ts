import axios, { AxiosInstance } from 'axios';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  roles: string[];
  status: string;
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
  kycStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  kycDocumentUrl?: string;
  kycSubmittedAt?: string;
  kycApprovedAt?: string;
  kycRejectedAt?: string;
  kycRejectionReason?: string;
  profileImageUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  roles: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Invoice {
  id: string;
  borrowerUserId: string;
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
  documentId?: string;
  documentDownloadUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  tenorDays?: number;
}

export interface CreateInvoiceRequest {
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

class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.api.post('/auth/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.api.post('/auth/login', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // User management
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.api.get('/users/me');
    return response.data;
  }

  async updateProfile(data: any): Promise<ApiResponse<User>> {
    const response = await this.api.put('/users/profile', data);
    return response.data;
  }

  async uploadKycDocument(documentUrl: string): Promise<ApiResponse<User>> {
    const response = await this.api.post('/users/kyc/upload', null, {
      params: { documentUrl }
    });
    return response.data;
  }



  // Invoice management
  async createInvoice(data: CreateInvoiceRequest): Promise<ApiResponse<Invoice>> {
    const response = await this.api.post('/invoices', data);
    return response.data;
  }

  async getMyInvoices(): Promise<ApiResponse<Invoice[]>> {
    const response = await this.api.get('/invoices/mine');
    return response.data;
  }

  async getInvoice(id: string): Promise<ApiResponse<Invoice>> {
    const response = await this.api.get(`/invoices/${id}`);
    return response.data;
  }

  async updateInvoice(id: string, data: Partial<CreateInvoiceRequest>): Promise<ApiResponse<Invoice>> {
    const response = await this.api.put(`/invoices/${id}`, data);
    return response.data;
  }

  async listInvoice(id: string): Promise<ApiResponse<Invoice>> {
    const response = await this.api.post(`/invoices/${id}/list`);
    return response.data;
  }

  // Marketplace - get all open invoices (transparent for lenders)
  async getMarketplaceInvoices(filters?: {
    minAmount?: number;
    maxAmount?: number;
    buyerGstin?: string;
    search?: string;
  }): Promise<ApiResponse<Invoice[]>> {
    const params = new URLSearchParams();
    if (filters?.minAmount) params.append('minAmount', filters.minAmount.toString());
    if (filters?.maxAmount) params.append('maxAmount', filters.maxAmount.toString());
    if (filters?.buyerGstin) params.append('buyerGstin', filters.buyerGstin);
    if (filters?.search) params.append('search', filters.search);
    
    const response = await this.api.get(`/invoices?${params.toString()}`);
    return response.data;
  }

  async getBorrowerInvoices(borrowerId: string): Promise<ApiResponse<Invoice[]>> {
    const response = await this.api.get(`/invoices/borrower/${borrowerId}`);
    return response.data;
  }

  // Offers management
  async createOffer(data: {
    financingRequestId: string;
    offerAmount: number;
    interestRatePa: number;
    processingFee: number;
    tenorDays: number;
    validUntil: string; // ISO string format
    notes?: string;
  }): Promise<ApiResponse<any>> {
    const response = await this.api.post('/offers', data);
    return response.data;
  }

  async getInvoiceOffers(invoiceId: string): Promise<ApiResponse<any[]>> {
    const response = await this.api.get(`/offers/invoice/${invoiceId}`);
    return response.data;
  }

  async acceptOffer(offerId: string): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/offers/${offerId}/accept`);
    return response.data;
  }

  async getMyOffers(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/offers/mine');
    return response.data;
  }

  async getMyDeals(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/deals/mine');
    return response.data;
  }

  async getDeal(dealId: string): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/deals/${dealId}`);
    return response.data;
  }

  // Favorites management
  async addToFavorites(invoiceId: string): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/favorites/${invoiceId}`);
    return response.data;
  }

  async removeFromFavorites(invoiceId: string): Promise<ApiResponse<any>> {
    const response = await this.api.delete(`/favorites/${invoiceId}`);
    return response.data;
  }

    async getMyFavorites(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/favorites/mine');
    return response.data;
  }



  // Profile management
  async getProfile(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/users/profile');
    return response.data;
  }

  async updateProfile(data: {
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
  }): Promise<ApiResponse<any>> {
    const response = await this.api.put('/users/profile', data);
    return response.data;
  }



  // Admin KYC management
  async updateKycStatus(userId: string, data: {
    kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
    rejectionReason?: string;
  }): Promise<ApiResponse<any>> {
    const response = await this.api.put(`/admin/users/${userId}/kyc-status`, data);
    return response.data;
  }
}

export const api = new ApiClient();