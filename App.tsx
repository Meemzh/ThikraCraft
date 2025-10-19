import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { POSE_CATEGORIES, THEME_CATEGORIES, AI_PARTNER_TYPE_OPTIONS, AI_CHILD_GENDER_OPTIONS } from './constants';
import { AiGenerationMode, AiPartnerType, AiChildGender, AiPartnerEthnicity, ThemeConfig, PoseOption, ThemeOption } from './types';
import { generateCompositeImage, animateImage } from './services/geminiService';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { useTheme } from './contexts/ThemeContext';
import { useTranslation } from './contexts/LanguageContext';
import { AboutUsModal } from './components/AboutUsModal';
import { SceneSelector } from './components/SceneSelector';
import { FullscreenViewer } from './components/FullscreenViewer';
import { CreatorModal } from './components/CreatorModal';
import { useAuth } from './contexts/AuthContext';
import { useCredits } from './contexts/CreditsContext';
import { useMemories } from './contexts/MemoriesContext';
import { AuthModal } from './components/AuthModal';
import { EarnCreditsModal } from './components/EarnCreditsModal';
import { MemoriesModal } from './components/MemoriesModal';
import { Toast } from './components/Toast';
import { useCommunity, SpotlightScene } from './contexts/CommunityContext';
import { SpotlightModal } from './components/SpotlightModal';
import { SponsorModal } from './components/SponsorModal';
import { RemoveWatermarkModal } from './components/RemoveWatermarkModal';
import { EditModal } from './components/EditModal';
import { AnimateModal } from './components/AnimateModal';
import { ProfileModal } from './components/ProfileModal';
import { VerificationBanner } from './components/VerificationBanner';


const getAllOptions = <T extends { options: any[] }>(categories: T[]): any[] => {
    return categories.flatMap(category => category.options);
};

const allPoseOptions: PoseOption[] = getAllOptions(POSE_CATEGORIES);
const allThemeOptions: ThemeOption[] = getAllOptions(THEME_CATEGORIES);
const allOptions = [...allPoseOptions, ...allThemeOptions];

const SPONSOR_COST = 50;
const REMOVE_WATERMARK_COST = 100;

