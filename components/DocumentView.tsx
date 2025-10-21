import React from 'react';
import type { Permuta } from '../types';

interface DocumentViewProps {
  permuta: Permuta;
  onBack: () => void;
}

export const DocumentView: React.FC<DocumentViewProps> = ({ permuta, onBack }) => {
  const formatMilitarString = (militar: Permuta['militarEntra']) => {
    return `${militar.grad} ${militar.quadro} ${militar.nome}`;
  };

  const formatRg = (rg: string) => {
    if (rg.length > 3) {
      return `${rg.slice(0, -3)}.${rg.slice(-3)}`;
    }
    return rg;
  };

  const handlePrint = () => {
    window.print();
  };
  
  const today = new Date();
  const noteNumber = `149/${today.getFullYear()}`; // Example note number

  return (
    <div className="bg-gray-200 min-h-screen p-8 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white p-12 shadow-lg print:shadow-none" id="document-to-print">
        <div className="text-center font-serif text-black space-y-4 mb-10">
          <p className="text-lg font-bold">ESCALA DE SERVIÇO – COMANDANTE DE SOCORRO – ALTERAÇÃO – ANEXO XX – NOTA GOCG {noteNumber}</p>
          <p className="text-lg font-bold uppercase">{permuta.funcao}</p>
        </div>

        <table className="w-full border-collapse border border-black text-black">
          <thead>
            <tr className="bg-gray-300">
              <th className="border border-black p-2 w-1/5 font-bold">DIA</th>
              <th colSpan={2} className="border border-black p-2 font-bold">ENTRA</th>
              <th colSpan={2} className="border border-black p-2 font-bold">SAI</th>
            </tr>
            <tr className="bg-gray-300">
              <th className="border border-black p-2"></th>
              <th className="border border-black p-2 font-bold">MILITAR</th>
              <th className="border border-black p-2 font-bold w-1/6">RG</th>
              <th className="border border-black p-2 font-bold">MILITAR</th>
              <th className="border border-black p-2 font-bold w-1/6">RG</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 text-center">{new Date(permuta.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
              <td className="border border-black p-2 text-center">{formatMilitarString(permuta.militarEntra)}</td>
              <td className="border border-black p-2 text-center">{formatRg(permuta.militarEntra.rg)}</td>
              <td className="border border-black p-2 text-center">{formatMilitarString(permuta.militarSai)}</td>
              <td className="border border-black p-2 text-center">{formatRg(permuta.militarSai.rg)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="max-w-4xl mx-auto mt-8 flex justify-end gap-4 print:hidden">
        <button onClick={onBack} className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-colors">
            Voltar
        </button>
        <button onClick={handlePrint} className="bg-brand-blue-dark text-white px-6 py-2 rounded-lg shadow-md hover:bg-brand-blue transition-colors">
            Imprimir / Salvar PDF
        </button>
      </div>

       <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #document-to-print, #document-to-print * {
              visibility: visible;
            }
            #document-to-print {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}</style>
    </div>
  );
};