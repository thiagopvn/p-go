import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { PermutaCard } from './PermutaCard';

export const AdminDashboard: React.FC = () => {
  const { permutas } = useAppContext();

  const pendentes = permutas.filter(p => p.status === 'Pendente');
  const historico = permutas.filter(p => p.status !== 'Pendente');

  return (
    <div className="container mx-auto">
      <section>
        <h2 className="text-2xl font-bold text-brand-text mb-4 border-b-2 border-brand-accent pb-2">
          Solicitações Pendentes
        </h2>
        {pendentes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pendentes.map(permuta => (
              <PermutaCard key={permuta.id} permuta={permuta} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-brand-text-light">Nenhuma solicitação de permuta pendente.</p>
          </div>
        )}
      </section>
      
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-brand-text mb-4 border-b-2 border-gray-300 pb-2">
          Histórico de Solicitações
        </h2>
        {historico.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {historico.map(permuta => (
              <PermutaCard key={permuta.id} permuta={permuta} />
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