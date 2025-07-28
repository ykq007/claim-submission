import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Check, Edit2, Save, X, Receipt } from 'lucide-react';
import { ExtractedData } from '../types/claim';

interface ExpenseDataReviewProps {
  extractedData: ExtractedData;
  onDataUpdate: (updatedData: ExtractedData) => void;
  onSubmit: (finalData: ExtractedData) => void;
  isSubmitting?: boolean;
}

export const ExpenseDataReview: React.FC<ExpenseDataReviewProps> = ({
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

  const SelectField = ({ 
    label, 
    name, 
    options, 
    required = false 
  }: { 
    label: string; 
    name: keyof ExtractedData; 
    options: { value: string; label: string }[];
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
          <select
            {...field}
            disabled={!isEditing}
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
              !isEditing ? 'bg-gray-50' : 'bg-white'
            }`}
            value={field.value || ''}
          >
            <option value="">Select...</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

  const CheckboxField = ({ 
    label, 
    name 
  }: { 
    label: string; 
    name: keyof ExtractedData; 
  }) => (
    <div className="flex items-center">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type="checkbox"
            disabled={!isEditing}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            checked={field.value || false}
          />
        )}
      />
      <label className="ml-2 block text-sm text-gray-700">
        {label}
      </label>
    </div>
  );

  const expenseTypeOptions = [
    { value: 'meal', label: 'Meal & Entertainment' },
    { value: 'transport', label: 'Transportation' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'entertainment', label: 'Client Entertainment' },
    { value: 'supplies', label: 'Office Supplies' },
    { value: 'fuel', label: 'Fuel' },
    { value: 'other', label: 'Other' }
  ];

  const transportModeOptions = [
    { value: 'car', label: 'Personal Car' },
    { value: 'taxi', label: 'Taxi' },
    { value: 'train', label: 'Train' },
    { value: 'flight', label: 'Flight' },
    { value: 'bus', label: 'Bus' },
    { value: 'other', label: 'Other' }
  ];

  const mealTypeOptions = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' }
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Receipt className="w-6 h-6 text-primary-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Review Expense Data</h3>
          </div>
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
          {/* Basic Expense Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Expense Details</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField label="Receipt Number" name="receiptNumber" />
              <InputField label="Expense Date" name="expenseDate" type="date" required />
              <InputField label="Amount" name="expenseAmount" type="number" required />
              <InputField label="Currency" name="currency" />
              <SelectField label="Expense Type" name="expenseType" options={expenseTypeOptions} required />
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="description"
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
            </div>
          </div>

          {/* Vendor Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Vendor Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField label="Vendor Name" name="vendorName" required />
              <InputField label="Vendor Phone" name="vendorPhone" />
              <div className="sm:col-span-2">
                <InputField label="Vendor Address" name="vendorAddress" />
              </div>
              <InputField label="Tax ID" name="vendorTaxId" />
            </div>
          </div>

          {/* Employee & Business Context */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Business Context</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField label="Employee Name" name="employeeName" required />
              <InputField label="Employee ID" name="employeeId" />
              <InputField label="Department" name="department" />
              <InputField label="Cost Center" name="costCenter" />
              <InputField label="Client Name" name="clientName" />
              <InputField label="Project Code" name="projectCode" />
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Purpose
                </label>
                <Controller
                  name="purpose"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={2}
                      disabled={!isEditing}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                        !isEditing ? 'bg-gray-50' : 'bg-white'
                      }`}
                      value={field.value || ''}
                      placeholder="Describe the business purpose of this expense..."
                    />
                  )}
                />
              </div>
              <div className="sm:col-span-2 space-y-3">
                <CheckboxField label="Client Reimbursable" name="isClientReimbursable" />
                <CheckboxField label="Tax Deductible" name="isTaxDeductible" />
              </div>
            </div>
          </div>

          {/* Tax Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Tax Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <InputField label="Tax Amount" name="taxAmount" type="number" />
              <InputField label="Tax Rate (%)" name="taxRate" type="number" />
              <InputField label="Tax Type" name="taxType" />
            </div>
          </div>

          {/* Travel Details (conditional) */}
          {(watchedData.expenseType === 'transport' || watchedData.expenseType === 'fuel') && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Travel Details</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <NestedInputField label="Origin" parentKey="travelDetails" childKey="origin" />
                <NestedInputField label="Destination" parentKey="travelDetails" childKey="destination" />
                <NestedInputField label="Distance (km)" parentKey="travelDetails" childKey="distance" type="number" />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Transport Mode</label>
                  <Controller
                    name="travelDetails.transportMode"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        disabled={!isEditing}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                          !isEditing ? 'bg-gray-50' : 'bg-white'
                        }`}
                        value={field.value || ''}
                      >
                        <option value="">Select...</option>
                        {transportModeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
                <NestedInputField label="Mileage Rate" parentKey="travelDetails" childKey="mileageRate" type="number" />
              </div>
            </div>
          )}

          {/* Meal Details (conditional) */}
          {watchedData.expenseType === 'meal' && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Meal Details</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <NestedInputField label="Number of Attendees" parentKey="mealDetails" childKey="attendeeCount" type="number" />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Meal Type</label>
                  <Controller
                    name="mealDetails.mealType"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        disabled={!isEditing}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                          !isEditing ? 'bg-gray-50' : 'bg-white'
                        }`}
                        value={field.value || ''}
                      >
                        <option value="">Select...</option>
                        {mealTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
                <div className="sm:col-span-2">
                  <div className="flex items-center">
                    <Controller
                      name="mealDetails.isClientMeal"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="checkbox"
                          disabled={!isEditing}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={field.value || false}
                        />
                      )}
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Client Meal
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  Submit Expense Claim
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};