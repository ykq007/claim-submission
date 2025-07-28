import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image, X, AlertCircle } from 'lucide-react';
import { ClaimDocument } from '../types/claim';

interface FileUploadProps {
  onFilesAdded: (documents: ClaimDocument[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesAdded,
  maxFiles = 10,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png']
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<ClaimDocument[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newDocuments: ClaimDocument[] = acceptedFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      type: file.type.startsWith('image/') ? 'image' : 'pdf',
      status: 'uploading',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newDocuments]);
    onFilesAdded(newDocuments);
  }, [onFilesAdded]);

  const removeFile = (documentId: string) => {
    setUploadedFiles(prev => prev.filter(doc => doc.id !== documentId));
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: maxFiles - uploadedFiles.length,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const getFileIcon = (type: string) => {
    return type === 'image' ? <Image className="w-5 h-5" /> : <File className="w-5 h-5" />;
  };

  const getStatusColor = (status: ClaimDocument['status']) => {
    switch (status) {
      case 'uploading': return 'text-blue-600';
      case 'processing': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          {isDragActive ? 'Drop receipts here' : 'Upload expense receipts'}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Drag and drop receipts or click to browse
        </p>
        <p className="text-xs text-gray-500">
          Supports PDF, JPG, PNG receipts up to 10MB each
        </p>
      </div>

      {fileRejections.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <h3 className="text-sm font-medium text-red-800">File Upload Errors</h3>
          </div>
          <ul className="mt-2 text-sm text-red-700">
            {fileRejections.map(({ file, errors }) => (
              <li key={file.name}>
                {file.name}: {errors.map(e => e.message).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Uploaded Files</h3>
          <div className="space-y-2">
            {uploadedFiles.map((document) => (
              <div key={document.id} className="flex items-center justify-between bg-white rounded-md p-3 border">
                <div className="flex items-center space-x-3">
                  {getFileIcon(document.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{document.file.name}</p>
                    <p className={`text-xs ${getStatusColor(document.status)}`}>
                      {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                      {document.status === 'processing' && ' - Please wait...'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(document.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};