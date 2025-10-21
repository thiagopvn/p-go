import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GRADUACOES, QUADROS, UNIDADES } from '../constants';

type ViewMode = 'login' | 'cadastro';

export const LoginScreen: React.FC = () => {
  const { login, register, loading } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Login form state
  const [loginRg, setLoginRg] = useState('');
  const [loginSenha, setLoginSenha] = useState('');

  // Cadastro form state
  const [cadastroData, setCadastroData] = useState({
    rg: '',
    grad: '',
    quadro: '',
    nome: '',
    unidade: '',
    senha: '',
    confirmarSenha: ''
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

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate all fields
    if (!cadastroData.rg || !cadastroData.grad || !cadastroData.quadro ||
        !cadastroData.nome || !cadastroData.unidade || !cadastroData.senha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    // Validate password confirmation
    if (cadastroData.senha !== cadastroData.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    // Validate password length
    if (cadastroData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const result = await register({
      rg: cadastroData.rg,
      senha: cadastroData.senha,
      grad: cadastroData.grad,
      quadro: cadastroData.quadro,
      nome: cadastroData.nome,
      unidade: cadastroData.unidade
    });

    if (result.success) {
      setSuccess('Cadastro realizado com sucesso! Redirecionando para login...');
      // Reset form and switch to login
      setCadastroData({ rg: '', grad: '', quadro: '', nome: '', unidade: '', senha: '', confirmarSenha: '' });
      setTimeout(() => {
        setViewMode('login');
        setSuccess('');
        // Pre-fill login RG
        setLoginRg(cadastroData.rg);
      }, 2000);
    } else {
      // Check if error message mentions contacting Ten Thiago Santos
      if (result.error?.includes('Ten Thiago Santos')) {
        setShowErrorModal(true);
      }
      setError(result.error || 'Erro ao cadastrar.');
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-blue-dark to-brand-blue">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl">
          <div>
            <h2 className="text-3xl font-extrabold text-center text-brand-blue-dark">
              GOCG - Permutas
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Sistema de Controle de Permutas
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setViewMode('login');
                setError('');
                setSuccess('');
                setShowErrorModal(false);
              }}
              className={`flex-1 py-2 px-4 text-center font-medium transition-all duration-200 ${
                viewMode === 'login'
                  ? 'border-b-2 border-brand-blue text-brand-blue-dark font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setViewMode('cadastro');
                setError('');
                setSuccess('');
                setShowErrorModal(false);
              }}
              className={`flex-1 py-2 px-4 text-center font-medium transition-all duration-200 ${
                viewMode === 'cadastro'
                  ? 'border-b-2 border-brand-blue text-brand-blue-dark font-semibold'
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
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  disabled={loading}
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
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  disabled={loading}
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                  {success}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue-dark hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
              <p className="text-center text-sm text-gray-600">
                Não tem cadastro? {' '}
                <button
                  type="button"
                  onClick={() => setViewMode('cadastro')}
                  className="text-brand-blue hover:text-brand-blue-dark font-medium"
                >
                  Cadastre-se aqui
                </button>
              </p>
            </form>
          )}

          {/* Cadastro Form */}
          {viewMode === 'cadastro' && (
            <form onSubmit={handleCadastro} className="space-y-4">
              <div>
                <label htmlFor="cadastro-rg" className="block text-sm font-medium text-gray-700">
                  RG <span className="text-red-500">*</span>
                </label>
                <input
                  id="cadastro-rg"
                  type="text"
                  value={cadastroData.rg}
                  onChange={(e) => setCadastroData({ ...cadastroData, rg: e.target.value })}
                  placeholder="Digite seu RG"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="cadastro-nome" className="block text-sm font-medium text-gray-700">
                  Nome de Guerra <span className="text-red-500">*</span>
                </label>
                <input
                  id="cadastro-nome"
                  type="text"
                  value={cadastroData.nome}
                  onChange={(e) => setCadastroData({ ...cadastroData, nome: e.target.value })}
                  placeholder="Digite seu nome de guerra"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="cadastro-grad" className="block text-sm font-medium text-gray-700">
                  Graduação <span className="text-red-500">*</span>
                </label>
                <select
                  id="cadastro-grad"
                  value={cadastroData.grad}
                  onChange={(e) => setCadastroData({ ...cadastroData, grad: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  disabled={loading}
                >
                  <option value="">Selecione...</option>
                  {GRADUACOES.map(grad => (
                    <option key={grad} value={grad}>{grad}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="cadastro-quadro" className="block text-sm font-medium text-gray-700">
                  Quadro <span className="text-red-500">*</span>
                </label>
                <select
                  id="cadastro-quadro"
                  value={cadastroData.quadro}
                  onChange={(e) => setCadastroData({ ...cadastroData, quadro: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  disabled={loading}
                >
                  <option value="">Selecione...</option>
                  {QUADROS.map(quadro => (
                    <option key={quadro} value={quadro}>{quadro}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="cadastro-unidade" className="block text-sm font-medium text-gray-700">
                  Unidade <span className="text-red-500">*</span>
                </label>
                <select
                  id="cadastro-unidade"
                  value={cadastroData.unidade}
                  onChange={(e) => setCadastroData({ ...cadastroData, unidade: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  disabled={loading}
                >
                  <option value="">Selecione...</option>
                  {UNIDADES.map(unidade => (
                    <option key={unidade} value={unidade}>{unidade}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="cadastro-senha" className="block text-sm font-medium text-gray-700">
                  Senha <span className="text-red-500">*</span>
                </label>
                <input
                  id="cadastro-senha"
                  type="password"
                  value={cadastroData.senha}
                  onChange={(e) => setCadastroData({ ...cadastroData, senha: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="cadastro-confirmar-senha" className="block text-sm font-medium text-gray-700">
                  Confirmar Senha <span className="text-red-500">*</span>
                </label>
                <input
                  id="cadastro-confirmar-senha"
                  type="password"
                  value={cadastroData.confirmarSenha}
                  onChange={(e) => setCadastroData({ ...cadastroData, confirmarSenha: e.target.value })}
                  placeholder="Digite a senha novamente"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue-dark hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>

              <p className="text-center text-sm text-gray-600">
                Já tem cadastro? {' '}
                <button
                  type="button"
                  onClick={() => setViewMode('login')}
                  className="text-brand-blue hover:text-brand-blue-dark font-medium"
                >
                  Faça login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Error Modal for data mismatch */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
                Dados Divergentes
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-600">
                  As informações fornecidas não correspondem aos dados cadastrados no sistema.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Por favor, verifique seus dados ou entre em contato com:
                </p>
                <p className="text-sm font-semibold text-brand-blue-dark mt-2">
                  Ten Thiago Santos
                </p>
                <p className="text-sm text-gray-500">
                  Desenvolvedor da Plataforma
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="px-4 py-2 bg-brand-blue text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  Entendi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};