import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { PermutaCard } from './PermutaCard';
import { PlusIcon } from './icons/PlusIcon';

export const UserDashboard: React.FC = () => {
  const { permutas, openModal } = useAppContext();
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const minhasPermutas = permutas.filter(p => 
    p.militarEntra.rg === currentUser.rg || p.militarSai.rg === currentUser.rg
  ).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  return (
    <div className="container mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold text-brand-blue-dark">Bem-vindo, {currentUser.grad} {currentUser.nome}</h1>
        <p className="text-brand-text-light mt-1">Aqui você pode visualizar e solicitar suas permutas de serviço.</p>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-brand-text">
            Minhas Solicitações
          </h2>
           <button
              onClick={() => openModal('requestPermuta')}
              className="flex items-center justify-center bg-brand-accent hover:bg-blue-500 transition-colors duration-200 text-white font-bold py-2 px-4 rounded-lg shadow-sm"
            >
              <PlusIcon className="h-5 w-5 mr-2"/>
              <span>Solicitar Permuta</span>
            </button>
        </div>
        
        {minhasPermutas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {minhasPermutas.map(permuta => (
              <PermutaCard key={permuta.id} permuta={permuta} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold text-brand-text">Nenhuma solicitação encontrada.</h3>
            <p className="text-brand-text-light mt-2">Clique em "Solicitar Permuta" para criar uma nova solicitação.</p>
          </div>
        )}
      </section>
    </div>
  );
};
