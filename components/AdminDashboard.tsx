import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { PermutaCard } from './PermutaCard';
import { FileTextIcon } from './icons/FileTextIcon';

type TabType = 'pendentes' | 'processadas' | 'arquivadas';

export const AdminDashboard: React.FC = () => {
  const { permutas, setDocumentData, arquivarPermutas, desarquivarPermutas } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>('pendentes');
  const [selectedPendentesIds, setSelectedPendentesIds] = useState<Set<string>>(new Set());
  const [selectedProcessadasIds, setSelectedProcessadasIds] = useState<Set<string>>(new Set());
  const [selectedArquivadasIds, setSelectedArquivadasIds] = useState<Set<string>>(new Set());

  const pendentes = permutas.filter(p => p.status === 'Pendente' && !p.arquivada);
  const processadas = permutas.filter(p => p.status !== 'Pendente' && !p.arquivada);
  const arquivadas = permutas.filter(p => p.arquivada);

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

  const handleToggleProcessada = (permutaId: string) => {
    setSelectedProcessadasIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(permutaId)) {
        newSet.delete(permutaId);
      } else {
        newSet.add(permutaId);
      }
      return newSet;
    });
  };

  const handleToggleArquivada = (permutaId: string) => {
    setSelectedArquivadasIds(prev => {
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

  const handleSelectAllProcessadas = () => {
    if (selectedProcessadasIds.size === processadas.length) {
      setSelectedProcessadasIds(new Set());
    } else {
      setSelectedProcessadasIds(new Set(processadas.map(p => p.id)));
    }
  };

  const handleSelectAllArquivadas = () => {
    if (selectedArquivadasIds.size === arquivadas.length) {
      setSelectedArquivadasIds(new Set());
    } else {
      setSelectedArquivadasIds(new Set(arquivadas.map(p => p.id)));
    }
  };

  const handleGeneratePendentesDocument = () => {
    const selectedPermutas = pendentes.filter(p => selectedPendentesIds.has(p.id));
    if (selectedPermutas.length > 0) {
      setDocumentData(selectedPermutas);
    }
  };

  const handleGenerateProcessadasDocument = () => {
    const selectedPermutas = processadas.filter(p => selectedProcessadasIds.has(p.id));
    if (selectedPermutas.length > 0) {
      setDocumentData(selectedPermutas);
    }
  };

  const handleGenerateArquivadasDocument = () => {
    const selectedPermutas = arquivadas.filter(p => selectedArquivadasIds.has(p.id));
    if (selectedPermutas.length > 0) {
      setDocumentData(selectedPermutas);
    }
  };

  const handleArquivarProcessadas = async () => {
    if (selectedProcessadasIds.size > 0) {
      await arquivarPermutas(Array.from(selectedProcessadasIds));
      setSelectedProcessadasIds(new Set());
    }
  };

  const handleDesarquivar = async () => {
    if (selectedArquivadasIds.size > 0) {
      await desarquivarPermutas(Array.from(selectedArquivadasIds));
      setSelectedArquivadasIds(new Set());
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pendentes':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-brand-text">Solicitações Pendentes</h3>
                <p className="text-sm text-brand-text-light mt-1">
                  {pendentes.length} {pendentes.length === 1 ? 'solicitação aguardando' : 'solicitações aguardando'} análise
                </p>
              </div>
              {pendentes.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAllPendentes}
                    className="bg-gray-500 hover:bg-gray-600 transition-all duration-200 text-white font-medium py-2 px-4 rounded-lg shadow-sm text-sm"
                  >
                    {selectedPendentesIds.size === pendentes.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
                  </button>
                  {selectedPendentesIds.size > 0 && (
                    <button
                      onClick={handleGeneratePendentesDocument}
                      className="flex items-center bg-green-600 hover:bg-green-700 transition-all duration-200 text-white font-medium py-2 px-4 rounded-lg shadow-sm text-sm"
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
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-brand-text-light text-lg">Nenhuma solicitação pendente</p>
                <p className="text-brand-text-light text-sm mt-2">Todas as permutas foram processadas</p>
              </div>
            )}
          </div>
        );

      case 'processadas':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-brand-text">Permutas Processadas</h3>
                <p className="text-sm text-brand-text-light mt-1">
                  {processadas.length} {processadas.length === 1 ? 'permuta aprovada ou rejeitada' : 'permutas aprovadas ou rejeitadas'}
                </p>
              </div>
              {processadas.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAllProcessadas}
                    className="bg-gray-500 hover:bg-gray-600 transition-all duration-200 text-white font-medium py-2 px-4 rounded-lg shadow-sm text-sm"
                  >
                    {selectedProcessadasIds.size === processadas.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
                  </button>
                  {selectedProcessadasIds.size > 0 && (
                    <>
                      <button
                        onClick={handleGenerateProcessadasDocument}
                        className="flex items-center bg-green-600 hover:bg-green-700 transition-all duration-200 text-white font-medium py-2 px-4 rounded-lg shadow-sm text-sm"
                      >
                        <FileTextIcon className="h-5 w-5 mr-2"/>
                        <span>Gerar Documento ({selectedProcessadasIds.size})</span>
                      </button>
                      <button
                        onClick={handleArquivarProcessadas}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-medium py-2 px-4 rounded-lg shadow-sm text-sm"
                      >
                        <span>📦</span>
                        <span className="ml-2">Arquivar ({selectedProcessadasIds.size})</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            {processadas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {processadas.map(permuta => (
                  <div key={permuta.id} className="relative">
                    <input
                      type="checkbox"
                      checked={selectedProcessadasIds.has(permuta.id)}
                      onChange={() => handleToggleProcessada(permuta.id)}
                      className="absolute top-2 left-2 z-10 w-5 h-5 cursor-pointer"
                    />
                    <PermutaCard permuta={permuta} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-5xl mb-4">✅</div>
                <p className="text-brand-text-light text-lg">Nenhuma permuta processada</p>
                <p className="text-brand-text-light text-sm mt-2">Permutas aprovadas ou rejeitadas aparecerão aqui</p>
              </div>
            )}
          </div>
        );

      case 'arquivadas':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-brand-text">Permutas Arquivadas</h3>
                <p className="text-sm text-brand-text-light mt-1">
                  {arquivadas.length} {arquivadas.length === 1 ? 'permuta arquivada' : 'permutas arquivadas'} (somente consulta)
                </p>
              </div>
              {arquivadas.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAllArquivadas}
                    className="bg-gray-500 hover:bg-gray-600 transition-all duration-200 text-white font-medium py-2 px-4 rounded-lg shadow-sm text-sm"
                  >
                    {selectedArquivadasIds.size === arquivadas.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
                  </button>
                  {selectedArquivadasIds.size > 0 && (
                    <>
                      <button
                        onClick={handleGenerateArquivadasDocument}
                        className="flex items-center bg-green-600 hover:bg-green-700 transition-all duration-200 text-white font-medium py-2 px-4 rounded-lg shadow-sm text-sm"
                      >
                        <FileTextIcon className="h-5 w-5 mr-2"/>
                        <span>Gerar Documento ({selectedArquivadasIds.size})</span>
                      </button>
                      <button
                        onClick={handleDesarquivar}
                        className="flex items-center bg-orange-600 hover:bg-orange-700 transition-all duration-200 text-white font-medium py-2 px-4 rounded-lg shadow-sm text-sm"
                      >
                        <span>📤</span>
                        <span className="ml-2">Desarquivar ({selectedArquivadasIds.size})</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            {arquivadas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {arquivadas.map(permuta => (
                  <div key={permuta.id} className="relative opacity-90 hover:opacity-100 transition-opacity">
                    <input
                      type="checkbox"
                      checked={selectedArquivadasIds.has(permuta.id)}
                      onChange={() => handleToggleArquivada(permuta.id)}
                      className="absolute top-2 left-2 z-10 w-5 h-5 cursor-pointer"
                    />
                    <PermutaCard permuta={permuta} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-5xl mb-4">📦</div>
                <p className="text-brand-text-light text-lg">Nenhuma permuta arquivada</p>
                <p className="text-brand-text-light text-sm mt-2">Permutas arquivadas aparecerão aqui para consulta</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pendentes')}
            className={`flex-1 py-4 px-6 font-medium text-sm transition-all duration-200 relative ${
              activeTab === 'pendentes'
                ? 'text-brand-blue bg-brand-accent bg-opacity-10'
                : 'text-brand-text-light hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span>🕐</span>
              <span>Pendentes</span>
              {pendentes.length > 0 && (
                <span className="ml-1 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendentes.length}
                </span>
              )}
            </span>
            {activeTab === 'pendentes' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-blue"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab('processadas')}
            className={`flex-1 py-4 px-6 font-medium text-sm transition-all duration-200 relative ${
              activeTab === 'processadas'
                ? 'text-brand-blue bg-brand-accent bg-opacity-10'
                : 'text-brand-text-light hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span>✅</span>
              <span>Processadas</span>
              {processadas.length > 0 && (
                <span className="ml-1 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {processadas.length}
                </span>
              )}
            </span>
            {activeTab === 'processadas' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-blue"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab('arquivadas')}
            className={`flex-1 py-4 px-6 font-medium text-sm transition-all duration-200 relative ${
              activeTab === 'arquivadas'
                ? 'text-brand-blue bg-brand-accent bg-opacity-10'
                : 'text-brand-text-light hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span>📦</span>
              <span>Arquivadas</span>
              {arquivadas.length > 0 && (
                <span className="ml-1 bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {arquivadas.length}
                </span>
              )}
            </span>
            {activeTab === 'arquivadas' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-blue"></div>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {renderTabContent()}
      </div>
    </div>
  );
};