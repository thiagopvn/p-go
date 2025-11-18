import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { PlusIcon } from './icons/PlusIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { LogoutIcon } from './icons/LogoutIcon';

export const Header: React.FC = () => {
  const { openModal } = useAppContext();
  const { currentUser, role, logout } = useAuth();

  return (
    <header className="bg-brand-blue-dark shadow-md text-white">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-20">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            GOCG - Controle de Permutas
          </h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
             {role === 'admin' && (
               <>
                 <button
                    onClick={() => openModal('manageMilitares')}
                    className="flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white font-semibold py-2 px-4 rounded-lg shadow-sm"
                  >
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Gerenciar Militares</span>
                  </button>
                  <button
                    onClick={() => openModal('requestPermuta')}
                    className="flex items-center justify-center bg-brand-accent hover:bg-blue-500 transition-colors duration-200 text-white font-bold py-2 px-4 rounded-lg shadow-sm"
                  >
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    <span className="hidden sm:inline">Nova Permuta</span>
                    <span className="sm:hidden">Nova</span>
                  </button>
               </>
             )}
              <div className="flex items-center space-x-3 pl-3 border-l-2 border-white/20 ml-2">
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-sm leading-tight">{currentUser?.nome}</p>
                  <p className="text-xs text-blue-200 leading-tight">{currentUser?.grad}</p>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center justify-center bg-white/10 hover:bg-red-500/50 transition-colors duration-200 text-white font-semibold p-2 rounded-full shadow-sm"
                  aria-label="Sair"
                >
                  <LogoutIcon className="h-5 w-5" />
                </button>
              </div>
          </div>
        </div>
      </div>
    </header>
  );
};
