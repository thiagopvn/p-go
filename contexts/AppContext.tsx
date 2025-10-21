import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Militar, Permuta, PermutaFirestore } from '../types';

interface AppContextType {
  militares: Militar[];
  addMilitar: (militar: Militar) => Promise<void>;
  updateMilitar: (militar: Militar) => Promise<void>;
  deleteMilitar: (rg: string) => Promise<void>;
  findMilitarByRg: (rg: string) => Militar | undefined;
  permutas: Permuta[];
  addPermutas: (novasPermutas: Omit<Permuta, 'id' | 'status'>[]) => Promise<void>;
  updatePermutaStatus: (id: string, status: Permuta['status']) => Promise<void>;
  activeModal: string | null;
  openModal: (modal: string) => void;
  closeModal: () => void;
  selectedPermuta: Permuta | null;
  selectPermuta: (permuta: Permuta) => void;
  clearSelectedPermuta: () => void;
  documentData: Permuta | null;
  setDocumentData: (permuta: Permuta | null) => void;
  clearDocumentData: () => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [militares, setMilitares] = useState<Militar[]>([]);
  const [permutas, setPermutas] = useState<Permuta[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedPermuta, setSelectedPermuta] = useState<Permuta | null>(null);
  const [documentData, setDocumentDataState] = useState<Permuta | null>(null);
  const [loading, setLoading] = useState(true);

  const militarMap = useMemo(() => {
    const map = new Map<string, Militar>();
    militares.forEach(m => map.set(m.rg, m));
    return map;
  }, [militares]);

  const findMilitarByRg = useCallback((rg: string) => militarMap.get(rg), [militarMap]);

  // Listen to real-time updates from Firestore for militares
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'militares'),
      (snapshot) => {
        const militaresData = snapshot.docs.map(doc => doc.data() as Militar);
        setMilitares(militaresData.sort((a, b) => a.nome.localeCompare(b.nome)));
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching militares:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Listen to real-time updates from Firestore for permutas
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'permutas'),
      (snapshot) => {
        const permutasData = snapshot.docs.map(doc => {
          const data = doc.data() as PermutaFirestore;

          // Convert Firestore data to UI data by resolving militar references
          const militarEntra = militarMap.get(data.militarEntraRg);
          const militarSai = militarMap.get(data.militarSaiRg);

          // Only include permuta if both militares are found
          if (militarEntra && militarSai) {
            return {
              id: data.id,
              data: data.data,
              funcao: data.funcao,
              militarEntra,
              militarSai,
              status: data.status
            } as Permuta;
          }
          return null;
        }).filter((p): p is Permuta => p !== null);

        setPermutas(permutasData);
      },
      (error) => {
        console.error('Error fetching permutas:', error);
      }
    );

    return () => unsubscribe();
  }, [militarMap]);

  const addMilitar = async (militar: Militar) => {
    try {
      await setDoc(doc(db, 'militares', militar.rg), militar);
    } catch (error) {
      console.error('Error adding militar:', error);
      throw error;
    }
  };

  const updateMilitar = async (militar: Militar) => {
    try {
      await updateDoc(doc(db, 'militares', militar.rg), { ...militar });
    } catch (error) {
      console.error('Error updating militar:', error);
      throw error;
    }
  };

  const deleteMilitar = async (rg: string) => {
    try {
      await deleteDoc(doc(db, 'militares', rg));
    } catch (error) {
      console.error('Error deleting militar:', error);
      throw error;
    }
  };

  const addPermutas = async (novasPermutas: Omit<Permuta, 'id' | 'status'>[]) => {
    try {
      const promises = novasPermutas.map(async (p) => {
        const permutaFirestore: Omit<PermutaFirestore, 'id'> = {
          data: p.data,
          funcao: p.funcao,
          militarEntraRg: p.militarEntra.rg,
          militarSaiRg: p.militarSai.rg,
          status: 'Pendente'
        };

        const docRef = await addDoc(collection(db, 'permutas'), permutaFirestore);
        // Update the document with its own ID
        await updateDoc(docRef, { id: docRef.id });
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error adding permutas:', error);
      throw error;
    }
  };

  const updatePermutaStatus = async (id: string, status: Permuta['status']) => {
    try {
      await updateDoc(doc(db, 'permutas', id), { status });
    } catch (error) {
      console.error('Error updating permuta status:', error);
      throw error;
    }
  };

  const openModal = (modal: string) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  const selectPermuta = (permuta: Permuta) => setSelectedPermuta(permuta);
  const clearSelectedPermuta = () => setSelectedPermuta(null);

  const setDocumentData = (permuta: Permuta | null) => setDocumentDataState(permuta);
  const clearDocumentData = () => setDocumentDataState(null);

  const value = {
    militares,
    addMilitar,
    updateMilitar,
    deleteMilitar,
    findMilitarByRg,
    permutas,
    addPermutas,
    updatePermutaStatus,
    activeModal,
    openModal,
    closeModal,
    selectedPermuta,
    selectPermuta,
    clearSelectedPermuta,
    documentData,
    setDocumentData,
    clearDocumentData,
    loading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
