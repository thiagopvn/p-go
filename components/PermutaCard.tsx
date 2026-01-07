import React, { useState } from 'react';
import type { Permuta } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

interface PermutaCardProps {
  permuta: Permuta;
}

const statusStyles: { [key in Permuta['status']]: string } = {
  Pendente: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  Aprovada: 'bg-green-100 text-green-800 border-green-400',
  Rejeitada: 'bg-red-100 text-red-800 border-red-400',
};

// Função para verificar se o militar não está cadastrado (dados incompletos)
const isMilitarNaoCadastrado = (militar: { grad?: string; nome?: string }) => {
  return militar.grad === '?' || militar.nome?.startsWith('[RG:');
};

export const PermutaCard: React.FC<PermutaCardProps> = ({ permuta }) => {
  const { selectPermuta, inverterMilitaresPermuta } = useAppContext();
  const { currentUser } = useAuth();
  const [isInverting, setIsInverting] = useState(false);

  // Verificar se algum militar não está cadastrado
  const militarSaiNaoCadastrado = isMilitarNaoCadastrado(permuta.militarSai);
  const militarEntraNaoCadastrado = isMilitarNaoCadastrado(permuta.militarEntra);
  const temMilitarNaoCadastrado = militarSaiNaoCadastrado || militarEntraNaoCadastrado;

  // Verificar se o usuário atual é o criador da permuta (quem solicitou)
  const isCriador = currentUser && (
    permuta.militarSai.rg === currentUser.rg ||
    permuta.militarEntra.rg === currentUser.rg
  );

  // Verificar se pode inverter (apenas pendente e não enviada)
  const podeInverter = isCriador &&
    permuta.status === 'Pendente' &&
    !permuta.enviada;

  const handleInverter = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar abrir o modal ao clicar no botão

    if (isInverting) return;

    setIsInverting(true);
    const result = await inverterMilitaresPermuta(permuta.id);

    if (!result.success) {
      alert(result.error || 'Erro ao inverter militares');
    }

    setIsInverting(false);
  };

  return (
    <div
      onClick={() => selectPermuta(permuta)}
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl sm:hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border-t-4 active:scale-[0.98] ${
        temMilitarNaoCadastrado ? 'border-orange-500' : permuta.enviada ? 'border-green-500' : 'border-brand-blue'
      }`}
    >
      {/* Alerta de militar não cadastrado */}
      {temMilitarNaoCadastrado && (
        <div className="bg-orange-100 border-b border-orange-200 px-3 py-1.5 flex items-center gap-2">
          <span className="text-orange-600 text-sm">⚠️</span>
          <span className="text-orange-700 text-[10px] sm:text-xs font-medium">
            Militar não cadastrado
          </span>
        </div>
      )}
      <div className="p-3 sm:p-4 md:p-5">
        {/* Header do card */}
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-xs sm:text-sm font-bold text-brand-blue truncate">{permuta.funcao}</p>
            <p className="text-base sm:text-lg font-bold text-brand-text">{new Date(permuta.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
            {permuta.enviada && permuta.dataEnvio && (
              <p className="text-[10px] sm:text-xs text-green-600 mt-0.5 sm:mt-1">
                ✓ Enviada em {new Date(permuta.dataEnvio).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 sm:gap-2 items-end flex-shrink-0">
            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full ${statusStyles[permuta.status]}`}>
              {permuta.status}
            </span>
            {permuta.enviada && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-green-100 text-green-800 border-green-400">
                📤 Enviada
              </span>
            )}
          </div>
        </div>

        {/* Botão de inverter militares */}
        {podeInverter && (
          <div className="mb-2 sm:mb-3">
            <button
              onClick={handleInverter}
              disabled={isInverting}
              className="w-full py-1.5 sm:py-2 px-3 sm:px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm active:scale-[0.98]"
              title="Inverter quem entra e quem sai na permuta"
            >
              {isInverting ? (
                <>
                  <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="hidden sm:inline">Invertendo...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <span className="hidden sm:inline">Inverter Militares</span>
                  <span className="sm:hidden">Inverter</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Militares info */}
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div className={`p-2 sm:p-3 rounded-md relative ${militarSaiNaoCadastrado ? 'bg-orange-50 border border-orange-300' : 'bg-red-50'}`}>
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-bold text-red-600 text-xs sm:text-sm">SAI:</p>
                  {militarSaiNaoCadastrado && (
                    <span className="text-orange-500 text-[10px]" title="Militar não cadastrado">⚠️</span>
                  )}
                </div>
                <p className={`truncate text-xs sm:text-sm ${militarSaiNaoCadastrado ? 'text-orange-700' : 'text-gray-800'}`}>
                  {permuta.militarSai.grad} {permuta.militarSai.nome}
                </p>
                <p className="text-gray-500 text-[10px] sm:text-xs">RG: {permuta.militarSai.rg}</p>
              </div>
              {permuta.confirmadaPorMilitarSai ? (
                <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-green-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm flex-shrink-0" title="Confirmada por assinatura eletrônica">
                  <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ✓
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-gray-400 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0" title="Aguardando confirmação">
                  <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              )}
            </div>
          </div>
          <div className={`p-2 sm:p-3 rounded-md relative ${militarEntraNaoCadastrado ? 'bg-orange-50 border border-orange-300' : 'bg-green-50'}`}>
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-bold text-green-600 text-xs sm:text-sm">ENTRA:</p>
                  {militarEntraNaoCadastrado && (
                    <span className="text-orange-500 text-[10px]" title="Militar não cadastrado">⚠️</span>
                  )}
                </div>
                <p className={`truncate text-xs sm:text-sm ${militarEntraNaoCadastrado ? 'text-orange-700' : 'text-gray-800'}`}>
                  {permuta.militarEntra.grad} {permuta.militarEntra.nome}
                </p>
                <p className="text-gray-500 text-[10px] sm:text-xs">RG: {permuta.militarEntra.rg}</p>
              </div>
              {permuta.confirmadaPorMilitarEntra ? (
                <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-green-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm flex-shrink-0" title="Confirmada por assinatura eletrônica">
                  <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ✓
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-gray-400 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0" title="Aguardando confirmação">
                  <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Badge de confirmação completa */}
        {permuta.confirmadaPorMilitarEntra && permuta.confirmadaPorMilitarSai && (
          <div className="mt-2 sm:mt-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-1.5 sm:py-2 rounded-lg shadow-sm">
            <p className="text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-2">
              <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">ASSINADA POR AMBOS OS MILITARES</span>
              <span className="sm:hidden">ASSINADA</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};