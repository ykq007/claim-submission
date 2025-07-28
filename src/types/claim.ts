export interface ClaimDocument {
  id: string;
  file: File;
  type: 'image' | 'pdf';
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  extractedData?: ExtractedData;
  error?: string;
}

export interface ExtractedData {
  // Basic Expense Information
  receiptNumber?: string;
  expenseDate?: string;
  expenseAmount?: number;
  currency?: string;
  expenseType?: 'meal' | 'transport' | 'accommodation' | 'entertainment' | 'supplies' | 'fuel' | 'other';
  description?: string;
  
  // Vendor/Merchant Information
  vendorName?: string;
  vendorAddress?: string;
  vendorPhone?: string;
  vendorTaxId?: string;
  
  // Employee Information
  employeeName?: string;
  employeeId?: string;
  department?: string;
  costCenter?: string;
  
  // Business Context
  purpose?: string;
  clientName?: string;
  projectCode?: string;
  isClientReimbursable?: boolean;
  
  // Tax Information
  taxAmount?: number;
  taxRate?: number;
  taxType?: string;
  isTaxDeductible?: boolean;
  
  // Travel/Transport Details
  travelDetails?: {
    origin?: string;
    destination?: string;
    distance?: number;
    transportMode?: 'car' | 'taxi' | 'train' | 'flight' | 'bus' | 'other';
    mileageRate?: number;
  };
  
  // Meal Details
  mealDetails?: {
    attendees?: string[];
    attendeeCount?: number;
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    isClientMeal?: boolean;
  };
  
  // Additional Information
  additionalDetails?: Record<string, any>;
  confidence?: number;
}

export interface ClaimSubmission {
  documents: ClaimDocument[];
  extractedData: ExtractedData;
  userVerified: boolean;
  submissionDate: string;
  status: 'draft' | 'reviewing' | 'submitted' | 'approved' | 'rejected';
}

export interface N8nResponse {
  success: boolean;
  extractedData?: ExtractedData;
  confidence?: number;
  error?: string;
  processedAt: string;
}