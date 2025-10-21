import React from 'react';
import type { Permuta, Funcao } from '../types';

interface DocumentViewProps {
  permutas: Permuta[];
  onBack: () => void;
}

export const DocumentView: React.FC<DocumentViewProps> = ({ permutas, onBack }) => {
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

  // Check if permutas is valid and not empty
  if (!permutas || permutas.length === 0) {
    return (
      <div className="bg-gray-200 min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-white p-12 shadow-lg">
          <p className="text-center text-gray-600">Nenhuma permuta selecionada para gerar documento.</p>
          <div className="mt-8 flex justify-center">
            <button onClick={onBack} className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-colors">
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Debug: log permutas to check their structure
  console.log('Permutas recebidas:', permutas);
  console.log('Primeira permuta:', permutas[0]);

  // Group permutas by funcao
  const permutasByFuncao = permutas.reduce((acc, permuta) => {
    // Ensure funcao exists and is valid
    const funcao = permuta.funcao || "1º SOCORRO"; // Default to 1º SOCORRO if funcao is missing
    if (!acc[funcao]) {
      acc[funcao] = [];
    }
    acc[funcao].push(permuta);
    return acc;
  }, {} as Record<string, Permuta[]>);

  // Debug: log grouped permutas
  console.log('Permutas agrupadas por função:', permutasByFuncao);
  console.log('Funções encontradas:', Object.keys(permutasByFuncao));

  // Sort permutas within each function by date
  Object.keys(permutasByFuncao).forEach(funcao => {
    permutasByFuncao[funcao].sort((a, b) =>
      new Date(a.data).getTime() - new Date(b.data).getTime()
    );
  });

  // Define order of functions and get only the ones that have permutas
  const funcaoOrder: Funcao[] = ["1º SOCORRO", "2º SOCORRO", "BUSCA E SALVAMENTO"];
  const orderedFuncoes = Object.keys(permutasByFuncao).sort((a, b) => {
    const indexA = funcaoOrder.indexOf(a as Funcao);
    const indexB = funcaoOrder.indexOf(b as Funcao);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  console.log('Funções ordenadas para exibição:', orderedFuncoes);

  // If no functions were found, show error for debugging
  if (orderedFuncoes.length === 0) {
    console.error('Nenhuma função foi encontrada no agrupamento!');
    console.log('permutasByFuncao:', permutasByFuncao);
  }

  return (
    <div className="bg-gray-200 min-h-screen p-8 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white p-12 shadow-lg print:shadow-none" id="document-to-print">
        <div className="text-center font-serif text-black space-y-4 mb-10">
          <p className="text-lg font-bold">ESCALA DE SERVIÇO – COMANDANTE DE SOCORRO – ALTERAÇÃO – ANEXO XX – NOTA GOCG {noteNumber}</p>
        </div>

        {orderedFuncoes.length > 0 ? (
          orderedFuncoes.map((funcao, index) => (
            <div key={funcao} className={index > 0 ? 'mt-12' : ''}>
              <div className="text-center font-serif text-black mb-4">
                <p className="text-lg font-bold uppercase">{funcao}</p>
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
                  {permutasByFuncao[funcao] && permutasByFuncao[funcao].length > 0 ? (
                    permutasByFuncao[funcao].map((permuta) => (
                      <tr key={permuta.id}>
                        <td className="border border-black p-2 text-center">{new Date(permuta.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                        <td className="border border-black p-2 text-center">{formatMilitarString(permuta.militarEntra)}</td>
                        <td className="border border-black p-2 text-center">{formatRg(permuta.militarEntra.rg)}</td>
                        <td className="border border-black p-2 text-center">{formatMilitarString(permuta.militarSai)}</td>
                        <td className="border border-black p-2 text-center">{formatRg(permuta.militarSai.rg)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="border border-black p-2 text-center text-red-600">Erro: Nenhuma permuta encontrada para esta função</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <div className="text-center text-red-600 p-8">
            <p className="font-bold mb-2">Debug: Nenhuma função encontrada!</p>
            <p className="text-sm">Total de permutas: {permutas.length}</p>
            <p className="text-sm">Verifique o console do navegador (F12) para mais detalhes.</p>
          </div>
        )}
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