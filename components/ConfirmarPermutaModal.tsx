import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import type { Permuta } from '../types';
import { EmailConfirmationModal } from './EmailConfirmationModal';
import { Toast } from './Toast';
import { sendPermutaEmail } from '../firebase';

interface ConfirmarPermutaModalProps {
  permuta: Permuta;
  onClose: () => void;
}

export const ConfirmarPermutaModal: React.FC<ConfirmarPermutaModalProps> = ({ permuta, onClose }) => {
  const { confirmarPermuta } = useAppContext();
  const { currentUser } = useAuth();
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  if (!currentUser) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const formatMilitar = (militar: Permuta['militarEntra']) => {
    return `${militar.grad} ${militar.quadro} ${militar.nome}`;
  };

  const jaConfirmou =
    (permuta.militarEntra.rg === currentUser.rg && permuta.confirmadaPorMilitarEntra) ||
    (permuta.militarSai.rg === currentUser.rg && permuta.confirmadaPorMilitarSai);

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!senha) {
      setError('Por favor, digite sua senha.');
      setLoading(false);
      return;
    }

    const result = await confirmarPermuta(permuta.id, currentUser.rg, senha);

    if (result.success) {
      setSuccess(true);
      // Ao invés de fechar automaticamente, mostrar o modal de email
      setTimeout(() => {
        setShowEmailModal(true);
      }, 1500);
    } else {
      setError(result.error || 'Erro ao confirmar permuta.');
    }

    setLoading(false);
  };

  const handleSendEmail = async (email: string) => {
    setSendingEmail(true);
    try {
      console.log('📧 [FRONTEND] Iniciando envio de email para:', email);

      const result = await sendPermutaEmail({
        email,
        permuta: {
          data: permuta.data,
          funcao: permuta.funcao,
          militarEntra: {
            grad: permuta.militarEntra.grad,
            quadro: permuta.militarEntra.quadro,
            nome: permuta.militarEntra.nome,
            rg: permuta.militarEntra.rg,
            unidade: permuta.militarEntra.unidade,
          },
          militarSai: {
            grad: permuta.militarSai.grad,
            quadro: permuta.militarSai.quadro,
            nome: permuta.militarSai.nome,
            rg: permuta.militarSai.rg,
            unidade: permuta.militarSai.unidade,
          },
          confirmadaPorMilitarEntra: permuta.confirmadaPorMilitarEntra,
          confirmadaPorMilitarSai: permuta.confirmadaPorMilitarSai,
          dataConfirmacao: new Date().toISOString(),
        },
      });

      console.log('📧 [FRONTEND] Resultado da função:', result);

      if (result.data.success) {
        console.log('✅ [FRONTEND] Email enviado com sucesso! ID:', result.data.emailId);
        setToast({ message: 'Email enviado com sucesso!', type: 'success' });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        console.error('❌ [FRONTEND] Falha ao enviar email:', result.data.message);
        setToast({ message: result.data.message || 'Erro ao enviar email', type: 'error' });
        setSendingEmail(false);
      }
    } catch (error) {
      console.error('❌ [FRONTEND] Exceção ao enviar email:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setToast({ message: `Erro ao enviar email: ${errorMessage}`, type: 'error' });
      setSendingEmail(false);
    }
  };

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    onClose();
  };

  // Se o modal de email estiver aberto, renderizar apenas ele
  if (showEmailModal) {
    return (
      <>
        <EmailConfirmationModal
          permuta={permuta}
          onClose={handleCloseEmailModal}
          onConfirm={handleSendEmail}
          isLoading={sendingEmail}
        />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-blue to-brand-blue-light p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Assinatura Eletrônica</h2>
                <p className="text-sm text-blue-100">Confirme sua participação</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Detalhes da Permuta */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Data</span>
              <span className="text-sm font-bold text-gray-900">{formatDate(permuta.data)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Função</span>
              <span className="text-xs font-bold text-brand-blue bg-brand-accent bg-opacity-30 px-3 py-1 rounded-full">
                {permuta.funcao}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-green-600 mb-1">✓ ENTRA</p>
                  <p className="text-sm font-medium text-gray-900">{formatMilitar(permuta.militarEntra)}</p>
                  <p className="text-xs text-gray-500">RG: {permuta.militarEntra.rg}</p>
                  {permuta.confirmadaPorMilitarEntra && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Confirmado
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-600 mb-1">✗ SAI</p>
                  <p className="text-sm font-medium text-gray-900">{formatMilitar(permuta.militarSai)}</p>
                  <p className="text-xs text-gray-500">RG: {permuta.militarSai.rg}</p>
                  {permuta.confirmadaPorMilitarSai && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Confirmado
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {!success ? (
            <>
              {!jaConfirmou ? (
                <form onSubmit={handleConfirmar} className="space-y-4">
                  {/* Alerta de Responsabilidade */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Ao confirmar, você está assinando eletronicamente esta permuta e se responsabilizando pela alteração de escala.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Campo de Senha */}
                  <div>
                    <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                      Digite sua senha para confirmar
                    </label>
                    <div className="relative">
                      <input
                        id="senha"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Sua senha"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
                        disabled={loading}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Erro */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Botões */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all"
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Confirmando...
                        </>
                      ) : (
                        <>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Confirmar Permuta
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Já Confirmado</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Você já assinou eletronicamente esta permuta.
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold py-3 px-6 rounded-lg transition-all"
                  >
                    Fechar
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 animate-fadeIn">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
                <svg className="h-12 w-12 text-green-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Permuta Confirmada!</h3>
              <p className="text-gray-600 mb-1">Sua assinatura eletrônica foi registrada com sucesso.</p>
              <p className="text-sm text-gray-500">Fechando automaticamente...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
