import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { PermutaCard } from './PermutaCard';
import { PlusIcon } from './icons/PlusIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import type { Permuta } from '../types';

export const UserDashboard: React.FC = () => {
  const { permutas, openModal, setDocumentData } = useAppContext();
  const { currentUser } = useAuth();
  const [selectedPermutaIds, setSelectedPermutaIds] = useState<Set<string>>(new Set());

  if (!currentUser) return null;

  const minhasPermutas = permutas.filter(p =>
    p.militarEntra.rg === currentUser.rg || p.militarSai.rg === currentUser.rg
  ).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

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

  return (
    <div className="container mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold text-brand-blue-dark">Bem-vindo, {currentUser.grad} {currentUser.nome}</h1>
        <p className="text-brand-text-light mt-1">Aqui você pode visualizar e solicitar suas permutas de serviço.</p>
      </div>

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
    </div>
  );
};
