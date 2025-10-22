import * as React from 'react';
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
    subtitle: string;
    rg: string;
    onRgChange: (rg: string) => void;
    militar: Militar | null;
    onMilitarChange: (militar: Militar | null) => void;
    isRgReadOnly?: boolean;
    type: 'entra' | 'sai';
    autoFocus?: boolean;
}

const MilitarInputGroup: React.FC<MilitarInputGroupProps> = ({
    title,
    subtitle,
    rg,
    onRgChange,
    militar,
    onMilitarChange,
    isRgReadOnly = false,
    type,
    autoFocus = false
}) => {
    const { findMilitarByRg } = useAppContext();
    const [rgStatus, setRgStatus] = React.useState<'idle' | 'found' | 'not-found'>('idle');

    const handleRgBlur = () => {
        if (isRgReadOnly) return;
        if (!rg) {
            setRgStatus('idle');
            return;
        }
        const foundMilitar = findMilitarByRg(rg);
        if (foundMilitar) {
            setRgStatus('found');
            onMilitarChange(foundMilitar);
        } else {
            setRgStatus('not-found');
            onMilitarChange(null);
        }
    };

    const handleFieldChange = (field: keyof Militar, value: string) => {
        if (militar) {
            onMilitarChange({ ...militar, [field]: value });
        }
    };

    const bgColor = type === 'entra' ? 'bg-section-enter' : 'bg-section-exit';
    const borderColor = type === 'entra' ? 'border-section-enter-border' : 'border-section-exit-border';
    const textColor = type === 'entra' ? 'text-section-enter-border' : 'text-section-exit-border';
    const icon = type === 'entra' ? '➕' : '➖';

    return (
        <div className={`border-2 ${borderColor} rounded-xl p-5 space-y-3 ${bgColor} shadow-md transition-all duration-300 hover:shadow-lg`}>
            <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">{icon}</span>
                <div>
                    <h4 className={`font-bold text-lg ${textColor}`}>{title}</h4>
                    <p className="text-xs text-gray-600 italic">{subtitle}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        RG do Militar {!isRgReadOnly && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={rg}
                            onChange={(e) => onRgChange(e.target.value)}
                            onBlur={handleRgBlur}
                            readOnly={isRgReadOnly}
                            autoFocus={autoFocus}
                            placeholder={isRgReadOnly ? '' : "Digite o RG e pressione Tab"}
                            className={`mt-1 block w-full rounded-lg border-2 shadow-sm px-4 py-2.5 text-base font-medium transition-all duration-200
                                ${isRgReadOnly
                                    ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                                    : rgStatus === 'found'
                                        ? 'border-green-500 bg-white ring-2 ring-green-200'
                                        : rgStatus === 'not-found'
                                            ? 'border-yellow-500 bg-white ring-2 ring-yellow-200'
                                            : 'border-gray-300 bg-white hover:border-gray-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-accent'
                                }`}
                        />
                        {!isRgReadOnly && rgStatus === 'found' && (
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 text-xl">✓</span>
                        )}
                        {!isRgReadOnly && rgStatus === 'not-found' && (
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-600 text-xl">⚠</span>
                        )}
                    </div>
                    {!isRgReadOnly && rgStatus === 'found' && (
                        <p className="text-xs text-green-700 mt-1 font-medium">✓ Militar encontrado no sistema</p>
                    )}
                    {!isRgReadOnly && rgStatus === 'not-found' && (
                        <p className="text-xs text-yellow-700 mt-1 font-medium">⚠ RG não encontrado. Preencha os dados manualmente.</p>
                    )}
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Nome Completo</label>
                    <input
                        type="text"
                        value={militar?.nome || ''}
                        onChange={(e) => handleFieldChange('nome', e.target.value)}
                        placeholder="Preenchido automaticamente"
                        className="mt-1 block w-full rounded-lg border-2 border-gray-200 shadow-sm px-4 py-2.5 text-base bg-gray-50 font-medium"
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Posto/Graduação</label>
                    <input
                        type="text"
                        value={militar?.grad || ''}
                        onChange={(e) => handleFieldChange('grad', e.target.value)}
                        placeholder="Ex: Sd"
                        className="mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm px-4 py-2.5 text-base hover:border-gray-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-accent transition-all duration-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Quadro</label>
                    <input
                        type="text"
                        value={militar?.quadro || ''}
                        onChange={(e) => handleFieldChange('quadro', e.target.value)}
                        placeholder="Ex: QPCGC"
                        className="mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm px-4 py-2.5 text-base hover:border-gray-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-accent transition-all duration-200"
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Unidade</label>
                    <input
                        type="text"
                        value={militar?.unidade || ''}
                        onChange={(e) => handleFieldChange('unidade', e.target.value)}
                        placeholder="Ex: GOCG"
                        className="mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm px-4 py-2.5 text-base hover:border-gray-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-accent transition-all duration-200"
                    />
                </div>
            </div>
        </div>
    );
};


export const PermutaRequestModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addPermutas } = useAppContext();
  const { currentUser, role } = useAuth();

  const createNewRow = (): PermutaFormData => {
    const newRow: PermutaFormData = {
      id: Date.now(),
      data: '',
      funcao: FUNCOES[0],
      militarEntra: null,
      militarEntraRg: '',
      militarSai: null,
      militarSaiRg: ''
    };
    return newRow;
  };

  const [formRows, setFormRows] = React.useState<PermutaFormData[]>([createNewRow()]);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleUpdateRow = (id: number, field: keyof PermutaFormData, value: any) => {
    setFormRows(rows => rows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleAddRow = () => {
    setFormRows(rows => [...rows, createNewRow()]);
  };

  const handleRemoveRow = (id: number) => {
    setFormRows(rows => rows.filter(row => row.id !== id));
  };

  const isRowComplete = (row: PermutaFormData): boolean => {
    return !!(row.data && row.funcao && row.militarEntra && row.militarSai);
  };

  const handleSubmit = async () => {
    setError(null);
    const novasPermutas: Omit<Permuta, 'id' | 'status'>[] = [];

    for (const row of formRows) {
        if (!row.data) {
            setError('⚠️ Por favor, selecione a data do serviço para todas as permutas.');
            return;
        }
        if (!row.militarEntra) {
            setError('⚠️ Por favor, preencha o RG do militar que ENTRA no serviço.');
            return;
        }
        if (!row.militarSai) {
            setError('⚠️ Por favor, preencha o RG do militar que SAI do serviço.');
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
            setIsSubmitting(true);
            await addPermutas(novasPermutas);
            onClose();
        } catch (error) {
            setError('❌ Erro ao enviar solicitações. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="✨ Solicitar Permuta de Serviço" size="4xl">
      <div className="space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800 font-medium">
                <strong>Dica:</strong> Digite o RG e pressione Tab para buscar automaticamente os dados do militar.
              </p>
            </div>
          </div>
        </div>

        {formRows.map((row, index) => (
          <div key={row.id} className="p-6 border-2 border-gray-200 rounded-2xl relative bg-gradient-to-br from-white to-gray-50 shadow-lg transition-all duration-300 hover:shadow-xl">
            {formRows.length > 1 && (
                <button
                    onClick={() => handleRemoveRow(row.id)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-all duration-200"
                    title="Remover esta permuta"
                >
                    <TrashIcon className="w-6 h-6"/>
                </button>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-blue-dark text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                {index + 1}
              </div>
              <h3 className="text-2xl font-bold text-brand-blue-dark">Permuta #{index + 1}</h3>
              {isRowComplete(row) && (
                <span className="ml-auto bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <span>✓</span> Completo
                </span>
              )}
            </div>

            {/* Seção de Data e Função */}
            <div className="bg-section-date border-2 border-section-date-border rounded-xl p-5 mb-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">📅</span>
                <h4 className="font-bold text-lg text-section-date-border">Informações do Serviço</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Data do Serviço <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={row.data}
                    onChange={(e) => handleUpdateRow(row.id, 'data', e.target.value)}
                    className="mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm px-4 py-2.5 text-base font-medium hover:border-gray-400 focus:border-section-date-border focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                  />
                  {!row.data && (
                    <p className="text-xs text-gray-600 mt-1 italic">Selecione a data da escala</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Função/Serviço <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={row.funcao}
                      onChange={(e) => handleUpdateRow(row.id, 'funcao', e.target.value as Funcao)}
                      className="mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm px-4 py-2.5 text-base font-medium appearance-none hover:border-gray-400 focus:border-section-date-border focus:ring-2 focus:ring-yellow-200 transition-all duration-200 cursor-pointer"
                    >
                      {FUNCOES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                      <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 italic">Selecione o tipo de serviço</p>
                </div>
              </div>
            </div>

            {/* Seção de Militares */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <MilitarInputGroup
                    title="Militar que ENTRA"
                    subtitle="Quem vai assumir o serviço"
                    type="entra"
                    rg={row.militarEntraRg}
                    onRgChange={(value: string) => handleUpdateRow(row.id, 'militarEntraRg', value)}
                    militar={row.militarEntra}
                    onMilitarChange={(value: Militar | null) => handleUpdateRow(row.id, 'militarEntra', value)}
                    autoFocus={index === 0}
                />
                <MilitarInputGroup
                    title="Militar que SAI"
                    subtitle="Quem está sendo substituído"
                    type="sai"
                    rg={row.militarSaiRg}
                    onRgChange={(value: string) => handleUpdateRow(row.id, 'militarSaiRg', value)}
                    militar={row.militarSai}
                    onMilitarChange={(value: Militar | null) => handleUpdateRow(row.id, 'militarSai', value)}
                />
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-200">
          <button
            onClick={handleAddRow}
            className="flex items-center gap-2 text-base font-semibold text-brand-blue-dark hover:text-brand-blue bg-blue-50 hover:bg-blue-100 px-5 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <PlusIcon className="w-6 h-6"/>
            Adicionar outra permuta
          </button>

          <div className="flex items-center space-x-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 max-w-md">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}
              <button
                onClick={onClose}
                className="py-3 px-6 border-2 border-gray-300 rounded-lg shadow-sm text-base font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200"
              >
                  Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`py-3 px-8 border border-transparent rounded-lg shadow-md text-base font-bold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue
                  ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-brand-blue-dark hover:bg-brand-blue-light hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
              >
                  {isSubmitting ? '📤 Enviando...' : `✅ Enviar ${formRows.length > 1 ? `${formRows.length} Solicitações` : 'Solicitação'}`}
              </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