export default function App() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { isAuthenticated, user, isEmailVerified } = useAuth();
    const { balance, deductCredits, getDailyBonus } = useCredits();
    const { addMemory } = useMemories();
    const { likeScene, likedSceneIds, addSceneToSpotlight, spotlightScenes, removeWatermarkFromScene } = useCommunity();

    // Core State
    const [files, setFiles] = useState<File[]>([]);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
    const [isWatermarked, setIsWatermarked] = useState<boolean>(true);

    const [themeConfig, setThemeConfig] = useState<ThemeConfig>({});
    const [customPrompt, setCustomPrompt] = useState('');

    // Single Person Mode State
    const [aiGenerationMode, setAiGenerationMode] = useState<AiGenerationMode | null>(null);
    const [aiPartnerType, setAiPartnerType] = useState<AiPartnerType>('Partner');
    const [aiChildGender, setAiChildGender] = useState<AiChildGender>('Son');
    const [aiPartnerEthnicity, setAiPartnerEthnicity] = useState<AiPartnerEthnicity>('Auto-detect');

    // Modals & Policy State
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
    const [isCreatorModalOpen, setIsCreatorModalOpen] = useState<boolean>(false);
    const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState<boolean>(false);
    const [generateActionQueued, setGenerateActionQueued] = useState(false);
    const [lastThemePrompt, setLastThemePrompt] = useState<string>('');
    const [fullscreenImageUrl, setFullscreenImageUrl] = useState<string | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
    const [isEarnCreditsModalOpen, setIsEarnCreditsModalOpen] = useState<boolean>(false);
    const [isMemoriesModalOpen, setIsMemoriesModalOpen] = useState<boolean>(false);
    const [isSpotlightModalOpen, setIsSpotlightModalOpen] = useState<boolean>(false);
    const [currentSpotlightScene, setCurrentSpotlightScene] = useState<SpotlightScene | null>(null);
    const [selectedSpotlightIndex, setSelectedSpotlightIndex] = useState<number | null>(null);
    const [isSponsorModalOpen, setIsSponsorModalOpen] = useState<boolean>(false);
    const [isRemoveWatermarkModalOpen, setIsRemoveWatermarkModalOpen] = useState<boolean>(false);
    const [sceneForWatermarkRemoval, setSceneForWatermarkRemoval] = useState<SpotlightScene | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isAnimateModalOpen, setIsAnimateModalOpen] = useState<boolean>(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
    
    // Toast State
    const [toastMessage, setToastMessage] = useState<string>('');
    
    // Video Countdown State
    const [countdown, setCountdown] = useState<number>(90);
    const countdownIntervalRef = useRef<number | null>(null);
    
    // Private milestone notification
    const prevSpotlightScenesRef = useRef<SpotlightScene[]>([]);
    useEffect(() => {
        if (user) {
            spotlightScenes.forEach(currentScene => {
                const prevScene = prevSpotlightScenesRef.current.find(p => p.id === currentScene.id);
                if (prevScene && !prevScene.isWatermarkRemoved && currentScene.isWatermarkRemoved) {
                     if (`@${user.name}` === currentScene.creator) {
                        setToastMessage(t('spotlight.modal.milestone'));
                    }
                }
            });
        }
        prevSpotlightScenesRef.current = spotlightScenes;
    }, [spotlightScenes, user, t]);

    useEffect(() => {
        if (localStorage.getItem('privacyAccepted') === 'true') {
            setHasAcceptedPrivacy(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated && getDailyBonus()) {
            setToastMessage(t('credits.dailyBonusToast', { count: 5 }));
        }
    }, [isAuthenticated, getDailyBonus, t]);

    useEffect(() => {
        if (generateActionQueued && hasAcceptedPrivacy) {
            setGenerateActionQueued(false);
            startGenerationProcess();
        }
    }, [generateActionQueued, hasAcceptedPrivacy]);

    const startCountdown = (duration: number) => {
        setCountdown(duration);
        countdownIntervalRef.current = window.setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        return () => { if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current); };
    }, []);

    const getFriendlyErrorMessage = useCallback((error: unknown): string => {
        if (error instanceof Error) {
            const errorMessage = error.message.toLowerCase();
            if (errorMessage.includes('quota') || errorMessage.includes('resource_exhausted')) {
                return t('errors.quotaExceeded');
            }
            if (errorMessage.includes('video generation failed')) {
                return t('errors.videoFailed');
            }
            if (errorMessage.includes('rate limit')) return t('errors.rateLimit');
            if (errorMessage.includes('safety')) return t('errors.contentPolicy');
        }
        return t('errors.generic');
    }, [t]);
    
    const buildPrompt = (): string | null => {
        if (customPrompt) return customPrompt;

        const getFragmentsFromConfig = () => Object.values(themeConfig)
            .map(optionId => allOptions.find(o => o.id === optionId)?.promptFragment)
            .filter((f): f is string => !!f);

        if (files.length > 1) {
            const fragments = getFragmentsFromConfig();
            if (fragments.length === 0) { // Surprise me case for multi-person
                const randomPose = allPoseOptions[Math.floor(Math.random() * allPoseOptions.length)];
                const randomTheme = allThemeOptions[Math.floor(Math.random() * allThemeOptions.length)];
                if (!randomPose || !randomTheme) {
                    setError(t('errors.generic'));
                    return null;
                }
                return `${randomPose.promptFragment}, ${randomTheme.promptFragment}.`;
            }
            return fragments.join(', ') + '.';
        }

        if (files.length === 1) {
             const themeFragments = getFragmentsFromConfig();

            if (!isCustomizing) { // Fully random for single person
                const randomTheme = allThemeOptions[Math.floor(Math.random() * allThemeOptions.length)];
                const themeFragment = randomTheme ? randomTheme.promptFragment : 'a beautiful scene';
                
                const possibleOutcomes = ['solo', 'partner', 'child'];
                const randomOutcome = possibleOutcomes[Math.floor(Math.random() * possibleOutcomes.length)];

                if (randomOutcome === 'solo') {
                    const soloPoses = POSE_CATEGORIES.find(p => p.id === 'solo')?.options || [];
                    const pose = soloPoses[Math.floor(Math.random() * soloPoses.length)];
                    return `A solo person in ${pose?.promptFragment || 'a confident pose'}, ${themeFragment}.`;
                }
                
                let prompt = `A single person is in the photo. `;
                let pose;
                if (randomOutcome === 'partner') {
                    const randomPartnerType = AI_PARTNER_TYPE_OPTIONS[Math.floor(Math.random() * AI_PARTNER_TYPE_OPTIONS.length)].value;
                    prompt += `Generate an AI-generated ${randomPartnerType} for them. The partner should have features that are a plausible and aesthetically complementary blend to the original person. `;
                    const couplePoses = POSE_CATEGORIES.find(p => p.id === 'couples')?.options || [];
                    pose = couplePoses[Math.floor(Math.random() * couplePoses.length)];
                } else { // child
                    const randomChildGender = AI_CHILD_GENDER_OPTIONS[Math.floor(Math.random() * AI_CHILD_GENDER_OPTIONS.length)].value;
                    prompt += `Generate an AI-generated ${randomChildGender} for them. The child should appear to be a plausible genetic blend of the person in the photo. `;
                    const familyPoses = POSE_CATEGORIES.find(p => p.id === 'family')?.options || [];
                    pose = familyPoses[Math.floor(Math.random() * familyPoses.length)];
                }
                return prompt + `They are in ${pose?.promptFragment || 'a happy pose'}. The scene is: ${themeFragment}.`;
            }

            // Customized single person
            const themeFragment = themeFragments.length > 0 ? themeFragments.join(', ') : (allThemeOptions[Math.floor(Math.random() * allThemeOptions.length)]?.promptFragment || 'a beautiful scene');

            if (!aiGenerationMode) {
                 const soloPoses = POSE_CATEGORIES.find(p => p.id === 'solo')?.options || [];
                 const pose = soloPoses[Math.floor(Math.random() * soloPoses.length)];
                 return `A solo person in ${pose?.promptFragment || 'a confident pose'}, ${themeFragment}.`;
            }

            let prompt = `A single person is in the photo. `;
            let pose;
            if (aiGenerationMode === 'partner') {
                prompt += `Generate an AI-generated ${aiPartnerType} for them. `;
                if (aiPartnerEthnicity !== 'Auto-detect') prompt += `The partner should have an ethnicity of ${aiPartnerEthnicity}. `;
                else prompt += `The partner should have features that are a plausible and aesthetically complementary blend to the original person. `;
                const couplePoses = POSE_CATEGORIES.find(p => p.id === 'couples')?.options || [];
                pose = couplePoses[Math.floor(Math.random() * couplePoses.length)];
            } else { // Child
                prompt += `Generate an AI-generated ${aiChildGender} for them. `;
                if (aiPartnerEthnicity !== 'Auto-detect') prompt += `The child should have an ethnicity of ${aiPartnerEthnicity}. `;
                else prompt += `The child should appear to be a plausible genetic blend of the person in the photo. `;
                const familyPoses = POSE_CATEGORIES.find(p => p.id === 'family')?.options || [];
                pose = familyPoses[Math.floor(Math.random() * familyPoses.length)];
            }
            return prompt + `They are in ${pose?.promptFragment || 'a happy pose'}. The scene is: ${themeFragment}.`;
        }

        setError(t('errors.uploadRequired'));
        return null;
    };

    const startGenerationProcess = useCallback(async () => {
        if (isAuthenticated && !await deductCredits(1)) {
            setError(t('credits.insufficient', { required: 1, balance: balance ?? 0 }));
            setIsEarnCreditsModalOpen(true);
            return;
        }
        
        setError(null);
        const finalPrompt = buildPrompt();
        if (!finalPrompt) return;
        
        setLastThemePrompt(finalPrompt);
        setIsGenerating(true);
        setImageUrl(null);
        setVideoUrl(null);
        setIsWatermarked(true);
        
        try {
            const resultUrl = await generateCompositeImage(files, finalPrompt, undefined, true);
            setImageUrl(resultUrl);
        } catch (e) {
            console.error(e);
            setError(getFriendlyErrorMessage(e));
        } finally {
            setIsGenerating(false);
        }
    }, [files, themeConfig, customPrompt, aiGenerationMode, aiPartnerType, aiChildGender, aiPartnerEthnicity, getFriendlyErrorMessage, t, isCustomizing, isAuthenticated, balance, deductCredits]);

    const handleGenerateClick = () => {
        if (files.length === 0) {
            setError(t('errors.uploadRequired'));
            return;
        }
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
            return;
        }
        if (hasAcceptedPrivacy) {
            startGenerationProcess();
        } else {
            setIsPrivacyModalOpen(true);
            setGenerateActionQueued(true);
        }
    };
    
    const handleTryAnother = () => {
        setImageUrl(null);
        setVideoUrl(null);
        setFiles([]);
        setThemeConfig({});
        setCustomPrompt('');
        setAiGenerationMode(null);
        setError(null);
        setIsCustomizing(false);
    };

    const handleAnimate = useCallback(async (duration: number, cost: number) => {
        setIsAnimateModalOpen(false);
        if (!imageUrl) return;
        if (isAuthenticated && !await deductCredits(cost)) {
            setError(t('credits.insufficient', { required: cost, balance: balance ?? 0 }));
            setIsEarnCreditsModalOpen(true);
            return;
        }
        setIsAnimating(true);
        setError(null);
        startCountdown(duration * 30); // Estimated generation time
        try {
            const resultUrl = await animateImage(imageUrl, lastThemePrompt, duration);
            setVideoUrl(resultUrl);
        } catch(e) {
            console.error(e);
            setError(getFriendlyErrorMessage(e));
        } finally {
            setIsAnimating(false);
        }
    }, [imageUrl, lastThemePrompt, getFriendlyErrorMessage, isAuthenticated, balance, deductCredits, t]);

    const handleSaveToMemories = () => {
        if (imageUrl) {
            addMemory(imageUrl);
            setToastMessage(t('memories.savedToast'));
        }
    };
    
    const handleSpotlightClick = (sceneId: string) => {
        const scene = spotlightScenes.find(s => s.id === sceneId);
        const index = spotlightScenes.findIndex(s => s.id === sceneId);
        if (scene && index !== -1) {
            setCurrentSpotlightScene(scene);
            setSelectedSpotlightIndex(index);
            setIsSpotlightModalOpen(true);
        }
    };

    const handleSpotlightNavigate = (direction: 'next' | 'prev') => {
        if (selectedSpotlightIndex === null || spotlightScenes.length === 0) return;

        let newIndex;
        if (direction === 'next') {
            newIndex = (selectedSpotlightIndex + 1) % spotlightScenes.length;
        } else {
            newIndex = (selectedSpotlightIndex - 1 + spotlightScenes.length) % spotlightScenes.length;
        }
        setSelectedSpotlightIndex(newIndex);
        setCurrentSpotlightScene(spotlightScenes[newIndex]);
    };
    
    const handleSponsorConfirm = async () => {
        if (!isAuthenticated || !imageUrl || !user) return;
        
        if (!await deductCredits(SPONSOR_COST)) {
            setError(t('credits.insufficient', { required: SPONSOR_COST, balance: balance ?? 0 }));
            setIsSponsorModalOpen(false);
            setIsEarnCreditsModalOpen(true);
            return;
        }
    
        addSceneToSpotlight({
            id: `scene_${Date.now()}`,
            imageUrl,
            creator: `@${user.name}`
        });
        setToastMessage(t('sponsor.successToast', { lang: 'en'}) || "Your scene is now in the spotlight!");
    };

    const handleRemoveWatermarkConfirm = async () => {
        if (!isAuthenticated) return;

        if (!await deductCredits(REMOVE_WATERMARK_COST)) {
            setError(t('credits.insufficient', { required: REMOVE_WATERMARK_COST, balance: balance ?? 0 }));
            setIsRemoveWatermarkModalOpen(false);
            setIsEarnCreditsModalOpen(true);
            return;
        }

        if (sceneForWatermarkRemoval) {
            removeWatermarkFromScene(sceneForWatermarkRemoval.id);
        } else {
            setIsWatermarked(false);
        }
        
        setToastMessage(t('watermark.successToast'));
        setIsRemoveWatermarkModalOpen(false);
        setSceneForWatermarkRemoval(null);
    };

    const handleSurpriseMe = () => {
        const randomPoseCategory = POSE_CATEGORIES[Math.floor(Math.random() * POSE_CATEGORIES.length)];
        const randomPose = randomPoseCategory.options[Math.floor(Math.random() * randomPoseCategory.options.length)];

        const randomThemeCategory = THEME_CATEGORIES[Math.floor(Math.random() * THEME_CATEGORIES.length)];
        const randomTheme = randomThemeCategory.options[Math.floor(Math.random() * randomThemeCategory.options.length)];

        setThemeConfig({
            [randomPoseCategory.id]: randomPose.id,
            [randomThemeCategory.id]: randomTheme.id
        });
    };

    const handleEditSubmit = useCallback(async (feedback: string, faceLock: boolean) => {
        setIsEditModalOpen(false);
        if (isAuthenticated && !await deductCredits(1)) {
            setError(t('credits.insufficient', { required: 1, balance: balance ?? 0 }));
            setIsEarnCreditsModalOpen(true);
            return;
        }
        
        setError(null);
        setIsGenerating(true);
        setImageUrl(null);
        setVideoUrl(null);
        
        try {
            const resultUrl = await generateCompositeImage(files, lastThemePrompt, feedback, faceLock);
            setImageUrl(resultUrl);
        } catch (e) {
            console.error(e);
            setError(getFriendlyErrorMessage(e));
        } finally {
            setIsGenerating(false);
        }
    }, [files, lastThemePrompt, getFriendlyErrorMessage, t, isAuthenticated, balance, deductCredits]);

    const showVerificationSuccessToast = () => setToastMessage(t('auth.verify.resendSuccess'));
    const showVerificationErrorToast = () => setToastMessage(t('auth.errors.generic'));

    const isGenerateDisabled = isGenerating || isAnimating;

    return (
        <div className={`min-h-screen w-full ${theme.bg} ${theme.textPrimary} font-sans p-4 flex flex-col transition-colors duration-500`}>
            <div className="container mx-auto max-w-4xl flex-grow">
                <Header 
                    onLoginClick={() => setIsAuthModalOpen(true)}
                    onMemoriesClick={() => setIsMemoriesModalOpen(true)}
                    onSpotlightClick={handleSpotlightClick}
                    onProfileClick={() => setIsProfileModalOpen(true)}
                />

                {isAuthenticated && !isEmailVerified && (
                    <VerificationBanner 
                        onSuccess={showVerificationSuccessToast} 
                        onError={showVerificationErrorToast} 
                    />
                )}

                <main className="mt-8">
                     <div className={`p-6 ${theme.panelBg} rounded-2xl border ${theme.borderColor} shadow-lg flex flex-col`}>
                       {error ? (
                            <div className="m-4 p-4 bg-red-900 bg-opacity-80 border border-red-500 text-white rounded-lg text-center shadow-lg">
                                <p className="font-bold text-lg mb-2">{t('errors.title')}</p>
                                <p>{error}</p>
                                <button onClick={() => window.location.reload()} className="mt-4 px-5 py-2 bg-white text-red-900 font-bold rounded-lg hover:bg-gray-200">{t('errors.refresh')}</button>
                            </div>
                        ) : isGenerating ? (
                            <div className="min-h-[500px] flex items-center justify-center">
                                <Loader messages={t('generateButton.loading', { returnObjects: true })}/>
                            </div>
                        ) : imageUrl ? (
                            <ResultDisplay 
                                files={files}
                                imageUrl={imageUrl}
                                videoUrl={videoUrl}
                                isAnimating={isAnimating}
                                countdown={countdown}
                                isWatermarked={isWatermarked}
                                onEdit={() => setIsEditModalOpen(true)}
                                onTryAnother={handleTryAnother}
                                onImageClick={setFullscreenImageUrl}
                                onSaveToMemories={handleSaveToMemories}
                                onSponsor={() => setIsSponsorModalOpen(true)}
                                onRemoveWatermark={() => { setSceneForWatermarkRemoval(null); setIsRemoveWatermarkModalOpen(true); }}
                                onAnimateClick={() => setIsAnimateModalOpen(true)}
                            />
                        ) : (
                             <div className="space-y-6">
                                <div>
                                    <h2 className={`text-2xl font-semibold ${theme.textSecondary} mb-1 text-center`}>{t('uploader.title')}</h2>
                                    <p className={`text-center text-sm ${theme.textSecondary} mb-4`}>{t('uploader.sub')}</p>
                                    <ImageUploader files={files} onFilesChange={setFiles} />
                                </div>
                                
                                {files.length > 0 && (
                                    isCustomizing ? (
                                        <>
                                            <SceneSelector
                                                themeConfig={themeConfig}
                                                onThemeConfigChange={setThemeConfig}
                                                onSurpriseMe={handleSurpriseMe}
                                                customPrompt={customPrompt}
                                                onCustomPromptChange={setCustomPrompt}
                                                fileCount={files.length}
                                                aiGenerationMode={aiGenerationMode}
                                                onAiGenerationModeChange={setAiGenerationMode}
                                                aiPartnerType={aiPartnerType}
                                                onAiPartnerTypeChange={setAiPartnerType}
                                                aiPartnerEthnicity={aiPartnerEthnicity}
                                                onAiPartnerEthnicityChange={setAiPartnerEthnicity}
                                                aiChildGender={aiChildGender}
                                                onAiChildGenderChange={setAiChildGender}
                                            />
                                            <button
                                                onClick={handleGenerateClick}
                                                disabled={isGenerateDisabled}
                                                className={`w-full ${theme.buttonPrimary} text-white font-bold text-lg py-3 px-6 rounded-lg transition-all shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {t('generateButton.action')}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center space-y-3 pt-4">
                                            <button
                                                onClick={handleGenerateClick}
                                                disabled={isGenerateDisabled}
                                                className={`w-full ${theme.buttonPrimary} text-white font-bold text-lg py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {t('generateButton.randomAction')}
                                            </button>
                                            <button
                                                onClick={() => setIsCustomizing(true)}
                                                className={`text-sm ${theme.textSecondary} hover:${theme.textPrimary} underline transition-colors`}
                                            >
                                                {t('sceneSelector.customize')}
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
             <footer className={`text-center p-4 mt-8 ${theme.textSecondary} text-sm flex-shrink-0 flex justify-center items-center space-x-4`}>
                <button onClick={() => setIsPrivacyModalOpen(true)} className={`hover:${theme.textPrimary} underline`}>{t('privacy.footerLink')}</button>
                <span className="opacity-50">|</span>
                <button onClick={() => setIsAboutModalOpen(true)} className={`hover:${theme.textPrimary} underline`}>{t('about.footerLink')}</button>
                <span className="opacity-50">|</span>
                <button onClick={() => setIsCreatorModalOpen(true)} className={`hover:${theme.textPrimary} underline`}>{t('creator.footerLink')}</button>
            </footer>

            {/* Modals */}
            <PrivacyPolicy isOpen={isPrivacyModalOpen} onClose={() => { setIsPrivacyModalOpen(false); setGenerateActionQueued(false); }} onAccept={() => { setHasAcceptedPrivacy(true); localStorage.setItem('privacyAccepted', 'true'); setIsPrivacyModalOpen(false); }} showAcceptButton={!hasAcceptedPrivacy} />
            <AboutUsModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
            <CreatorModal isOpen={isCreatorModalOpen} onClose={() => setIsCreatorModalOpen(false)} />
            <FullscreenViewer isOpen={!!fullscreenImageUrl} imageUrl={fullscreenImageUrl} onClose={() => setFullscreenImageUrl(null)} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            <EarnCreditsModal 
                isOpen={isEarnCreditsModalOpen} 
                onClose={() => setIsEarnCreditsModalOpen(false)} 
                onAdSuccess={(credits) => setToastMessage(t('credits.ads.successToast', { count: credits }))}
            />
            <MemoriesModal isOpen={isMemoriesModalOpen} onClose={() => setIsMemoriesModalOpen(false)} />
            <SpotlightModal 
                isOpen={isSpotlightModalOpen} 
                onClose={() => setIsSpotlightModalOpen(false)} 
                scene={currentSpotlightScene}
                onLike={likeScene}
                isLiked={currentSpotlightScene ? likedSceneIds.includes(currentSpotlightScene.id) : false}
                onRemoveWatermark={() => { setSceneForWatermarkRemoval(currentSpotlightScene); setIsSpotlightModalOpen(false); setIsRemoveWatermarkModalOpen(true); }}
                onNavigate={handleSpotlightNavigate}
            />
            <SponsorModal isOpen={isSponsorModalOpen} onClose={() => setIsSponsorModalOpen(false)} onConfirm={handleSponsorConfirm} />
            <RemoveWatermarkModal isOpen={isRemoveWatermarkModalOpen} onClose={() => setIsRemoveWatermarkModalOpen(false)} onConfirm={handleRemoveWatermarkConfirm} />
            <EditModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleEditSubmit}
                title={t('editor.title')}
            />
             <AnimateModal
                isOpen={isAnimateModalOpen}
                onClose={() => setIsAnimateModalOpen(false)}
                onAnimate={handleAnimate}
            />
            <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
            
            {/* Toast */}
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
        </div>
    );
}