import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Usuario, Militar } from '../types';

interface AuthContextType {
  currentUser: Usuario | null;
  role: 'admin' | 'user' | null;
  login: (rg: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    rg: string;
    senha: string;
    grad: string;
    quadro: string;
    nome: string;
    unidade: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
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

  // Login function - now checks 'usuarios' collection
  const login = useCallback(async (rg: string, senha: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      // Get user from 'usuarios' collection
      const userDoc = await getDoc(doc(db, 'usuarios', rg));

      if (!userDoc.exists()) {
        setLoading(false);
        return {
          success: false,
          error: 'Usuário não cadastrado. Por favor, faça seu cadastro primeiro.'
        };
      }

      const userData = userDoc.data() as Usuario;

      // Verify password
      if (userData.senha !== senha) {
        setLoading(false);
        return { success: false, error: 'Senha incorreta.' };
      }

      // Successful login
      setCurrentUser(userData);
      setRole(userData.role);

      // Persist session to localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));

      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
    }
  }, []);

  // Register function - validates against 'militares' and creates in 'usuarios'
  const register = useCallback(async (data: {
    rg: string;
    senha: string;
    grad: string;
    quadro: string;
    nome: string;
    unidade: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      // First, check if already registered in usuarios collection
      const existingUserDoc = await getDoc(doc(db, 'usuarios', data.rg));
      if (existingUserDoc.exists()) {
        setLoading(false);
        return { success: false, error: 'Este RG já está cadastrado na plataforma.' };
      }

      // Get militar data from 'militares' collection to validate
      const militarDoc = await getDoc(doc(db, 'militares', data.rg));

      if (!militarDoc.exists()) {
        setLoading(false);
        return {
          success: false,
          error: 'RG não consta no banco de dados. Entre em contato com o Ten Thiago Santos.'
        };
      }

      const militarData = militarDoc.data() as Militar;

      // Normalize strings for case-insensitive comparison
      const normalize = (str: string) => str.trim().toLowerCase();

      // Validate all fields against militares data
      const validations = [
        {
          field: 'graduação',
          provided: normalize(data.grad),
          expected: normalize(militarData.grad)
        },
        {
          field: 'quadro',
          provided: normalize(data.quadro),
          expected: normalize(militarData.quadro)
        },
        {
          field: 'nome',
          provided: normalize(data.nome),
          expected: normalize(militarData.nome)
        },
        {
          field: 'unidade',
          provided: normalize(data.unidade),
          expected: normalize(militarData.unidade)
        }
      ];

      // Check for validation errors
      const errors = validations.filter(v => v.provided !== v.expected);

      if (errors.length > 0) {
        setLoading(false);
        const errorFields = errors.map(e => e.field).join(', ');
        return {
          success: false,
          error: `Dados divergentes (${errorFields}). Verifique suas informações ou entre em contato com o Ten Thiago Santos.`
        };
      }

      // All validations passed - create user in 'usuarios' collection
      const newUser: Usuario = {
        rg: data.rg,
        senha: data.senha,
        role: data.rg === '53717' ? 'admin' : 'user', // Ten Thiago Santos gets admin role
        grad: militarData.grad, // Use validated data from militares
        quadro: militarData.quadro,
        nome: militarData.nome,
        unidade: militarData.unidade,
        createdAt: new Date()
      };

      // Save to 'usuarios' collection
      await setDoc(doc(db, 'usuarios', data.rg), newUser);

      setLoading(false);
      return {
        success: true
      };
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      return { success: false, error: 'Erro ao cadastrar. Tente novamente.' };
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setRole(null);
    localStorage.removeItem('currentUser');
  }, []);

  const value = {
    currentUser,
    role,
    login,
    register, // Changed from signup to register
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};