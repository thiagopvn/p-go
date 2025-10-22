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
      // Check if error message mentions contacting TEN Thiago Santos (with any case)
      if (result.error?.toLowerCase().includes('thiago santos') || result.error?.toLowerCase().includes('erro no cadastro')) {
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
                  Posto <span className="text-red-500">*</span>
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto border-0 w-full max-w-lg shadow-2xl rounded-2xl bg-white animate-fadeIn">
            <div className="p-8">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <svg className="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Erro no Cadastro
                </h3>
                <div className="space-y-4 mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {error}
                  </p>
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-4">
                    <p className="text-sm font-semibold text-brand-blue-dark mb-2">
                      Entre em contato com:
                    </p>
                    <p className="text-lg font-bold text-brand-blue-dark">
                      TEN Thiago Santos
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Desenvolvedor do Aplicativo
                    </p>
                    <a
                      href="tel:+5521967586628"
                      className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-sm"
                    >
                      <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      (21) 96758-6628
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all duration-200 shadow-sm"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};