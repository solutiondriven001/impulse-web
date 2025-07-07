
'use client';

import { useState, useEffect, useCallback } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

export const useUserStats = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentCoins, setCurrentCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [referralCount, setReferralCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // This function fetches user data from Firestore or creates it if it doesn't exist
  const getUserProfile = useCallback(async (firebaseUser: User) => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      setCurrentCoins(userData.coinBalance || 0);
      setLevel(userData.level || 1);
      setReferralCount(userData.referralCount || 0);
    } else {
      // Create a new profile for the new user
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        createdAt: serverTimestamp(),
        coinBalance: 0,
        level: 1,
        referralCount: 0,
      });
      setCurrentCoins(0);
      setLevel(1);
      setReferralCount(0);
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
        // User is signed out
        setUser(null);
        setCurrentCoins(0);
        setLevel(1);
        setReferralCount(0);
        setIsInitialized(true);
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
    referralCount,
    addCoins,
    levelUp,
    isInitialized,
  };
};
