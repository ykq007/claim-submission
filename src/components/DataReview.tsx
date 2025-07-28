import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Check, Edit2, Save, X } from 'lucide-react';
import { ExtractedData } from '../types/claim';

interface DataReviewProps {
  extractedData: ExtractedData;
  onDataUpdate: (updatedData: ExtractedData) => void;
  onSubmit: (finalData: ExtractedData) => void;
  isSubmitting?: boolean;
}

export const DataReview: React.FC<DataReviewProps> = ({
  extractedData,
  onDataUpdate,
  onSubmit,
  isSubmitting = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { control, handleSubmit, watch, reset } = useForm<ExtractedData>({
    defaultValues: extractedData
  });

  const watchedData = watch();

  useEffect(() => {
    onDataUpdate(watchedData);
  }, [watchedData, onDataUpdate]);

  const onSave = (data: ExtractedData) => {
    setIsEditing(false);
    onDataUpdate(data);
  };

  const onCancel = () => {
    reset(extractedData);
    setIsEditing(false);
  };

  const InputField = ({ 
    label, 
    name, 
    type = 'text', 
    required = false 
  }: { 
    label: string; 
    name: keyof ExtractedData; 
    type?: string; 
    required?: boolean 
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type={type}
            disabled={!isEditing}
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
              !isEditing ? 'bg-gray-50' : 'bg-white'
            }`}
            value={field.value || ''}
          />
        )}
      />
    </div>
  );

  const NestedInputField = ({ 
    label, 
    parentKey, 
    childKey, 
    type = 'text' 
  }: { 
    label: string; 
    parentKey: keyof ExtractedData; 
    childKey: string; 
    type?: string 
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Controller
        name={`${parentKey}.${childKey}` as any}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type={type}
            disabled={!isEditing}
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
              !isEditing ? 'bg-gray-50' : 'bg-white'
            }`}
            value={field.value || ''}
          />
        )}
      />
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Review Extracted Data</h3>
          <div className="flex items-center space-x-2">
            {extractedData.confidence && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                extractedData.confidence > 0.8 
                  ? 'bg-green-100 text-green-800' 
                  : extractedData.confidence > 0.6 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {Math.round(extractedData.confidence * 100)}% Confidence
              </span>
            )}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSubmit(onSave)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={onCancel}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField label="Claim Number" name="claimNumber" required />
              <InputField label="Policy Number" name="policyNumber" required />
              <InputField label="Claimant Name" name="claimantName" required />
              <InputField label="Claimant ID" name="claimantId" />
              <InputField label="Date of Incident" name="dateOfIncident" type="date" required />
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incident Description <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="incidentDescription"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={3}
                      disabled={!isEditing}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                        !isEditing ? 'bg-gray-50' : 'bg-white'
                      }`}
                      value={field.value || ''}
                    />
                  )}
                />
              </div>
              <InputField label="Claim Amount" name="claimAmount" type="number" required />
              <InputField label="Currency" name="currency" />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <NestedInputField label="Email" parentKey="contactInfo" childKey="email" type="email" />
              <NestedInputField label="Phone" parentKey="contactInfo" childKey="phone" type="tel" />
              <div className="sm:col-span-2">
                <NestedInputField label="Address" parentKey="contactInfo" childKey="address" />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Medical Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <NestedInputField label="Doctor Name" parentKey="medicalInfo" childKey="doctorName" />
              <NestedInputField label="Hospital Name" parentKey="medicalInfo" childKey="hospitalName" />
              <NestedInputField label="Diagnosis" parentKey="medicalInfo" childKey="diagnosis" />
              <NestedInputField label="Treatment Date" parentKey="medicalInfo" childKey="treatmentDate" type="date" />
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Vehicle Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <NestedInputField label="Make" parentKey="vehicleInfo" childKey="make" />
              <NestedInputField label="Model" parentKey="vehicleInfo" childKey="model" />
              <NestedInputField label="Year" parentKey="vehicleInfo" childKey="year" type="number" />
              <NestedInputField label="License Plate" parentKey="vehicleInfo" childKey="licensePlate" />
              <div className="sm:col-span-2">
                <NestedInputField label="Damage Description" parentKey="vehicleInfo" childKey="damageDescription" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || isEditing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Submit Claim
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};