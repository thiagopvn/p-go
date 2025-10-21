import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Militar } from '../types';

type ViewMode = 'login' | 'signup';

export const LoginScreen: React.FC = () => {
  const { login, signup, loading } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form state
  const [loginRg, setLoginRg] = useState('');
  const [loginSenha, setLoginSenha] = useState('');

  // Signup form state
  const [signupData, setSignupData] = useState<Militar>({
    rg: '',
    grad: '',
    quadro: '',
    nome: '',
    unidade: '',
    senha: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginRg || !loginSenha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const result = await login(loginRg, loginSenha);
    if (!result.success) {
      setError(result.error || 'Erro ao fazer login.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate all fields
    if (!signupData.rg || !signupData.grad || !signupData.quadro ||
        !signupData.nome || !signupData.unidade || !signupData.senha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const result = await signup(signupData);
    if (result.success) {
      setSuccess('Cadastro realizado com sucesso! Faça login para continuar.');
      // Reset form and switch to login
      setSignupData({ rg: '', grad: '', quadro: '', nome: '', unidade: '', senha: '' });
      setTimeout(() => {
        setViewMode('login');
        setSuccess('');
      }, 2000);
    } else {
      setError(result.error || 'Erro ao cadastrar.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-bg">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-brand-blue-dark">
            GOCG - Controle de Permutas
          </h2>
          <p className="mt-2 text-center text-gray-600">
            {viewMode === 'login' ? 'Entre com suas credenciais' : 'Cadastre-se para acessar'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setViewMode('login');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
              viewMode === 'login'
                ? 'border-b-2 border-brand-blue text-brand-blue-dark'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setViewMode('signup');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
              viewMode === 'signup'
                ? 'border-b-2 border-brand-blue text-brand-blue-dark'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Login Form */}
        {viewMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="login-rg" className="block text-sm font-medium text-gray-700">
                RG
              </label>
              <input
                id="login-rg"
                type="text"
                value={loginRg}
                onChange={(e) => setLoginRg(e.target.value)}
                placeholder="Digite seu RG"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="login-senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="login-senha"
                type="password"
                value={loginSenha}
                onChange={(e) => setLoginSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              />
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            {success && <p className="text-sm text-green-600 text-center">{success}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue-dark hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        )}

        {/* Signup Form */}
        {viewMode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="signup-rg" className="block text-sm font-medium text-gray-700">
                RG
              </label>
              <input
                id="signup-rg"
                type="text"
                value={signupData.rg}
                onChange={(e) => setSignupData({ ...signupData, rg: e.target.value })}
                placeholder="Digite seu RG"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="signup-grad" className="block text-sm font-medium text-gray-700">
                Graduação
              </label>
              <input
                id="signup-grad"
                type="text"
                value={signupData.grad}
                onChange={(e) => setSignupData({ ...signupData, grad: e.target.value })}
                placeholder="Ex: CAP, 1° TEN"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="signup-quadro" className="block text-sm font-medium text-gray-700">
                Quadro
              </label>
              <input
                id="signup-quadro"
                type="text"
                value={signupData.quadro}
                onChange={(e) => setSignupData({ ...signupData, quadro: e.target.value })}
                placeholder="Ex: QOC, QOA"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="signup-nome" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                id="signup-nome"
                type="text"
                value={signupData.nome}
                onChange={(e) => setSignupData({ ...signupData, nome: e.target.value })}
                placeholder="Digite seu nome"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="signup-unidade" className="block text-sm font-medium text-gray-700">
                Unidade
              </label>
              <input
                id="signup-unidade"
                type="text"
                value={signupData.unidade}
                onChange={(e) => setSignupData({ ...signupData, unidade: e.target.value })}
                placeholder="Digite sua unidade"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="signup-senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="signup-senha"
                type="password"
                value={signupData.senha}
                onChange={(e) => setSignupData({ ...signupData, senha: e.target.value })}
                placeholder="Escolha uma senha"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              />
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            {success && <p className="text-sm text-green-600 text-center">{success}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue-dark hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
