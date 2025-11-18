import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { PermutaCard } from './PermutaCard';
import { PlusIcon } from './icons/PlusIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { ConfirmarPermutaModal } from './ConfirmarPermutaModal';
import type { Permuta } from '../types';

export const UserDashboard: React.FC = () => {
  const { permutas, openModal, setDocumentData, selectPermuta } = useAppContext();
  const { currentUser } = useAuth();
  const [selectedPermutaIds, setSelectedPermutaIds] = useState<Set<string>>(new Set());
  const [showConfirmarModal, setShowConfirmarModal] = useState(false);
  const [permutaParaConfirmar, setPermutaParaConfirmar] = useState<Permuta | null>(null);

  if (!currentUser) return null;

  const minhasPermutas = permutas.filter(p =>
    p.militarEntra.rg === currentUser.rg || p.militarSai.rg === currentUser.rg
  ).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  // Permutas aguardando confirmação do usuário
  const permutasAguardandoConfirmacao = minhasPermutas.filter(p => {
    const isMilitarEntra = p.militarEntra.rg === currentUser.rg;
    const isMilitarSai = p.militarSai.rg === currentUser.rg;

    if (isMilitarEntra && !p.confirmadaPorMilitarEntra) return true;
    if (isMilitarSai && !p.confirmadaPorMilitarSai) return true;
    return false;
  });

  const handleTogglePermuta = (permutaId: string) => {
    setSelectedPermutaIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(permutaId)) {
        newSet.delete(permutaId);
      } else {
        newSet.add(permutaId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedPermutaIds.size === minhasPermutas.length) {
      setSelectedPermutaIds(new Set());
    } else {
      setSelectedPermutaIds(new Set(minhasPermutas.map(p => p.id)));
    }
  };

  const handleGenerateBatchDocument = () => {
    const selectedPermutas = minhasPermutas.filter(p => selectedPermutaIds.has(p.id));
    if (selectedPermutas.length > 0) {
      setDocumentData(selectedPermutas);
    }
  };

  const handleConfirmarClick = (permuta: Permuta) => {
    setPermutaParaConfirmar(permuta);
    setShowConfirmarModal(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold text-brand-blue-dark">Bem-vindo, {currentUser.grad} {currentUser.nome}</h1>
        <p className="text-brand-text-light mt-1">Aqui você pode visualizar e solicitar suas permutas de serviço.</p>
      </div>

      {/* Seção de Permutas Aguardando Confirmação */}
      {permutasAguardandoConfirmacao.length > 0 && (
        <section className="mb-8">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-yellow-400 rounded-full p-3">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-yellow-900 mb-2">
                  Assinatura Eletrônica Pendente
                </h2>
                <p className="text-yellow-800 mb-4">
                  Você possui <strong>{permutasAguardandoConfirmacao.length}</strong> {permutasAguardandoConfirmacao.length === 1 ? 'permuta aguardando' : 'permutas aguardando'} sua confirmação.
                  É necessário assinar eletronicamente para validar a solicitação.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {permutasAguardandoConfirmacao.map(permuta => (
                    <div
                      key={permuta.id}
                      className="bg-white rounded-lg p-4 shadow-md border-2 border-yellow-300 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => handleConfirmarClick(permuta)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm font-bold text-brand-blue">{permuta.funcao}</p>
                          <p className="text-lg font-bold text-gray-900">
                            {new Date(permuta.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                          </p>
                        </div>
                        <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                          Pendente
                        </span>
                      </div>
                      <div className="space-y-2 text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 font-semibold">ENTRA:</span>
                          <span className="text-gray-800 truncate">{permuta.militarEntra.nome}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-600 font-semibold">SAI:</span>
                          <span className="text-gray-800 truncate">{permuta.militarSai.nome}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmarClick(permuta);
                        }}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-2 px-4 rounded-lg shadow transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Assinar Eletronicamente
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-brand-text">
            Minhas Solicitações
          </h2>
          <div className="flex gap-2">
            {minhasPermutas.length > 0 && (
              <>
                <button
                  onClick={handleSelectAll}
                  className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 transition-colors duration-200 text-white font-bold py-2 px-4 rounded-lg shadow-sm"
                >
                  {selectedPermutaIds.size === minhasPermutas.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
                </button>
                {selectedPermutaIds.size > 0 && (
                  <button
                    onClick={handleGenerateBatchDocument}
                    className="flex items-center justify-center bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white font-bold py-2 px-4 rounded-lg shadow-sm"
                  >
                    <FileTextIcon className="h-5 w-5 mr-2"/>
                    <span>Gerar Documento ({selectedPermutaIds.size})</span>
                  </button>
                )}
              </>
            )}
            <button
              onClick={() => openModal('requestPermuta')}
              className="flex items-center justify-center bg-brand-accent hover:bg-blue-500 transition-colors duration-200 text-white font-bold py-2 px-4 rounded-lg shadow-sm"
            >
              <PlusIcon className="h-5 w-5 mr-2"/>
              <span>Solicitar Permuta</span>
            </button>
          </div>
        </div>

        {minhasPermutas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {minhasPermutas.map(permuta => (
              <div key={permuta.id} className="relative">
                <input
                  type="checkbox"
                  checked={selectedPermutaIds.has(permuta.id)}
                  onChange={() => handleTogglePermuta(permuta.id)}
                  className="absolute top-2 left-2 z-10 w-5 h-5 cursor-pointer"
                />
                <PermutaCard permuta={permuta} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-brand-text">Nenhuma solicitação encontrada.</h3>
            <p className="text-brand-text-light mt-2">Clique em "Solicitar Permuta" para criar uma nova solicitação.</p>
          </div>
        )}
      </section>

      {/* Modal de Confirmação */}
      {showConfirmarModal && permutaParaConfirmar && (
        <ConfirmarPermutaModal
          permuta={permutaParaConfirmar}
          onClose={() => {
            setShowConfirmarModal(false);
            setPermutaParaConfirmar(null);
          }}
        />
      )}
    </div>
  );
};
