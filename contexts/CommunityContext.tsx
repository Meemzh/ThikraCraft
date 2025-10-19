import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

const LIKE_THRESHOLD = 40;

export interface SpotlightScene {
  id: string;
  imageUrl: string;
  creator: string; // User handle
  likes: number;
  isWatermarkRemoved: boolean;
}

interface CommunityContextType {
  spotlightScenes: SpotlightScene[];
  currentSpotlightScene: SpotlightScene | null;
  likeScene: (sceneId: string) => void;
  addSceneToSpotlight: (scene: Omit<SpotlightScene, 'likes' | 'isWatermarkRemoved'>) => void;
  removeWatermarkFromScene: (sceneId: string) => void;
  likedSceneIds: string[];
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

// Dummy data for simulation
const initialScenes: SpotlightScene[] = [
    { id: 'spotlight1', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/images/c255554f-1244-48d8-a15e-445855f4f895.png', creator: '@Aisha_Art', likes: 28, isWatermarkRemoved: false },
    { id: 'spotlight2', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/images/b63c7263-54d9-4b6e-8263-22709e74f1b5.png', creator: '@CreativeSoul', likes: 35, isWatermarkRemoved: false },
    { id: 'spotlight3', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/images/99b82813-f661-464a-a6d1-21c61301e74a.png', creator: '@DigitalDreamer', likes: 42, isWatermarkRemoved: true },
];

// FIX: Fix "missing children" prop error by changing component signature to use React.FC.
export const CommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [spotlightScenes, setSpotlightScenes] = useState<SpotlightScene[]>(initialScenes);
    const [currentSpotlightIndex, setCurrentSpotlightIndex] = useState(0);
    const [likedSceneIds, setLikedSceneIds] = useState<string[]>([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSpotlightIndex(prev => (prev + 1) % spotlightScenes.length);
        }, 5000); // Rotate every 5 seconds
        return () => clearInterval(interval);
    }, [spotlightScenes.length]);
    
    useEffect(() => {
        // Reset likes when user logs out
        if (!isAuthenticated) {
            setLikedSceneIds([]);
        }
    }, [isAuthenticated]);

    const likeScene = (sceneId: string) => {
        if (likedSceneIds.includes(sceneId)) return; // Already liked

        setSpotlightScenes(prevScenes =>
            prevScenes.map(scene => {
                if (scene.id === sceneId) {
                    const newLikes = scene.likes + 1;
                    const watermarkRemoved = newLikes >= LIKE_THRESHOLD;
                    return { ...scene, likes: newLikes, isWatermarkRemoved: watermarkRemoved };
                }
                return scene;
            })
        );
        setLikedSceneIds(prev => [...prev, sceneId]);
    };

    const addSceneToSpotlight = (sceneData: Omit<SpotlightScene, 'likes' | 'isWatermarkRemoved'>) => {
        const newScene: SpotlightScene = {
            ...sceneData,
            likes: 0,
            isWatermarkRemoved: false,
        };
        setSpotlightScenes(prev => [newScene, ...prev]);
    };
    
    const removeWatermarkFromScene = (sceneId: string) => {
        setSpotlightScenes(prevScenes =>
            prevScenes.map(scene => {
                if (scene.id === sceneId) {
                    return { ...scene, isWatermarkRemoved: true };
                }
                return scene;
            })
        );
    };

    const currentSpotlightScene = spotlightScenes.length > 0 ? spotlightScenes[currentSpotlightIndex] : null;

    return (
        <CommunityContext.Provider value={{ spotlightScenes, currentSpotlightScene, likeScene, addSceneToSpotlight, removeWatermarkFromScene, likedSceneIds }}>
            {children}
        </CommunityContext.Provider>
    );
};

export const useCommunity = () => {
    const context = useContext(CommunityContext);
    if (context === undefined) {
        throw new Error('useCommunity must be used within a CommunityProvider');
    }
    return context;
};