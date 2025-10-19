import React, { useState } from 'react';
import { POSE_CATEGORIES, THEME_CATEGORIES, AI_PARTNER_TYPE_OPTIONS, AI_CHILD_GENDER_OPTIONS, ETHNICITY_OPTIONS, SUGGESTION_TRIGGERS } from '../constants';
import { ThemeConfig, AiGenerationMode, AiPartnerType, AiChildGender, AiPartnerEthnicity } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface SceneSelectorProps {
  themeConfig: ThemeConfig;
  onThemeConfigChange: (config: ThemeConfig) => void;
  onSurpriseMe: () => void;
  customPrompt: string;
  onCustomPromptChange: (prompt: string) => void;
  fileCount: number;
  aiGenerationMode: AiGenerationMode | null;
  onAiGenerationModeChange: (mode: AiGenerationMode) => void;
  aiPartnerType: AiPartnerType;
  onAiPartnerTypeChange: (type: AiPartnerType) => void;
  aiPartnerEthnicity: AiPartnerEthnicity;
  onAiPartnerEthnicityChange: (ethnicity: AiPartnerEthnicity) => void;
  aiChildGender: AiChildGender;
  onAiChildGenderChange: (gender: AiChildGender) => void;
}

const RandomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" transform="rotate(45 10 10)" />
        <path d="M3 10a7 7 0 0112.452-4.792A1 1 0 0014.035 4.5a5 5 0 00-8.07 4.002 1 1 0 00.733 1.22l.3.107a1 1 0 001.18-.328A3 3 0 0110 7a1 1 0 100-2 5 5 0 00-4.546 2.916A1 1 0 006.92 9.14a3 3 0 012.122-2.121 1 1 0 00.216-1.986A5 5 0 004.5 9.035a1 1 0 00-1.248.813A7 7 0 013 10zm12.95 2.788a1 1 0 00-1.18.328 3 3 0 01-2.77 1.384 1 1 0 10-.6 1.9A5 5 0 0015.5 14.965a1 1 0 001.248-.813A7.001 7.001 0 0117 10a1 1 0 10-2 0 5 5 0 00-1.454 3.546 1 1 0 001.07 1.157 3 3 0 012.962-2.624 1 1 0 00-.128-1.3z" />
    </svg>
);

const Select: React.FC<{
    label: React.ReactNode;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled: boolean;
    children: React.ReactNode;
}> = ({ label, id, value, onChange, disabled, children }) => {
    const { theme } = useTheme();
    return (
        <div>
            <label htmlFor={id} className={`flex items-center mb-2 text-sm font-medium ${theme.textSecondary}`}>
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                className={`w-full p-3 ${theme.inputBg} ${theme.textPrimary} border ${theme.borderColor} rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-colors`}
                disabled={disabled}
            >
                {children}
            </select>
        </div>
    );
};

