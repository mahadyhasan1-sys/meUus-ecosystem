import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User, 
  db, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from '../lib/firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'citizen' | 'mentor' | 'sme_operator' | 'auditor';
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  syncMasterSoulToCloud: (data: any) => Promise<boolean>;
  loadMasterSoulFromCloud: () => Promise<any | null>;
  syncDlasToCloud: (evalData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrCreateUserProfile = useCallback(async (firebaseUser: User) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setProfile(userSnap.data() as UserProfile);
      } else {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Anonymous Citizen',
          photoURL: firebaseUser.photoURL,
          role: 'citizen',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(userRef, {
          ...newProfile,
          serverTimestamp: serverTimestamp()
        });
        setProfile(newProfile);
      }
    } catch (err: any) {
      console.error('Error loading user profile from Firestore:', err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchOrCreateUserProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchOrCreateUserProfile]);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await fetchOrCreateUserProfile(result.user);
      }
    } catch (err: any) {
      console.error('Firebase Auth Sign In Error:', err);
      setError(err?.message || 'Google Sign-in failed');
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      console.error('Firebase Auth Sign Out Error:', err);
      setError(err?.message || 'Sign-out failed');
    }
  };

  const clearError = () => setError(null);

  // Cloud Persistence helper for Master Soul Profile
  const syncMasterSoulToCloud = async (soulData: any): Promise<boolean> => {
    if (!user) return false;
    try {
      const profileRef = doc(db, 'users', user.uid, 'profiles', 'masterSoul');
      await setDoc(profileRef, {
        ...soulData,
        userId: user.uid,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (err) {
      console.error('Failed to sync Master Soul to Firestore:', err);
      return false;
    }
  };

  const loadMasterSoulFromCloud = async (): Promise<any | null> => {
    if (!user) return null;
    try {
      const profileRef = doc(db, 'users', user.uid, 'profiles', 'masterSoul');
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        return snap.data();
      }
      return null;
    } catch (err) {
      console.error('Failed to load Master Soul from Firestore:', err);
      return null;
    }
  };

  // Cloud Persistence helper for DLAS Reflections
  const syncDlasToCloud = async (evalData: any): Promise<boolean> => {
    if (!user) return false;
    try {
      const evalId = evalData.id || `eval-${Date.now()}`;
      const evalRef = doc(db, 'users', user.uid, 'dlasEvaluations', evalId);
      await setDoc(evalRef, {
        ...evalData,
        userId: user.uid,
        id: evalId,
        createdAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (err) {
      console.error('Failed to sync DLAS Evaluation to Firestore:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        signInWithGoogle,
        logout,
        clearError,
        syncMasterSoulToCloud,
        loadMasterSoulFromCloud,
        syncDlasToCloud
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
