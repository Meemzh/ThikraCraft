import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import { useCommunity } from '../contexts/CommunityContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderSpotlightProps {
  onClick: (sceneId: string) => void;
}

const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2.5a.75.75 0 01.75.75V5a.75.75 0 01-1.5 0V3.25a.75.75 0 01.75-.75zM7.5 7.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM12.5 7.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM11.94 2.94a.75.75 0 011.06 0l.94.94a.75.75 0 010 1.06l-.94.94a.75.75 0 01-1.06 0l-.94-.94a.75.75 0 010-1.06l.94-.94z" />
    </svg>
);

const SpotlightItem: React.FC<{scene: any, user: any, t: any, theme: any, onClick: any}> = ({ scene, user, t, theme, onClick }) => {
    const isCreatorViewing = user && scene.creator === `@${user.name}`;
    return (
        <button
            onClick={() => onClick(scene.id)}
            className="flex items-center justify-center gap-2 h-10 w-full"
        >
            <SparkleIcon />
            {isCreatorViewing ? (
                <span className={`text-xs font-bold ${theme.textAccent}`}>
                    {t('spotlight.header.yourSceneTitle')}
                </span>
            ) : (
                <>
                    <span className={`text-xs font-semibold ${theme.textSecondary}`}>
                        {t('spotlight.header.title')}
                    </span>
                    <span className={`text-xs font-bold ${theme.textAccent}`}>
                        {scene.creator}
                    </span>
                </>
            )}
        </button>
    );
};

export const HeaderSpotlight: React.FC<HeaderSpotlightProps> = ({ onClick }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { spotlightScenes } = useCommunity();
    const { user } = useAuth();

    if (!spotlightScenes || spotlightScenes.length === 0) {
        return null;
    }

    // Duplicate the scenes to create a seamless looping effect
    const duplicatedScenes = [...spotlightScenes, ...spotlightScenes];

    return (
        <div className={`w-full max-w-sm mx-auto h-10 overflow-hidden relative ${theme.panelBg} border ${theme.borderColor} rounded-full mt-4`}>
            <div className="absolute top-0 left-0 w-full animate-ticker-y hover:pause-animation" style={{ animationDuration: `${spotlightScenes.length * 3}s` }}>
                {duplicatedScenes.map((scene, index) => (
                    <SpotlightItem key={`${scene.id}-${index}`} scene={scene} user={user} t={t} theme={theme} onClick={onClick} />
                ))}
            </div>
        </div>
    );
};