export const SceneSelector: React.FC<SceneSelectorProps> = (props) => {
    const { theme } = useTheme();
    const { t, dir } = useTranslation();
    const {
        themeConfig, onThemeConfigChange, onSurpriseMe, customPrompt, onCustomPromptChange,
        fileCount, aiGenerationMode, onAiGenerationModeChange,
        aiPartnerType, onAiPartnerTypeChange, aiPartnerEthnicity, onAiPartnerEthnicityChange,
        aiChildGender, onAiChildGenderChange
    } = props;
    
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleCategoryChange = (categoryId: string, value: string) => { onThemeConfigChange({ ...themeConfig, [categoryId]: value }); };
    
    const handleCustomPromptChangeWithSuggestions = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        onCustomPromptChange(value);
        if (value.endsWith(' ')) {
            const words = value.trim().split(/\s+/);
            const lastWord = words[words.length - 1]?.toLowerCase();
            if (lastWord && SUGGESTION_TRIGGERS[lastWord]) { setSuggestions(SUGGESTION_TRIGGERS[lastWord]); return; }
        }
        setSuggestions([]);
    };

    const handleSuggestionClick = (suggestion: string) => {
        onCustomPromptChange(customPrompt + suggestion);
        setSuggestions([]);
    };

    const isSinglePersonMode = fileCount === 1;

    const renderMultiPersonUI = () => (
        <>
            {POSE_CATEGORIES.map(category => (
                 <div key={category.id}>
                    <Select id={`${category.id}-select`} label={t(category.nameKey)} value={themeConfig[category.id] || ''} onChange={(e) => handleCategoryChange(category.id, e.target.value)} disabled={!!customPrompt}>
                        <option value="">{t('sceneSelector.selectPose')}</option>
                        {category.options.map(option => <option key={option.id} value={option.id} className="bg-gray-800">{t(option.nameKey)}</option>)}
                    </Select>
                 </div>
            ))}
            {THEME_CATEGORIES.map(category => (
                <div key={category.id}>
                    <Select id={`${category.id}-select`} label={t(category.nameKey)} value={themeConfig[category.id] || ''} onChange={(e) => handleCategoryChange(category.id, e.target.value)} disabled={!!customPrompt}>
                        <option value="">{t('sceneSelector.selectTheme')}</option>
                        {category.options.map(option => <option key={option.id} value={option.id} className="bg-gray-800">{t(option.nameKey)}</option>)}
                    </Select>
                </div>
            ))}
        </>
    );

    const renderSinglePersonUI = () => (
        <div className={`space-y-4 p-4 border border-dashed ${theme.borderColor} rounded-lg bg-black bg-opacity-10`}>
            <p className={`text-center font-semibold ${theme.textSecondary}`}>{t('sceneSelector.singlePersonModeTitle')}</p>
            <div>
                <label className={`block mb-2 text-sm font-medium ${theme.textSecondary}`}>{t('sceneSelector.singlePersonModePrompt')}</label>
                <div className="flex gap-2">
                    {(['partner', 'child'] as const).map(mode => ( <button key={mode} onClick={() => onAiGenerationModeChange(mode)} className={`flex-1 p-2 text-sm rounded-md transition-colors ${aiGenerationMode === mode ? `${theme.buttonPrimary} text-white font-bold` : `${theme.inputBg} hover:bg-opacity-50`}`}>{t(`sceneSelector.generate.${mode}`)}</button>))}
                </div>
            </div>
            {aiGenerationMode === 'partner' && (
                <div className="space-y-4">
                    <Select id="ai-partner-type" label={t('sceneSelector.partner.type')} value={aiPartnerType} onChange={e => onAiPartnerTypeChange(e.target.value as AiPartnerType)} disabled={!!customPrompt}>
                        {AI_PARTNER_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-gray-800">{t(opt.nameKey)}</option>)}
                    </Select>
                    <Select id="ai-partner-ethnicity" label={t('sceneSelector.partner.ethnicity')} value={aiPartnerEthnicity} onChange={e => onAiPartnerEthnicityChange(e.target.value)} disabled={!!customPrompt}>
                        {ETHNICITY_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-gray-800">{t(opt.nameKey)}</option>)}
                    </Select>
                </div>
            )}
            {aiGenerationMode === 'child' && (
                 <div className="space-y-4">
                    <Select id="ai-child-gender" label={t('sceneSelector.child.gender')} value={aiChildGender} onChange={e => onAiChildGenderChange(e.target.value as AiChildGender)} disabled={!!customPrompt}>
                        {AI_CHILD_GENDER_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-gray-800">{t(opt.nameKey)}</option>)}
                    </Select>
                    <Select id="ai-child-ethnicity" label={t('sceneSelector.child.ethnicity')} value={aiPartnerEthnicity} onChange={e => onAiPartnerEthnicityChange(e.target.value)} disabled={!!customPrompt}>
                        {ETHNICITY_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-gray-800">{t(opt.nameKey)}</option>)}
                    </Select>
                </div>
            )}
            {THEME_CATEGORIES.map(category => (
                <div key={category.id}>
                    <Select id={`${category.id}-select`} label={t(category.nameKey)} value={themeConfig[category.id] || ''} onChange={(e) => handleCategoryChange(category.id, e.target.value)} disabled={!!customPrompt}>
                        <option value="">{t('sceneSelector.selectTheme')}</option>
                        {category.options.map((option) => (
                            <option key={option.id} value={option.id} className="bg-gray-800">{t(option.nameKey)}</option>
                        ))}
                    </Select>
                </div>
            ))}
        </div>
    );
    
    return (
    <div className="w-full space-y-4">
        {isSinglePersonMode ? renderSinglePersonUI() : renderMultiPersonUI()}
        <div className="relative flex items-center justify-center pt-2">
            <span className={`w-full h-[1px] ${theme.borderColor}`}></span>
            <span className={`absolute px-2 ${theme.panelBg} ${theme.textSecondary} text-sm`}>{t('sceneSelector.or')}</span>
        </div>
        <button onClick={onSurpriseMe} disabled={!!customPrompt} className={`w-full flex items-center justify-center p-3 ${theme.buttonSecondary} ${theme.textPrimary} rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}>
            <div className={dir === 'rtl' ? 'ml-2' : 'mr-2'}><RandomIcon /></div>
            {t('sceneSelector.randomize')}
        </button>
        <div className="relative flex items-center justify-center">
            <span className={`w-full h-[1px] ${theme.borderColor}`}></span>
            <span className={`absolute px-2 ${theme.panelBg} ${theme.textSecondary} text-sm`}>{t('sceneSelector.or')}</span>
        </div>
        <div>
            <label htmlFor="custom-prompt" className={`block mb-2 text-sm font-medium ${theme.textSecondary}`}>{t('sceneSelector.customPrompt.label')}</label>
            <div className="relative">
                <textarea id="custom-prompt" rows={3} value={customPrompt} onChange={handleCustomPromptChangeWithSuggestions} onBlur={() => setTimeout(() => setSuggestions([]), 150)} className={`w-full p-3 ${theme.inputBg} ${theme.textPrimary} border ${theme.borderColor} rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-colors`} placeholder={t('sceneSelector.customPrompt.placeholder')} />
                 {suggestions.length > 0 && ( <div className={`absolute z-10 w-full mt-1 ${theme.panelBg} border ${theme.borderColor} rounded-lg shadow-lg`}><ul className="py-1 max-h-40 overflow-y-auto">{suggestions.map((s, i) => ( <li key={i} onMouseDown={() => handleSuggestionClick(s)} className={`px-4 py-2 text-sm ${theme.textSecondary} hover:bg-pink-600 hover:text-white cursor-pointer`}>{s}</li>))}</ul></div>)}
            </div>
        </div>
    </div>
  );
};