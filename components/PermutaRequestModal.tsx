import React, { useState } from 'react';
import { Modal } from './Modal';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { FUNCOES } from '../constants';
import type { Funcao, Militar, Permuta } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface PermutaFormData {
  id: number;
  data: string;
  funcao: Funcao;
  militarEntraRg: string;
  militarEntra: Militar | null;
  militarSaiRg: string;
  militarSai: Militar | null;
}

interface MilitarInputGroupProps {
    title: string;
    rg: string;
    onRgChange: (rg: string) => void;
    militar: Militar | null;
    onMilitarChange: (militar: Militar | null) => void;
    isRgReadOnly?: boolean;
}

const MilitarInputGroup: React.FC<MilitarInputGroupProps> = ({ title, rg, onRgChange, militar, onMilitarChange, isRgReadOnly = false }) => {
    const { findMilitarByRg } = useAppContext();

    const handleRgBlur = () => {
        if (isRgReadOnly) return;
        const foundMilitar = findMilitarByRg(rg);
        onMilitarChange(foundMilitar || null);
    };

    const handleFieldChange = (field: keyof Militar, value: string) => {
        if (militar) {
            onMilitarChange({ ...militar, [field]: value });
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
            <h4 className="font-semibold text-lg text-gray-700">{title}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">RG</label>
                    <input
                        type="text"
                        value={rg}
                        onChange={(e) => onRgChange(e.target.value)}
                        onBlur={handleRgBlur}
                        readOnly={isRgReadOnly}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm ${isRgReadOnly ? 'bg-gray-200' : ''}`}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input type="text" value={militar?.nome || ''} onChange={(e) => handleFieldChange('nome', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm bg-gray-200" readOnly/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Posto/Grad.</label>
                    <input type="text" value={militar?.grad || ''} onChange={(e) => handleFieldChange('grad', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Quadro</label>
                    <input type="text" value={militar?.quadro || ''} onChange={(e) => handleFieldChange('quadro', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm"/>
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Unidade</label>
                    <input type="text" value={militar?.unidade || ''} onChange={(e) => handleFieldChange('unidade', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm"/>
                </div>
            </div>
        </div>
    );
};


export const PermutaRequestModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addPermutas } = useAppContext();
  const { currentUser, role } = useAuth();

  const createNewRow = (): PermutaFormData => {
    const newRow: PermutaFormData = { id: Date.now(), data: '', funcao: FUNCOES[0], militarEntra: null, militarEntraRg: '', militarSai: null, militarSaiRg: '' };
    if (role === 'user' && currentUser) {
      newRow.militarSai = currentUser;
      newRow.militarSaiRg = currentUser.rg;
    }
    return newRow;
  };
  
  const [formRows, setFormRows] = useState<PermutaFormData[]>([createNewRow()]);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateRow = (id: number, field: keyof PermutaFormData, value: any) => {
    setFormRows(rows => rows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleAddRow = () => {
    setFormRows(rows => [...rows, createNewRow()]);
  };
  
  const handleRemoveRow = (id: number) => {
    setFormRows(rows => rows.filter(row => row.id !== id));
  };
  
  const handleSubmit = async () => {
    setError(null);
    const novasPermutas: Omit<Permuta, 'id' | 'status'>[] = [];

    for (const row of formRows) {
        if (!row.data || !row.militarEntra || !row.militarSai) {
            setError('Todos os campos são obrigatórios para todas as permutas.');
            return;
        }
        novasPermutas.push({
            data: row.data,
            funcao: row.funcao,
            militarEntra: row.militarEntra,
            militarSai: row.militarSai,
        });
    }

    if (novasPermutas.length > 0) {
        try {
            await addPermutas(novasPermutas);
            onClose();
        } catch (error) {
            setError('Erro ao enviar solicitações. Tente novamente.');
        }
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Solicitar Permuta de Serviço" size="4xl">
      <div className="space-y-6">
        {formRows.map((row, index) => (
          <div key={row.id} className="p-4 border rounded-lg relative bg-white shadow-sm">
            {formRows.length > 1 && (
                <button onClick={() => handleRemoveRow(row.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                    <TrashIcon className="w-5 h-5"/>
                </button>
            )}
            <h3 className="text-xl font-bold mb-4 text-brand-blue">Permuta #{index + 1}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Data do Serviço</label>
                <input type="date" value={row.data} onChange={(e) => handleUpdateRow(row.id, 'data', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Função</label>
                <select value={row.funcao} onChange={(e) => handleUpdateRow(row.id, 'funcao', e.target.value as Funcao)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm">
                  {FUNCOES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <MilitarInputGroup 
                    title="Militar que ENTRA no serviço"
                    rg={row.militarEntraRg}
                    onRgChange={(value) => handleUpdateRow(row.id, 'militarEntraRg', value)}
                    militar={row.militarEntra}
                    onMilitarChange={(value) => handleUpdateRow(row.id, 'militarEntra', value)}
                />
                <MilitarInputGroup 
                    title="Militar que SAI do serviço"
                    rg={row.militarSaiRg}
                    onRgChange={(value) => handleUpdateRow(row.id, 'militarSaiRg', value)}
                    militar={row.militarSai}
                    onMilitarChange={(value) => handleUpdateRow(row.id, 'militarSai', value)}
                    isRgReadOnly={role === 'user'}
                />
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center mt-6 pt-6 border-t">
          <button onClick={handleAddRow} className="flex items-center text-sm font-medium text-brand-blue-dark hover:text-brand-blue">
            <PlusIcon className="w-5 h-5 mr-1"/>
            Adicionar outra permuta
          </button>
          
          <div className="flex items-center space-x-3">
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Cancelar
              </button>
              <button onClick={handleSubmit} className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue-dark hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
                  Enviar Solicitações
              </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
