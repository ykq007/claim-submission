import axios from 'axios';
import { N8nResponse, ClaimDocument } from '../types/claim';

const N8N_API_URL = process.env.VITE_N8N_API_URL || 'http://localhost:5678/webhook';

export class N8nService {
  private static instance: N8nService;

  static getInstance(): N8nService {
    if (!N8nService.instance) {
      N8nService.instance = new N8nService();
    }
    return N8nService.instance;
  }

  async processDocument(document: ClaimDocument): Promise<N8nResponse> {
    try {
      const formData = new FormData();
      formData.append('file', document.file);
      formData.append('documentType', document.type);
      formData.append('documentId', document.id);

      const response = await axios.post(`${N8N_API_URL}/process-claim-document`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutes timeout for document processing
        onUploadProgress: (progressEvent) => {
          // This will be handled by the calling component
        }
      });

      return response.data;
    } catch (error) {
      console.error('N8n processing error:', error);
      throw new Error(
        axios.isAxiosError(error) 
          ? `Processing failed: ${error.response?.data?.message || error.message}`
          : 'Unknown processing error'
      );
    }
  }

  async submitClaim(claimData: any): Promise<{ success: boolean; claimId?: string; error?: string }> {
    try {
      const response = await axios.post(`${N8N_API_URL}/submit-claim`, claimData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      return response.data;
    } catch (error) {
      console.error('Claim submission error:', error);
      throw new Error(
        axios.isAxiosError(error)
          ? `Submission failed: ${error.response?.data?.message || error.message}`
          : 'Unknown submission error'
      );
    }
  }
}