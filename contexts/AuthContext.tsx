import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import firebase, { auth, db, serverTimestamp } from '../firebase';

interface User {
  uid: string;
  name: string;
}

// Use 'any' type to avoid module import issues for Firebase's User type.
// This is a robust solution to the persistent compilation errors.
type FirebaseUser = any;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUsername: (newName: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  isEmailVerified: boolean;
  resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  const updateUsername = async (newName: string) => {
    if (user) {
      try {
        const userDocRef = db.collection('users').doc(user.uid);
        await userDocRef.update({ name: newName });
        // The real-time listener will update the local state automatically
      } catch (error) {
        console.error("Error updating username:", error);
      }
    }
  };

  const createProfileIfNotExists = useCallback(async (firebaseUser: FirebaseUser) => {
    const userDocRef = db.collection('users').doc(firebaseUser.uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      const newUserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || `User${Math.floor(Math.random() * 9000) + 1000}`,
        createdAt: serverTimestamp(),
        credits: 10, // Starting credits for new real users
      };
      await userDocRef.set(newUserProfile);
    }
  }, []);

  useEffect(() => {
    let unsubscribeFromProfile: (() => void) | null = null;

    const unsubscribeFromAuth = auth.onAuthStateChanged(async (firebaseUser) => {
      if (unsubscribeFromProfile) {
        unsubscribeFromProfile();
        unsubscribeFromProfile = null;
      }

      if (firebaseUser && !firebaseUser.isAnonymous) {
          setIsEmailVerified(firebaseUser.emailVerified);
          await createProfileIfNotExists(firebaseUser);
          const userDocRef = db.collection('users').doc(firebaseUser.uid);
          
          unsubscribeFromProfile = userDocRef.onSnapshot((docSnap) => {
              if (docSnap.exists) {
                  const userData = docSnap.data();
                  setUser({
                    uid: firebaseUser.uid,
                    name: userData?.name || 'User',
                  });
              }
              setLoading(false);
          }, (error) => {
              console.error("Error listening to user profile:", error);
              setUser(null);
              setLoading(false);
          });
      } else {
        setUser(null);
        setIsEmailVerified(false);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeFromAuth();
      if (unsubscribeFromProfile) {
        unsubscribeFromProfile();
      }
    };
  }, [createProfileIfNotExists]);

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      if (userCredential.user) {
        await userCredential.user.sendEmailVerification();
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error; // Re-throw to be caught by the UI
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error; // Re-throw to be caught by the UI
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      await auth.sendPasswordResetEmail(email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  };
  
  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.sendEmailVerification();
      } catch (error) {
        console.error("Error resending verification email:", error);
        throw error;
      }
    } else {
      throw new Error("No user is currently signed in.");
    }
  };

  const isAuthenticated = !!user;

  const value = { user, loading, signUp, login, logout, isAuthenticated, updateUsername, sendPasswordResetEmail, isEmailVerified, resendVerificationEmail };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};