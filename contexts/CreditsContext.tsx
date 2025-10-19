import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db, increment } from '../firebase';


interface CreditsContextType {
  balance: number | null;
  deductCredits: (amount: number) => Promise<boolean>;
  addCredits: (amount: number) => Promise<void>;
  getDailyBonus: () => boolean;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

const DAILY_BONUS = 5;

export const CreditsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const userDocRef = db.collection('users').doc(user.uid);
      const unsubscribe = userDocRef.onSnapshot((docSnap) => {
        if (docSnap.exists) {
          setBalance(docSnap.data()?.credits);
        } else {
          // This can happen briefly on first login before the doc is created
          setBalance(null);
        }
      }, (error) => {
        console.error("Error listening to credits:", error);
        setBalance(null);
      });

      return () => unsubscribe();
    } else {
      setBalance(null);
    }
  }, [user]);

  const getDailyBonus = () => {
    if (!user) return false;

    const lastBonusKey = `lastBonusTime_${user.uid}`;
    const lastBonusTime = localStorage.getItem(lastBonusKey);
    const now = new Date().getTime();

    if (!lastBonusTime || now - parseInt(lastBonusTime) > 24 * 60 * 60 * 1000) {
      addCredits(DAILY_BONUS);
      localStorage.setItem(lastBonusKey, now.toString());
      return true;
    }
    return false;
  };

  const deductCredits = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    
    // Check balance from state first for responsiveness
    if (balance !== null && balance < amount) return false;

    // Then confirm on the backend
    const userDocRef = db.collection('users').doc(user.uid);
    try {
        const docSnap = await userDocRef.get();
        if (docSnap.exists && docSnap.data().credits >= amount) {
            await userDocRef.update({
                credits: increment(-amount)
            });
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error deducting credits:", error);
        return false;
    }
  };

  const addCredits = async (amount: number) => {
    if (user) {
        try {
            const userDocRef = db.collection('users').doc(user.uid);
            await userDocRef.update({
                credits: increment(amount)
            });
        } catch(error) {
            console.error("Error adding credits:", error);
        }
    }
  };

  return (
    <CreditsContext.Provider value={{ balance, deductCredits, addCredits, getDailyBonus }}>
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
};