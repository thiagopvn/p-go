import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GRADUACOES, QUADROS, UNIDADES } from '../constants';
import { CadastroFeedbackModal } from './CadastroFeedbackModal';

type ViewMode = 'login' | 'cadastro';

export const LoginScreen: React.FC = () => {
  const { login, register, loading } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackIsSuccess, setFeedbackIsSuccess] = useState(false);
  const [feedbackErrorMessage, setFeedbackErrorMessage] = useState('');

  // Debug do estado do modal
  useEffect(() => {
    console.log('🔍 DEBUG - Estado do modal mudou:', {
      showFeedbackModal,
      feedbackIsSuccess,
      feedbackErrorMessage,
      success,
      error,
      timestamp: new Date().toISOString()
    });
  }, [showFeedbackModal, feedbackIsSuccess, feedbackErrorMessage, success, error]);

  // Garantir que o modal permaneça visível
  useEffect(() => {
    if (success && !showFeedbackModal) {
      console.log('🔄 Reforçando abertura do modal de sucesso');
      setShowFeedbackModal(true);
      setFeedbackIsSuccess(true);
    }
  }, [success]);

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
      const errorMsg = 'Por favor, preencha todos os campos.';
      setError(errorMsg);
      setFeedbackIsSuccess(false);
      setFeedbackErrorMessage(errorMsg);
      setShowFeedbackModal(true);
      return;
    }

    // Validate password confirmation
    if (cadastroData.senha !== cadastroData.confirmarSenha) {
      const errorMsg = 'As senhas não coincidem.';
      setError(errorMsg);
      setFeedbackIsSuccess(false);
      setFeedbackErrorMessage(errorMsg);
      setShowFeedbackModal(true);
      return;
    }

    // Validate password length
    if (cadastroData.senha.length < 6) {
      const errorMsg = 'A senha deve ter pelo menos 6 caracteres.';
      setError(errorMsg);
      setFeedbackIsSuccess(false);
      setFeedbackErrorMessage(errorMsg);
      setShowFeedbackModal(true);
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

    console.log('Resultado do cadastro:', result);

    if (result.success) {
      console.log('Cadastro com sucesso! Mostrando modal...');
      // Salvar RG antes de limpar o form
      const savedRg = cadastroData.rg;

      // Mostrar modal de sucesso IMEDIATAMENTE
      setSuccess('Cadastro realizado com sucesso! Agora você pode fazer login.');
      setError(''); // Limpar qualquer erro anterior

      // Forçar o modal a permanecer aberto com setTimeout
      setTimeout(() => {
        setFeedbackIsSuccess(true);
        setFeedbackErrorMessage('');
        setShowFeedbackModal(true);
        console.log('🟢 Modal forçado a abrir após timeout');
      }, 100);

      // Reset form após um pequeno delay para não interferir com o modal
      setTimeout(() => {
        setCadastroData({ rg: '', grad: '', quadro: '', nome: '', unidade: '', senha: '', confirmarSenha: '' });
        // Pre-fill login RG
        setLoginRg(savedRg);
      }, 500);
    } else {
      console.log('Erro no cadastro! Mostrando modal de erro...');
      console.log('🔴 ANTES de setar modal - showFeedbackModal:', showFeedbackModal);
      // Mostrar modal de erro
      setFeedbackIsSuccess(false);
      setFeedbackErrorMessage(result.error || 'Erro ao cadastrar.');
      console.log('🔴 Chamando setShowFeedbackModal(true)...');
      setShowFeedbackModal(true);
      console.log('🔴 DEPOIS de setar modal - showFeedbackModal ainda é:', showFeedbackModal, '(valor antigo, novo valor estará no próximo render)');
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

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white py-2 px-4 flex items-center justify-center z-40 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 text-gray-700">
            <span className="text-lg">👤</span>
            <span className="text-xs">Aplicativo desenvolvido pelo 2º Ten Thiago Santos</span>
          </div>
          <a
            href="https://wa.me/5521967586628"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center gap-1 transition-colors text-xs font-medium"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp: (21) 96758-6628
          </a>
        </div>
      </div>

      {/* Modal de Erro/Sucesso Simples e Direto */}
      {(error || success) && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-[99999] flex items-center justify-center p-4">
          <div className="relative mx-auto border-0 w-full max-w-md shadow-2xl rounded-2xl bg-white">
            <div className="p-8">
              <div className="text-center">
                {/* Ícone */}
                <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
                  success ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {success ? (
                    <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>

                {/* Título */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {success ? 'Cadastro Realizado!' : 'Erro no Cadastro'}
                </h3>

                {/* Mensagem */}
                <p className="text-gray-700 mb-6">
                  {success || error}
                </p>

                {/* Botão */}
                <button
                  onClick={() => {
                    setError('');
                    setSuccess('');
                    if (success) {
                      setViewMode('login');
                    }
                  }}
                  className={`w-full px-6 py-3 font-semibold rounded-lg transition-all duration-200 shadow-sm ${
                    success
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {success ? 'Ir para Login' : 'Tentar Novamente'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Feedback do Cadastro - Mantido como backup */}
      {console.log('🎯 RENDERIZANDO CadastroFeedbackModal com props:', {
        isOpen: showFeedbackModal,
        isSuccess: feedbackIsSuccess,
        errorMessage: feedbackErrorMessage
      })}
      <CadastroFeedbackModal
        isOpen={showFeedbackModal}
        isSuccess={feedbackIsSuccess}
        errorMessage={feedbackErrorMessage}
        onClose={() => {
          setShowFeedbackModal(false);
          if (feedbackIsSuccess) {
            // Se sucesso, vai para login
            setViewMode('login');
            // RG já foi preenchido anteriormente
          }
          // Limpar mensagens
          setError('');
          setSuccess('');
        }}
      />
    </>
  );
};