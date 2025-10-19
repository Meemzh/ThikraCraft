import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { db, serverTimestamp } from '../firebase';

interface Memory {
  id: string;
  imageUrl: string;
}

interface MemoriesContextType {
  memories: Memory[];
  addMemory: (imageUrl: string) => Promise<void>;
}

const MemoriesContext = createContext<MemoriesContextType | undefined>(undefined);

export const MemoriesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      const memoriesCollectionRef = db.collection('memories');
      const q = memoriesCollectionRef.where('userId', '==', user.uid);
      
      const unsubscribe = q.onSnapshot((querySnapshot) => {
        const userMemories: Memory[] = [];
        querySnapshot.forEach((doc) => {
          userMemories.push({ id: doc.id, ...doc.data() } as Memory);
        });
        setMemories(userMemories);
      });

      return () => unsubscribe();
    } else {
      setMemories([]);
    }
  }, [user]);

  const addMemory = useCallback(async (imageUrl: string) => {
    if (!user) return;
    
    try {
      await db.collection('memories').add({
        userId: user.uid,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error adding memory: ", e);
    }
  }, [user]);

  return (
    <MemoriesContext.Provider value={{ memories, addMemory }}>
      {children}
    </MemoriesContext.Provider>
  );
};

export const useMemories = () => {
  const context = useContext(MemoriesContext);
  if (context === undefined) {
    throw new Error('useMemories must be used within a MemoriesProvider');
  }
  return context;
};