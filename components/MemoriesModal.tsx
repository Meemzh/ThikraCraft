import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import { useMemories } from '../contexts/MemoriesContext';
import { useCommunity } from '../contexts/CommunityContext';
import { Watermark } from './Watermark';

interface MemoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoriesModal: React.FC<MemoriesModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { memories } = useMemories();
  const { spotlightScenes } = useCommunity();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className={`${theme.panelBg} rounded-2xl shadow-xl max-w-4xl w-full border ${theme.borderColor} flex flex-col h-[90vh]`}>
        <div className={`p-6 border-b ${theme.borderColor}`}>
          <h2 className={`text-2xl font-bold ${theme.textPrimary}`}>{t('memories.title')}</h2>
        </div>
        <div className="p-6 flex-grow overflow-y-auto">
          {memories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {memories.map(memory => {
                const sponsoredVersion = spotlightScenes.find(s => s.imageUrl === memory.imageUrl);
                const showWatermark = !sponsoredVersion || !sponsoredVersion.isWatermarkRemoved;

                return (
                  <div key={memory.id} className="aspect-square rounded-lg overflow-hidden group relative">
                    <img src={memory.imageUrl} alt="Saved memory" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    {showWatermark && <Watermark />}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className={`${theme.textSecondary}`}>{t('memories.empty')}</p>
            </div>
          )}
        </div>
        <div className={`p-4 ${theme.inputBg} bg-opacity-50 rounded-b-2xl flex justify-end`}>
          <button onClick={onClose} className={`px-4 py-2 rounded-lg ${theme.buttonPrimary} text-white font-semibold transition-colors`}>{t('memories.close')}</button>
        </div>
      </div>
    </div>
  );
};