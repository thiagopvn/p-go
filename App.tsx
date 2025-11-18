import React from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useAppContext } from './contexts/AppContext';
import { useAuth } from './contexts/AuthContext';
import { PermutaRequestModal } from './components/PermutaRequestModal';
import { MilitarAdminModal } from './components/MilitarAdminModal';
import { DocumentView } from './components/DocumentView';
import { PermutaViewModal } from './components/PermutaViewModal';
import { LoginScreen } from './components/LoginScreen';

const App: React.FC = () => {
  const {
    activeModal,
    closeModal,
    documentData,
    clearDocumentData,
    selectedPermuta,
    clearSelectedPermuta,
    loading: appLoading
  } = useAppContext();
  const { currentUser, role, loading: authLoading } = useAuth();

  // Show loading state while data is being fetched
  if (appLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-blue mx-auto mb-4"></div>
          <p className="text-brand-blue-dark text-lg font-semibold">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen />;
  }

  if (documentData && documentData.length > 0) {
    return <DocumentView permutas={documentData} onBack={clearDocumentData} />;
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans">
      <Header />
      <main className="py-6 pb-20">
        {role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
      </main>

      <Footer />

      {activeModal === 'requestPermuta' && (
        <PermutaRequestModal onClose={closeModal} />
      )}

      {activeModal === 'manageMilitares' && role === 'admin' && (
        <MilitarAdminModal onClose={closeModal} />
      )}

      {selectedPermuta && (
         <PermutaViewModal permuta={selectedPermuta} onClose={clearSelectedPermuta} />
      )}
    </div>
  );
};

export default App;
