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
  claimNumber?: string;
  claimantName?: string;
  claimantId?: string;
  dateOfIncident?: string;
  incidentDescription?: string;
  claimAmount?: number;
  currency?: string;
  policyNumber?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  medicalInfo?: {
    doctorName?: string;
    hospitalName?: string;
    diagnosis?: string;
    treatmentDate?: string;
  };
  vehicleInfo?: {
    make?: string;
    model?: string;
    year?: number;
    licensePlate?: string;
    damageDescription?: string;
  };
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