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
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo/Title - responsive */}
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight truncate">
            <span className="hidden sm:inline">GOCG - Controle de Permutas</span>
            <span className="sm:hidden">GOCG Permutas</span>
          </h1>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
             {role === 'admin' && (
               <>
                 <button
                    onClick={() => openModal('manageMilitares')}
                    className="flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white font-semibold p-2 sm:py-2 sm:px-3 md:px-4 rounded-lg shadow-sm"
                    title="Gerenciar Militares"
                  >
                    <UserGroupIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden md:inline ml-2">Gerenciar Militares</span>
                  </button>
                  <button
                    onClick={() => openModal('requestPermuta')}
                    className="flex items-center justify-center bg-brand-accent hover:bg-blue-500 transition-colors duration-200 text-white font-bold p-2 sm:py-2 sm:px-3 md:px-4 rounded-lg shadow-sm"
                    title="Nova Permuta"
                  >
                    <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5"/>
                    <span className="hidden md:inline ml-2">Nova Permuta</span>
                  </button>
               </>
             )}
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 pl-2 sm:pl-3 border-l-2 border-white/20 ml-1 sm:ml-2">
                <div className="text-right hidden md:block">
                  <p className="font-semibold text-sm leading-tight">{currentUser?.nome}</p>
                  <p className="text-xs text-blue-200 leading-tight">{currentUser?.grad}</p>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center justify-center bg-white/10 hover:bg-red-500/50 transition-colors duration-200 text-white font-semibold p-1.5 sm:p-2 rounded-full shadow-sm"
                  aria-label="Sair"
                  title="Sair"
                >
                  <LogoutIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
          </div>
        </div>
      </div>
    </header>
  );
};
