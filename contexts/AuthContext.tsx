import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Militar } from '../types';

interface AuthContextType {
  currentUser: Militar | null;
  role: 'admin' | 'user' | null;
  login: (rg: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  signup: (militar: Militar) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Militar | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for persisted user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setRole(user.role || 'user');
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (rg: string, senha: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      // Get militar from Firestore by RG
      const militarDoc = await getDoc(doc(db, 'militares', rg));

      if (!militarDoc.exists()) {
        setLoading(false);
        return { success: false, error: 'RG não encontrado.' };
      }

      const militarData = militarDoc.data() as Militar;

      // Verify password
      if (militarData.senha !== senha) {
        setLoading(false);
        return { success: false, error: 'Senha incorreta.' };
      }

      // Successful login
      const userRole = militarData.role || 'user';
      setCurrentUser(militarData);
      setRole(userRole);

      // Persist session to localStorage
      localStorage.setItem('currentUser', JSON.stringify(militarData));

      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
    }
  }, []);

  const signup = useCallback(async (militar: Militar): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      // Check if RG already exists
      const militarDoc = await getDoc(doc(db, 'militares', militar.rg));

      if (militarDoc.exists()) {
        setLoading(false);
        return { success: false, error: 'RG já cadastrado.' };
      }

      // Create new militar with default role 'user'
      const newMilitar: Militar = {
        ...militar,
        role: 'user'
      };

      // Save to Firestore
      await setDoc(doc(db, 'militares', militar.rg), newMilitar);

      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      setLoading(false);
      return { success: false, error: 'Erro ao cadastrar. Tente novamente.' };
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setRole(null);
    localStorage.removeItem('currentUser');
  }, []);

  const value = { currentUser, role, login, signup, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};