
'use client';

import { useState, useEffect, useCallback } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

export const useUserStats = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentCoins, setCurrentCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  // This function fetches user data from Firestore or creates it if it doesn't exist
  const getUserProfile = useCallback(async (firebaseUser: User) => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      setCurrentCoins(userData.coinBalance || 0);
      setLevel(userData.level || 1);
    } else {
      // Create a new profile for the new user
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email, // Will be null for anonymous users
        createdAt: serverTimestamp(),
        coinBalance: 0,
        level: 1,
      });
      setCurrentCoins(0);
      setLevel(1);
    }
    setIsInitialized(true);
  }, []);

  // Effect to handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await getUserProfile(firebaseUser);
      } else {
        // If no user, sign in anonymously
        try {
          const userCredential = await signInAnonymously(auth);
          // The onAuthStateChanged listener will re-run with the new user,
          // so we don't need to call getUserProfile here.
        } catch (error) {
          console.error("Error signing in anonymously:", error);
          setIsInitialized(true); // Still initialize to not block UI
        }
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [getUserProfile]);

  const addCoins = useCallback(async (amount: number) => {
    if (!user || amount === 0) return;

    const newCoins = currentCoins + amount;
    if (newCoins < 0) return; // Prevent negative balance
    
    setCurrentCoins(newCoins);

    const userDocRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userDocRef, {
        coinBalance: increment(amount),
      });
    } catch (error) {
      console.error("Error updating coinBalance in Firestore:", error);
      // Optional: Rollback local state if Firestore update fails
      setCurrentCoins(currentCoins);
    }
  }, [user, currentCoins]);

  const levelUp = useCallback(async () => {
    if (!user) return;

    const newLevel = level + 1;
    setLevel(newLevel);

    const userDocRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userDocRef, {
        level: increment(1),
      });
    } catch (error) {
      console.error("Error updating level in Firestore:", error);
      // Optional: Rollback local state if Firestore update fails
      setLevel(level);
    }
  }, [user, level]);

  return {
    user, // Expose user object
    currentCoins,
    level,
    addCoins,
    levelUp,
    isInitialized,
  };
};
