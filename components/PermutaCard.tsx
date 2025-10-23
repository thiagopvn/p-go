import React from 'react';
import type { Permuta } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface PermutaCardProps {
  permuta: Permuta;
}

const statusStyles: { [key in Permuta['status']]: string } = {
  Pendente: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  Aprovada: 'bg-green-100 text-green-800 border-green-400',
  Rejeitada: 'bg-red-100 text-red-800 border-red-400',
};

export const PermutaCard: React.FC<PermutaCardProps> = ({ permuta }) => {
  const { selectPermuta } = useAppContext();

  return (
    <div
      onClick={() => selectPermuta(permuta)}
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border-t-4 ${
        permuta.enviada ? 'border-green-500' : 'border-brand-blue'
      }`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <p className="text-sm font-bold text-brand-blue">{permuta.funcao}</p>
            <p className="text-lg font-bold text-brand-text">{new Date(permuta.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
            {permuta.enviada && permuta.dataEnvio && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Enviada em {new Date(permuta.dataEnvio).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 items-end">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[permuta.status]}`}>
              {permuta.status}
            </span>
            {permuta.enviada && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border-green-400">
                📤 Enviada
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="p-3 bg-red-50 rounded-md relative">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-bold text-red-600">SAI:</p>
                <p className="text-gray-800 truncate">{permuta.militarSai.grad} {permuta.militarSai.nome}</p>
                <p className="text-gray-500 text-xs">RG: {permuta.militarSai.rg}</p>
              </div>
              {permuta.confirmadaPorMilitarSai ? (
                <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm" title="Confirmada por assinatura eletrônica">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ✓
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded-full" title="Aguardando confirmação">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              )}
            </div>
          </div>
          <div className="p-3 bg-green-50 rounded-md relative">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-bold text-green-600">ENTRA:</p>
                <p className="text-gray-800 truncate">{permuta.militarEntra.grad} {permuta.militarEntra.nome}</p>
                <p className="text-gray-500 text-xs">RG: {permuta.militarEntra.rg}</p>
              </div>
              {permuta.confirmadaPorMilitarEntra ? (
                <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm" title="Confirmada por assinatura eletrônica">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ✓
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded-full" title="Aguardando confirmação">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Badge de confirmação completa */}
        {permuta.confirmadaPorMilitarEntra && permuta.confirmadaPorMilitarSai && (
          <div className="mt-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-2 rounded-lg shadow-sm">
            <p className="text-xs font-bold flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              ASSINADA POR AMBOS OS MILITARES
            </p>
          </div>
        )}
      </div>
    </div>
  );
};