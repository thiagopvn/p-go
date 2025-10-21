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
      className="bg-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border-t-4 border-brand-blue"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm font-bold text-brand-blue">{permuta.funcao}</p>
            <p className="text-lg font-bold text-brand-text">{new Date(permuta.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[permuta.status]}`}>
            {permuta.status}
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="p-3 bg-red-50 rounded-md">
            <p className="font-bold text-red-600">SAI:</p>
            <p className="text-gray-800 truncate">{permuta.militarSai.grad} {permuta.militarSai.nome}</p>
            <p className="text-gray-500">RG: {permuta.militarSai.rg}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-md">
            <p className="font-bold text-green-600">ENTRA:</p>
            <p className="text-gray-800 truncate">{permuta.militarEntra.grad} {permuta.militarEntra.nome}</p>
            <p className="text-gray-500">RG: {permuta.militarEntra.rg}</p>
          </div>
        </div>
      </div>
    </div>
  );
};