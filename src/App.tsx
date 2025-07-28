import React, { useState, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FileUpload } from './components/FileUpload';
import { DataReview } from './components/DataReview';
import { ClaimDocument, ExtractedData } from './types/claim';
import { N8nService } from './services/n8nService';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';

function App() {
  const [documents, setDocuments] = useState<ClaimDocument[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'review' | 'submitted'>('upload');

  const n8nService = N8nService.getInstance();

  const handleFilesAdded = useCallback(async (newDocuments: ClaimDocument[]) => {
    setDocuments(prev => [...prev, ...newDocuments]);
    
    // Process each document
    for (const doc of newDocuments) {
      try {
        setIsProcessing(true);
        
        // Update document status to processing
        setDocuments(prev => 
          prev.map(d => d.id === doc.id ? { ...d, status: 'processing' } : d)
        );

        const result = await n8nService.processDocument(doc);
        
        if (result.success && result.extractedData) {
          // Update document with extracted data
          setDocuments(prev => 
            prev.map(d => d.id === doc.id ? { 
              ...d, 
              status: 'completed', 
              extractedData: result.extractedData 
            } : d)
          );

          // Merge extracted data from all documents
          setExtractedData(prevData => ({
            ...prevData,
            ...result.extractedData,
            confidence: result.confidence
          }));

          toast.success(`Document processed successfully`);
        } else {
          throw new Error(result.error || 'Processing failed');
        }
      } catch (error) {
        console.error('Processing error:', error);
        
        setDocuments(prev => 
          prev.map(d => d.id === doc.id ? { 
            ...d, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error'
          } : d)
        );

        toast.error(`Failed to process ${doc.file.name}`);
      }
    }
    
    setIsProcessing(false);
    
    // If we have extracted data, move to review step
    if (extractedData) {
      setCurrentStep('review');
    }
  }, [extractedData, n8nService]);

  const handleDataUpdate = useCallback((updatedData: ExtractedData) => {
    setExtractedData(updatedData);
  }, []);

  const handleSubmitClaim = useCallback(async (finalData: ExtractedData) => {
    try {
      setIsSubmitting(true);
      
      const claimSubmissionData = {
        documents: documents.map(doc => ({
          id: doc.id,
          fileName: doc.file.name,
          type: doc.type,
          extractedData: doc.extractedData
        })),
        extractedData: finalData,
        submissionDate: new Date().toISOString(),
        userVerified: true
      };

      const result = await n8nService.submitClaim(claimSubmissionData);
      
      if (result.success) {
        toast.success('Claim submitted successfully!');
        setCurrentStep('submitted');
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit claim');
    } finally {
      setIsSubmitting(false);
    }
  }, [documents, n8nService]);

  const getStepStatus = (step: string) => {
    if (currentStep === step) return 'current';
    if (
      (step === 'upload' && (currentStep === 'review' || currentStep === 'submitted')) ||
      (step === 'review' && currentStep === 'submitted')
    ) return 'complete';
    return 'upcoming';
  };

  const resetForm = () => {
    setDocuments([]);
    setExtractedData(null);
    setCurrentStep('upload');
    setIsProcessing(false);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Claim Submission System</h1>
            <p className="mt-2 text-sm text-gray-600">
              Upload your documents and submit your insurance claim
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {[
              { id: 'upload', name: 'Upload Documents', icon: FileText },
              { id: 'review', name: 'Review & Edit', icon: AlertCircle },
              { id: 'submitted', name: 'Submit Claim', icon: CheckCircle }
            ].map((step, stepIdx) => {
              const status = getStepStatus(step.id);
              const Icon = step.icon;
              
              return (
                <li key={step.name} className={`${stepIdx !== 2 ? 'pr-8 sm:pr-20' : ''} relative`}>
                  <div className="flex items-center">
                    <div className={`
                      flex h-10 w-10 items-center justify-center rounded-full border-2 
                      ${status === 'complete' 
                        ? 'border-primary-600 bg-primary-600' 
                        : status === 'current'
                          ? 'border-primary-600 bg-white'
                          : 'border-gray-300 bg-white'
                      }
                    `}>
                      <Icon className={`
                        h-5 w-5 
                        ${status === 'complete' 
                          ? 'text-white' 
                          : status === 'current'
                            ? 'text-primary-600'
                            : 'text-gray-400'
                        }
                      `} />
                    </div>
                    <div className="ml-4 min-w-0">
                      <p className={`
                        text-sm font-medium 
                        ${status === 'complete' || status === 'current' 
                          ? 'text-gray-900' 
                          : 'text-gray-500'
                        }
                      `}>
                        {step.name}
                      </p>
                    </div>
                  </div>
                  {stepIdx !== 2 && (
                    <div className={`
                      absolute top-5 right-0 -translate-y-1/2 h-0.5 w-full 
                      ${status === 'complete' ? 'bg-primary-600' : 'bg-gray-300'}
                    `} />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {currentStep === 'upload' && (
          <div className="space-y-6">
            <FileUpload 
              onFilesAdded={handleFilesAdded}
              maxFiles={5}
            />
            
            {isProcessing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                  <p className="text-blue-800">Processing documents with AI...</p>
                </div>
              </div>
            )}

            {extractedData && !isProcessing && (
              <div className="flex justify-center">
                <button
                  onClick={() => setCurrentStep('review')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Review Extracted Data
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 'review' && extractedData && (
          <DataReview
            extractedData={extractedData}
            onDataUpdate={handleDataUpdate}
            onSubmit={handleSubmitClaim}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === 'submitted' && (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Claim Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your claim has been submitted and is now being processed. You will receive updates via email.
            </p>
            <button
              onClick={resetForm}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Submit Another Claim
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;