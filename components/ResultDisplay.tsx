import React from 'react';
import { Loader } from './Loader';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Watermark } from './Watermark';

interface ResultDisplayProps {
  files: File[];
  imageUrl: string | null;
  videoUrl: string | null;
  isAnimating: boolean;
  countdown: number;
  isWatermarked: boolean;
  onEdit: () => void;
  onTryAnother: () => void;
  onImageClick: (url: string) => void;
  onSaveToMemories: () => void;
  onSponsor: () => void;
  onRemoveWatermark: () => void;
  onAnimateClick: () => void; // New prop to open the animate modal
}

const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6a1 1 0 10-2 0v5.586L7.707 10.293zM3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" /></svg>;
const RedoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm12 1a1 1 0 011 1v3a1 1 0 11-2 0V6.101a5.002 5.002 0 00-9.424 4.39A1 1 0 113.177 11.5A7.002 7.002 0 0116 3z" clipRule="evenodd" /></svg>;
const MemoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v1H5V4zM5 7h10v9a2 2 0 01-2 2H7a2 2 0 01-2-2V7z" /><path d="M15 12a1 1 0 10-2 0v2a1 1 0 102 0v-2z" /></svg>;
const SponsorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const WatermarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const AnimateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>

const ActionButton: React.FC<{ onClick?: () => void; href?: string; download?: boolean; children: React.ReactNode, title: string }> = ({ onClick, href, download, children, title }) => {
    const { theme } = useTheme();
    const commonClasses = `flex-1 flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${theme.buttonSecondary} ${theme.textPrimary} hover:border-pink-400 border border-transparent`;
    const content = <>
        {children}
        <span className="text-xs mt-1">{title}</span>
    </>;

    if (href) {
        return <a href={href} download={download} title={title} className={commonClasses}>{content}</a>;
    }
    return <button onClick={onClick} title={title} className={commonClasses}>{content}</button>;
};

const BeforeAfterView: React.FC<{ beforeFile: File; afterUrl: string; onAfterClick: () => void; isWatermarked: boolean }> = ({ beforeFile, afterUrl, onAfterClick, isWatermarked }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const beforeUrl = URL.createObjectURL(beforeFile);

    React.useEffect(() => {
        return () => URL.revokeObjectURL(beforeUrl);
    }, [beforeUrl]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Before */}
            <div className="text-center">
                <h4 className={`mb-2 font-semibold ${theme.textSecondary}`}>{t('results.before')}</h4>
                <div className="relative">
                    <img src={beforeUrl} alt={t('results.beforeAlt')} className="w-full max-h-[50vh] object-contain rounded-lg shadow-md" />
                </div>
            </div>
            {/* After */}
            <div className="text-center">
                <h4 className={`mb-2 font-semibold ${theme.textSecondary}`}>{t('results.after')}</h4>
                 <div onClick={onAfterClick} className="cursor-zoom-in relative">
                    <img src={afterUrl} alt={t('results.alt')} className="w-full max-h-[50vh] object-contain rounded-lg shadow-lg" />
                    {isWatermarked && <Watermark />}
                </div>
            </div>
        </div>
    );
};

export const ResultDisplay: React.FC<ResultDisplayProps> = (props) => {
  const { files, imageUrl, videoUrl, isAnimating, countdown, isWatermarked, onEdit, onTryAnother, onImageClick, onSaveToMemories, onSponsor, onRemoveWatermark, onAnimateClick } = props;
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const animatingMessages = t('loader.videoMessages', { returnObjects: true });

  const renderContent = () => {
    if (isAnimating) {
        return <Loader messages={animatingMessages} countdown={countdown} />;
    }
    if (videoUrl) {
        return <video src={videoUrl} controls autoPlay loop className="w-full max-h-[60vh] object-contain rounded-lg shadow-lg" />;
    }
    if (imageUrl && files.length > 0) {
        return (
          <BeforeAfterView
            beforeFile={files[0]}
            afterUrl={imageUrl}
            onAfterClick={() => onImageClick(imageUrl)}
            isWatermarked={isWatermarked}
          />
        );
    }
    if (imageUrl) {
        return (
          <div onClick={() => onImageClick(imageUrl)} className="cursor-zoom-in relative">
            <img src={imageUrl} alt={t('results.alt')} className="w-full max-h-[60vh] object-contain rounded-lg shadow-lg" />
            {isWatermarked && <Watermark />}
          </div>
        );
    }
    return <div className={`h-64 flex items-center justify-center ${theme.textSecondary}`}>{t('results.imagePlaceholder')}</div>;
  }

  return (
    <div className="w-full">
      <div className={`${theme.panelBg} p-4 rounded-lg`}>
        <h3 className={`text-center font-bold mb-4 ${theme.textPrimary}`}>{t('results.header')}</h3>
        
        <div className="min-h-[400px] flex items-center justify-center mb-4">
            {renderContent()}
        </div>

        {imageUrl && !isAnimating && (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                  <ActionButton href={imageUrl} download title={t('results.actions.save')}><SaveIcon /></ActionButton>
                  {isAuthenticated && <ActionButton onClick={onSaveToMemories} title={t('results.actions.saveToMemories')}><MemoryIcon /></ActionButton>}
                  <ActionButton onClick={onAnimateClick} title={t('results.actions.animate')}><AnimateIcon /></ActionButton>
                  <ActionButton onClick={onEdit} title={t('results.actions.edit')}><EditIcon /></ActionButton>
                  {isAuthenticated && isWatermarked && <ActionButton onClick={onSponsor} title={t('results.actions.sponsor')}><SponsorIcon /></ActionButton>}
                  {isAuthenticated && isWatermarked && <ActionButton onClick={onRemoveWatermark} title={t('results.actions.removeWatermark')}><WatermarkIcon /></ActionButton>}
                  <ActionButton onClick={onTryAnother} title={t('results.actions.tryAnother')}><RedoIcon /></ActionButton>
              </div>
            </>
        )}
      </div>
    </div>
  );
};