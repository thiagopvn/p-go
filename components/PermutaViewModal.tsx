import React from 'react';
import type { Permuta } from '../types';
import { Modal } from './Modal';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { FileTextIcon } from './icons/FileTextIcon';

interface PermutaViewModalProps {
  permuta: Permuta;
  onClose: () => void;
}

const MilitarDetail: React.FC<{ militar: Permuta['militarEntra'], label: string }> = ({ militar, label }) => (
    <div>
        <h4 className="font-bold text-lg mb-2 text-brand-blue-dark">{label}</h4>
        <div className="text-sm space-y-1 text-gray-700">
            <p><span className="font-semibold">Nome:</span> {militar.nome}</p>
            <p><span className="font-semibold">RG:</span> {militar.rg}</p>
            <p><span className="font-semibold">Posto/Grad:</span> {militar.grad}</p>
            <p><span className="font-semibold">Quadro:</span> {militar.quadro}</p>
            <p><span className="font-semibold">Unidade:</span> {militar.unidade}</p>
        </div>
    </div>
);


export const PermutaViewModal: React.FC<PermutaViewModalProps> = ({ permuta, onClose }) => {
    const { updatePermutaStatus, setDocumentData } = useAppContext();
    const { role } = useAuth();

    const handleGenerateDocument = () => {
        setDocumentData([permuta]);
        onClose();
    };

    const handleStatusChange = async (status: Permuta['status']) => {
        try {
            await updatePermutaStatus(permuta.id, status);
            onClose();
        } catch (error) {
            console.error('Error updating permuta status:', error);
            alert('Erro ao atualizar status. Tente novamente.');
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Detalhes da Permuta" size="3xl">
            <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-bold text-brand-text mb-2">{permuta.funcao}</h3>
                    <p className="text-gray-600">Data: <span className="font-semibold">{new Date(permuta.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span></p>
                    <p className="text-gray-600">Status: <span className="font-semibold">{permuta.status}</span></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MilitarDetail militar={permuta.militarEntra} label="Militar que Entra" />
                    <MilitarDetail militar={permuta.militarSai} label="Militar que Sai" />
                </div>
                
                {(role === 'admin') && 
                  <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t">
                      <button
                          onClick={handleGenerateDocument}
                          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-light"
                      >
                         <FileTextIcon className="w-5 h-5 mr-2" />
                          Gerar Documento
                      </button>
                      {permuta.status === 'Pendente' && (
                          <>
                              <button onClick={() => handleStatusChange('Aprovada')} className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                                  Aprovar
                              </button>
                              <button onClick={() => handleStatusChange('Rejeitada')} className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                                  Rejeitar
                              </button>
                          </>
                      )}
                  </div>
                }
            </div>
        </Modal>
    );
};
