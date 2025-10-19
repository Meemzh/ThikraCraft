import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface ImageUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ files, onFilesChange, maxFiles = 5 }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [showExplainer, setShowExplainer] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      if (files.length + newFiles.length > maxFiles) {
        alert(t('uploader.maxFilesError'));
        return;
      }
      onFilesChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <label htmlFor="file-upload" className={`relative cursor-pointer flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg ${theme.inputBg} ${theme.borderColor} ${theme.accentBorderHover} transition-colors`}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon />
          <p className={`mb-2 text-sm ${theme.textSecondary}`}>
            <span className={`font-semibold ${theme.textAccent}`}>{t('uploader.buttons.addPhoto')}</span>
          </p>
          <p className="text-xs text-gray-500">{t('uploader.emptyState')}</p>
        </div>
        <input id="file-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>

       <div className="mt-4 text-center">
            <div className="relative inline-block">
                <button 
                    onMouseEnter={() => setShowExplainer(true)}
                    onMouseLeave={() => setShowExplainer(false)}
                    className={`flex items-center text-xs ${theme.textSecondary} cursor-pointer`}>
                    <InfoIcon />
                    <span className="ml-1 underline">{t('uploader.faceLock.title')}</span>
                </button>
                {showExplainer && (
                    <div className={`absolute bottom-full mb-2 w-48 p-2 text-xs ${theme.panelBg} ${theme.textPrimary} rounded-md shadow-lg z-10 border ${theme.borderColor}`}>
                        {t('uploader.faceLock.explainer')}
                    </div>
                )}
            </div>
            <p className={`text-xs mt-1 ${theme.textSecondary}`}>{t('uploader.tip')}</p>
        </div>


      {files.length > 0 && (
        <div className="mt-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {files.map((file, index) => (
                    <div key={index} className="relative group">
                    <img src={URL.createObjectURL(file)} alt={`preview ${index}`} className="w-full h-24 object-cover rounded-lg"/>
                    <button onClick={() => removeFile(index)} className="absolute top-0 right-0 m-1 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        X
                    </button>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};