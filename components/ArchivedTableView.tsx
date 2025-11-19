import React from 'react';
import { Permuta } from '../types';

interface ArchivedTableViewProps {
  arquivadas: Permuta[];
}

export const ArchivedTableView: React.FC<ArchivedTableViewProps> = ({ arquivadas }) => {
  // Ordenar as permutas por data (do mais antigo para o mais recente)
  const sortedPermutas = [...arquivadas].sort((a, b) => {
    const dateA = new Date(a.data);
    const dateB = new Date(b.data);
    return dateA.getTime() - dateB.getTime();
  });

  // Função para formatar a data no padrão brasileiro
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  // Função para formatar o nome e RG do militar
  const formatMilitar = (militar: any) => {
    if (!militar) return 'N/A';
    return `${militar.grad} ${militar.nome} - RG: ${militar.rg}`;
  };

  // Função para determinar a cor do status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Aprovada':
        return 'text-green-600 bg-green-50';
      case 'Rejeitada':
        return 'text-red-600 bg-red-50';
      case 'Confirmada':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (sortedPermutas.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="text-5xl mb-4">📊</div>
        <p className="text-brand-text-light text-lg">Nenhuma permuta arquivada para exibir</p>
        <p className="text-brand-text-light text-sm mt-2">As permutas arquivadas aparecerão nesta tabela</p>
      </div>
    );
  }

  return (
    <div>
      {/* Cabeçalho da seção */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-brand-text">Tabela de Permutas Arquivadas</h3>
        <p className="text-sm text-brand-text-light mt-1">
          Visualização em tabela de {sortedPermutas.length} {sortedPermutas.length === 1 ? 'permuta arquivada' : 'permutas arquivadas'} (ordenadas por data)
        </p>
      </div>

      {/* Container da tabela com scroll horizontal em telas pequenas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Cabeçalho da tabela */}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Data do Serviço
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Função de Serviço
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Militar que Sai
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Militar que Entra
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>

            {/* Corpo da tabela */}
            <tbody className="divide-y divide-gray-200">
              {sortedPermutas.map((permuta, index) => (
                <tr
                  key={permuta.id}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-brand-accent hover:bg-opacity-5 transition-colors duration-150`}
                >
                  {/* Data do Serviço */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(permuta.data)}
                    </div>
                  </td>

                  {/* Função de Serviço */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">
                      {permuta.funcao || 'N/A'}
                    </div>
                  </td>

                  {/* Militar que Sai */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">
                      {formatMilitar(permuta.militarSai)}
                    </div>
                    {permuta.militarSai?.unidade && (
                      <div className="text-xs text-gray-500 mt-1">
                        {permuta.militarSai.unidade}
                      </div>
                    )}
                  </td>

                  {/* Militar que Entra */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">
                      {formatMilitar(permuta.militarEntra)}
                    </div>
                    {permuta.militarEntra?.unidade && (
                      <div className="text-xs text-gray-500 mt-1">
                        {permuta.militarEntra.unidade}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(permuta.status)}`}>
                      {permuta.status}
                    </span>
                    {permuta.confirmadaPorMilitarEntra && permuta.confirmadaPorMilitarSai && (
                      <div className="mt-1">
                        <span className="text-xs text-green-600">✓ Confirmada</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rodapé informativo */}
      <div className="mt-4 text-sm text-brand-text-light text-center">
        Exibindo {sortedPermutas.length} {sortedPermutas.length === 1 ? 'permuta' : 'permutas'} ordenadas da mais antiga para a mais recente
      </div>
    </div>
  );
};