'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { app } from '@/lib/firebase';

interface User {
  email: string;
  uid: string;
}

export function useAuth() {
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firebaseUser.email) {
        setUser({ email: firebaseUser.email, uid: firebaseUser.uid });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const login = useCallback(async (email: string, password: string):Promise<{success: boolean, error?: string}> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [auth, router]);

  const signup = useCallback(async (email: string, password: string): Promise<{success: boolean, error?: string}> => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [auth, router]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [auth, router]);

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === '/login' || pathname === '/signup';
      if (!user && !isAuthPage && pathname !== '/') {
        router.push('/login');
      }
      if (user && isAuthPage) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  return { user, loading, login, signup, logout };
}
