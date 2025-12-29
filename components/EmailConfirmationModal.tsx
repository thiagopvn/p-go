import React, { useState } from 'react';
import type { Permuta } from '../types';

interface EmailConfirmationModalProps {
  permuta: Permuta;
  onClose: () => void;
  onConfirm: (email: string) => void;
  isLoading?: boolean;
}

export const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  permuta,
  onClose,
  onConfirm,
  isLoading = false
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleConfirm = () => {
    setError('');

    if (!email.trim()) {
      setError('Digite o email para receber a confirmação da permuta');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, digite um email válido');
      return;
    }

    onConfirm(email);
  };

  const handleDecline = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[60] flex items-center justify-center p-2 sm:p-4"
      onClick={handleDecline}
    >
      <div
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com botão X */}
        <div className="bg-gradient-to-r from-brand-blue to-brand-accent p-3 sm:p-4 text-white rounded-t-xl sm:rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 className="text-base sm:text-lg font-bold">Receber por E-mail?</h2>
          </div>
          <button
            type="button"
            onClick={handleDecline}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-1.5 transition-all"
            disabled={isLoading}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body - Super compacto */}
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Campo de Email */}
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              Digite seu e-mail para receber a confirmação:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="seu.email@exemplo.com"
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-sm"
              disabled={isLoading}
            />
            {error && (
              <p className="text-red-600 text-xs mt-1">{error}</p>
            )}
          </div>

          {/* Resumo compacto */}
          <div className="bg-gray-50 rounded-lg p-2 text-xs flex justify-between">
            <span><strong>Data:</strong> {new Date(permuta.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
            <span><strong>Função:</strong> {permuta.funcao}</span>
          </div>

          {/* Botões */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDecline}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-3 rounded-lg text-sm active:scale-[0.98]"
              disabled={isLoading}
            >
              Não
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-2.5 px-3 rounded-lg text-sm disabled:opacity-50 flex items-center justify-center gap-1 active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                'Sim, Enviar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
