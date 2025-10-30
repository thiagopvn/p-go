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
      console.log('🔍 [CADASTRO] Iniciando validação para RG:', data.rg);

      // First, check if already registered in usuarios collection
      const existingUserDoc = await getDoc(doc(db, 'usuarios', data.rg));
      if (existingUserDoc.exists()) {
        console.log('❌ [CADASTRO] RG já cadastrado na plataforma');
        setLoading(false);
        return { success: false, error: 'Este RG já está cadastrado na plataforma.' };
      }

      // Get militar data from 'militares' collection to validate
      console.log('🔍 [CADASTRO] Verificando RG na coleção militares...');
      const militarDoc = await getDoc(doc(db, 'militares', data.rg));
      console.log('🔍 [CADASTRO] Resultado da busca:', militarDoc.exists() ? 'EXISTE' : 'NÃO EXISTE');

      if (!militarDoc.exists()) {
        console.log('❌ [CADASTRO] RG não encontrado na base de militares');
        setLoading(false);
        return {
          success: false,
          error: 'Erro no cadastro. RG não encontrado na base de dados. Entre em contato com o TEN Thiago Santos, desenvolvedor do aplicativo, pelo número 21 967586628.'
        };
      }

      console.log('✅ [CADASTRO] RG encontrado, validando dados...');

      const militarData = militarDoc.data() as Militar;

      // Normalize strings for case-insensitive comparison
      const normalize = (str: string) => str.trim().toLowerCase();

      // Log para debug - confirmar que quadro não está sendo validado
      console.log('📋 [CADASTRO] Dados fornecidos:', {
        grad: data.grad,
        quadro: data.quadro,
        nome: data.nome,
        unidade: data.unidade
      });
      console.log('📋 [CADASTRO] Dados no banco:', {
        grad: militarData.grad,
        quadro: militarData.quadro,
        nome: militarData.nome,
        unidade: militarData.unidade
      });

      // Validate all fields against militares data
      // IMPORTANTE: Quadro NÃO é validado - usuário pode informar qualquer valor
      const validations = [
        {
          field: 'graduação',
          provided: normalize(data.grad),
          expected: normalize(militarData.grad)
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

      console.log('🔍 [CADASTRO] Campos sendo validados:', validations.map(v => v.field));

      // Check for validation errors
      const errors = validations.filter(v => v.provided !== v.expected);

      if (errors.length > 0) {
        console.log('❌ [CADASTRO] Dados divergentes:', errors);
        setLoading(false);
        const errorFields = errors.map(e => e.field).join(', ');
        return {
          success: false,
          error: `Erro no cadastro. Dados divergentes: ${errorFields}. Entre em contato com o TEN Thiago Santos, desenvolvedor do aplicativo, pelo número 21 967586628.`
        };
      }

      console.log('✅ [CADASTRO] Todos os dados validados! Criando usuário...');

      // All validations passed - create user in 'usuarios' collection
      const newUser: Usuario = {
        rg: data.rg,
        senha: data.senha,
        role: data.rg === '53717' ? 'admin' : 'user', // Ten Thiago Santos gets admin role
        grad: militarData.grad, // Use validated data from militares
        quadro: data.quadro, // Use user-provided quadro (não precisa validar)
        nome: militarData.nome,
        unidade: militarData.unidade,
        createdAt: new Date()
      };

      // Save to 'usuarios' collection
      await setDoc(doc(db, 'usuarios', data.rg), newUser);

      console.log('✅ [CADASTRO] Usuário criado com sucesso!');
      setLoading(false);
      return {
        success: true
      };
    } catch (error) {
      console.error('❌ [CADASTRO] Erro durante cadastro:', error);
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