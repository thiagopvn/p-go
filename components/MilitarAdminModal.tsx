import React, { useState } from 'react';
import { Modal } from './Modal';
import { useAppContext } from '../contexts/AppContext';
import type { Militar } from '../types';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';

const MilitarForm: React.FC<{ militar: Partial<Militar>, onSave: (militar: Militar) => void, onCancel: () => void }> = ({ militar: initialMilitar, onSave, onCancel }) => {
    const [militar, setMilitar] = useState<Partial<Militar>>(initialMilitar);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMilitar({ ...militar, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (militar.rg && militar.nome && militar.grad && militar.quadro && militar.unidade) {
            onSave(militar as Militar);
        }
    };
    
    return (
        <div className="p-4 bg-blue-50 rounded-lg my-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input name="rg" value={militar.rg || ''} onChange={handleChange} placeholder="RG" className="w-full p-2 border rounded" disabled={!!initialMilitar.rg} />
                <input name="nome" value={militar.nome || ''} onChange={handleChange} placeholder="Nome" className="w-full p-2 border rounded col-span-2" />
                <input name="grad" value={militar.grad || ''} onChange={handleChange} placeholder="Posto/Grad." className="w-full p-2 border rounded" />
                <input name="quadro" value={militar.quadro || ''} onChange={handleChange} placeholder="Quadro" className="w-full p-2 border rounded" />
                <input name="unidade" value={militar.unidade || ''} onChange={handleChange} placeholder="Unidade" className="w-full p-2 border rounded" />
            </div>
             <div className="flex justify-end space-x-2">
                <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
                <button onClick={handleSave} className="px-4 py-2 bg-brand-blue text-white rounded hover:bg-brand-blue-light">Salvar</button>
            </div>
        </div>
    );
};


export const MilitarAdminModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { militares, addMilitar, updateMilitar, deleteMilitar } = useAppContext();
    const [editingMilitar, setEditingMilitar] = useState<Partial<Militar> | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    
    const handleSave = async (updatedMilitar: Militar) => {
        try {
            if (isCreating) {
                await addMilitar(updatedMilitar);
            } else {
                await updateMilitar(updatedMilitar);
            }
            setEditingMilitar(null);
            setIsCreating(false);
        } catch (error) {
            console.error('Error saving militar:', error);
            alert('Erro ao salvar militar. Tente novamente.');
        }
    };

    const handleDelete = async (rg: string) => {
        if (window.confirm("Tem certeza que deseja remover este militar?")) {
            try {
                await deleteMilitar(rg);
            } catch (error) {
                console.error('Error deleting militar:', error);
                alert('Erro ao remover militar. Tente novamente.');
            }
        }
    };
    
    const handleAddNew = () => {
        setEditingMilitar({});
        setIsCreating(true);
    }
    
    const handleCancel = () => {
        setEditingMilitar(null);
        setIsCreating(false);
    }
    
    return (
        <Modal isOpen={true} onClose={onClose} title="Gerenciar Militares" size="4xl">
            <div className="flex justify-end mb-4">
                <button onClick={handleAddNew} className="flex items-center px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-light">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Adicionar Militar
                </button>
            </div>

            {(isCreating && editingMilitar) && <MilitarForm militar={editingMilitar} onSave={handleSave} onCancel={handleCancel} />}
            
            <div className="overflow-x-auto max-h-[60vh]">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">RG</th>
                            <th scope="col" className="px-6 py-3">Nome</th>
                            <th scope="col" className="px-6 py-3">Posto</th>
                            <th scope="col" className="px-6 py-3">Quadro</th>
                            <th scope="col" className="px-6 py-3">Unidade</th>
                            <th scope="col" className="px-6 py-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {militares.map(militar => (
                            editingMilitar && editingMilitar.rg === militar.rg ?
                            <tr key={militar.rg}><td colSpan={6}><MilitarForm militar={editingMilitar} onSave={handleSave} onCancel={handleCancel} /></td></tr> :
                            <tr key={militar.rg} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{militar.rg}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{militar.nome}</td>
                                <td className="px-6 py-4">{militar.grad}</td>
                                <td className="px-6 py-4">{militar.quadro}</td>
                                <td className="px-6 py-4">{militar.unidade}</td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button onClick={() => { setEditingMilitar(militar); setIsCreating(false); }} className="text-blue-600 hover:text-blue-800"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleDelete(militar.rg)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Modal>
    );
};
