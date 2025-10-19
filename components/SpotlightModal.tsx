import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import { SpotlightScene } from '../contexts/CommunityContext';
import { useAuth } from '../contexts/AuthContext';

interface SpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene: SpotlightScene | null;
  onLike: (sceneId: string) => void;
  isLiked: boolean;
  onRemoveWatermark: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
}

const LikeIcon = ({ filled }: { filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${filled ? 'text-pink-500' : ''}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);

const PrevIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const NextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;


export const SpotlightModal: React.FC<SpotlightModalProps> = ({ isOpen, onClose, scene, onLike, isLiked, onRemoveWatermark, onNavigate }) => {
  const { theme } = useTheme();
  const { t, dir } = useTranslation();
  const { user } = useAuth();
  
  if (!isOpen || !scene) return null;

  const isCreator = user && scene.creator === `@${user.name}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`${theme.panelBg} rounded-2xl shadow-xl max-w-lg w-full border ${theme.borderColor} flex flex-col max-h-[90vh]`} onClick={e => e.stopPropagation()}>
        <div className={`p-4 border-b ${theme.borderColor}`}>
          <h2 className={`text-xl font-bold ${theme.textPrimary}`}>{t('spotlight.modal.title')}</h2>
        </div>
        <div className="p-4 flex-grow overflow-y-auto">
            <img src={scene.imageUrl} alt={`Scene by ${scene.creator}`} className="w-full rounded-lg" />
            <p className={`mt-4 text-sm ${theme.textSecondary}`}>{t('spotlight.modal.body', { handle: scene.creator })}</p>
        </div>
        <div className={`p-4 ${theme.inputBg} bg-opacity-50 rounded-b-2xl flex justify-between items-center flex-wrap gap-2`}>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onLike(scene.id)}
                    disabled={isLiked || isCreator}
                    title={isCreator ? t('spotlight.modal.cannotLikeOwnScene') : ''}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${theme.buttonSecondary}`}>
                    <LikeIcon filled={isLiked} />
                    <span className="font-bold">{scene.likes}</span>
                </button>
                 {!scene.isWatermarkRemoved && (
                    <button onClick={onRemoveWatermark} className={`text-xs underline ${theme.textAccent} hover:text-pink-500`}>
                        {t('spotlight.modal.instantOption')}
                    </button>
                )}
            </div>
            <div className="flex items-center gap-2">
                 <button onClick={() => onNavigate('prev')} className={`p-2 rounded-lg ${theme.buttonSecondary}`}><PrevIcon /></button>
                 <button onClick={() => onNavigate('next')} className={`p-2 rounded-lg ${theme.buttonSecondary}`}><NextIcon /></button>
                 <button onClick={onClose} className={`px-4 py-2 rounded-lg ${theme.buttonPrimary} text-white font-semibold`}>{t('spotlight.modal.close')}</button>
            </div>
        </div>
      </div>
    </div>
  );
};