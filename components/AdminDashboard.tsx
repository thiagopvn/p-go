import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { PermutaCard } from './PermutaCard';
import { FileTextIcon } from './icons/FileTextIcon';

export const AdminDashboard: React.FC = () => {
  const { permutas, setDocumentData } = useAppContext();
  const [selectedPendentesIds, setSelectedPendentesIds] = useState<Set<string>>(new Set());
  const [selectedHistoricoIds, setSelectedHistoricoIds] = useState<Set<string>>(new Set());

  const pendentes = permutas.filter(p => p.status === 'Pendente');
  const historico = permutas.filter(p => p.status !== 'Pendente');

  const handleTogglePendente = (permutaId: string) => {
    setSelectedPendentesIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(permutaId)) {
        newSet.delete(permutaId);
      } else {
        newSet.add(permutaId);
      }
      return newSet;
    });
  };

  const handleToggleHistorico = (permutaId: string) => {
    setSelectedHistoricoIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(permutaId)) {
        newSet.delete(permutaId);
      } else {
        newSet.add(permutaId);
      }
      return newSet;
    });
  };

  const handleSelectAllPendentes = () => {
    if (selectedPendentesIds.size === pendentes.length) {
      setSelectedPendentesIds(new Set());
    } else {
      setSelectedPendentesIds(new Set(pendentes.map(p => p.id)));
    }
  };

  const handleSelectAllHistorico = () => {
    if (selectedHistoricoIds.size === historico.length) {
      setSelectedHistoricoIds(new Set());
    } else {
      setSelectedHistoricoIds(new Set(historico.map(p => p.id)));
    }
  };

  const handleGeneratePendentesDocument = () => {
    const selectedPermutas = pendentes.filter(p => selectedPendentesIds.has(p.id));
    if (selectedPermutas.length > 0) {
      setDocumentData(selectedPermutas);
    }
  };

  const handleGenerateHistoricoDocument = () => {
    const selectedPermutas = historico.filter(p => selectedHistoricoIds.has(p.id));
    if (selectedPermutas.length > 0) {
      setDocumentData(selectedPermutas);
    }
  };

  return (
    <div className="container mx-auto">
      <section>
        <div className="flex justify-between items-center mb-4 border-b-2 border-brand-accent pb-2">
          <h2 className="text-2xl font-bold text-brand-text">
            Solicitações Pendentes
          </h2>
          {pendentes.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleSelectAllPendentes}
                className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 transition-colors duration-200 text-white font-bold py-2 px-4 rounded-lg shadow-sm text-sm"
              >
                {selectedPendentesIds.size === pendentes.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
              </button>
              {selectedPendentesIds.size > 0 && (
                <button
                  onClick={handleGeneratePendentesDocument}
                  className="flex items-center justify-center bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white font-bold py-2 px-4 rounded-lg shadow-sm text-sm"
                >
                  <FileTextIcon className="h-5 w-5 mr-2"/>
                  <span>Gerar Documento ({selectedPendentesIds.size})</span>
                </button>
              )}
            </div>
          )}
        </div>
        {pendentes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pendentes.map(permuta => (
              <div key={permuta.id} className="relative">
                <input
                  type="checkbox"
                  checked={selectedPendentesIds.has(permuta.id)}
                  onChange={() => handleTogglePendente(permuta.id)}
                  className="absolute top-2 left-2 z-10 w-5 h-5 cursor-pointer"
                />
                <PermutaCard permuta={permuta} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-brand-text-light">Nenhuma solicitação de permuta pendente.</p>
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="flex justify-between items-center mb-4 border-b-2 border-gray-300 pb-2">
          <h2 className="text-2xl font-bold text-brand-text">
            Histórico de Solicitações
          </h2>
          {historico.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleSelectAllHistorico}
                className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 transition-colors duration-200 text-white font-bold py-2 px-4 rounded-lg shadow-sm text-sm"
              >
                {selectedHistoricoIds.size === historico.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
              </button>
              {selectedHistoricoIds.size > 0 && (
                <button
                  onClick={handleGenerateHistoricoDocument}
                  className="flex items-center justify-center bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white font-bold py-2 px-4 rounded-lg shadow-sm text-sm"
                >
                  <FileTextIcon className="h-5 w-5 mr-2"/>
                  <span>Gerar Documento ({selectedHistoricoIds.size})</span>
                </button>
              )}
            </div>
          )}
        </div>
        {historico.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {historico.map(permuta => (
              <div key={permuta.id} className="relative">
                <input
                  type="checkbox"
                  checked={selectedHistoricoIds.has(permuta.id)}
                  onChange={() => handleToggleHistorico(permuta.id)}
                  className="absolute top-2 left-2 z-10 w-5 h-5 cursor-pointer"
                />
                <PermutaCard permuta={permuta} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-brand-text-light">Nenhuma solicitação no histórico.</p>
          </div>
        )}
      </section>
    </div>
  );
};