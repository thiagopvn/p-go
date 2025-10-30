import React, {  createContext, useContext, useState, useMemo, useCallback, useEffect  } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, addDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Militar, Permuta, PermutaFirestore } from '../types';

interface AppContextType {
  militares: Militar[];
  addMilitar: (militar: Militar) => Promise<void>;
  updateMilitar: (militar: Militar) => Promise<void>;
  deleteMilitar: (rg: string) => Promise<void>;
  findMilitarByRg: (rg: string) => Militar | undefined;
  permutas: Permuta[];
  addPermutas: (novasPermutas: Omit<Permuta, 'id' | 'status' | 'enviada' | 'dataEnvio' | 'arquivada' | 'dataArquivamento' | 'confirmadaPorMilitarEntra' | 'confirmadaPorMilitarSai' | 'dataConfirmacaoMilitarEntra' | 'dataConfirmacaoMilitarSai'>[]) => Promise<void>;
  updatePermutaStatus: (id: string, status: Permuta['status']) => Promise<void>;
  marcarPermutasComoEnviadas: (permutaIds: string[]) => Promise<void>;
  arquivarPermutas: (permutaIds: string[]) => Promise<void>;
  desarquivarPermutas: (permutaIds: string[]) => Promise<void>;
  confirmarPermuta: (permutaId: string, rgMilitar: string, senha: string) => Promise<{success: boolean; error?: string}>;
  inverterMilitaresPermuta: (permutaId: string) => Promise<{success: boolean; error?: string}>;
  activeModal: string | null;
  openModal: (modal: string) => void;
  closeModal: () => void;
  selectedPermuta: Permuta | null;
  selectPermuta: (permuta: Permuta) => void;
  clearSelectedPermuta: () => void;
  documentData: Permuta[] | null;
  setDocumentData: (permutas: Permuta[] | null) => void;
  clearDocumentData: () => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [militares, setMilitares] = useState<Militar[]>([]);
  const [permutas, setPermutas] = useState<Permuta[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedPermuta, setSelectedPermuta] = useState<Permuta | null>(null);
  const [documentData, setDocumentDataState] = useState<Permuta[] | null>(null);
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
              status: data.status,
              enviada: data.enviada || false,
              dataEnvio: data.dataEnvio,
              arquivada: data.arquivada || false,
              dataArquivamento: data.dataArquivamento,
              confirmadaPorMilitarEntra: data.confirmadaPorMilitarEntra || false,
              confirmadaPorMilitarSai: data.confirmadaPorMilitarSai || false,
              dataConfirmacaoMilitarEntra: data.dataConfirmacaoMilitarEntra,
              dataConfirmacaoMilitarSai: data.dataConfirmacaoMilitarSai
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

  const addPermutas = async (novasPermutas: Omit<Permuta, 'id' | 'status' | 'enviada' | 'dataEnvio' | 'arquivada' | 'dataArquivamento' | 'confirmadaPorMilitarEntra' | 'confirmadaPorMilitarSai' | 'dataConfirmacaoMilitarEntra' | 'dataConfirmacaoMilitarSai'>[]) => {
    try {
      const promises = novasPermutas.map(async (p) => {
        const permutaFirestore: Omit<PermutaFirestore, 'id'> = {
          data: p.data,
          funcao: p.funcao,
          militarEntraRg: p.militarEntra.rg,
          militarSaiRg: p.militarSai.rg,
          status: 'Pendente',
          enviada: false,
          arquivada: false,
          confirmadaPorMilitarEntra: false,
          confirmadaPorMilitarSai: false
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

  const marcarPermutasComoEnviadas = async (permutaIds: string[]) => {
    try {
      const promises = permutaIds.map(async (id) => {
        await updateDoc(doc(db, 'permutas', id), {
          enviada: true,
          dataEnvio: new Date().toISOString()
        });
      });
      await Promise.all(promises);
    } catch (error) {
      console.error('Error marking permutas as sent:', error);
      throw error;
    }
  };

  const arquivarPermutas = async (permutaIds: string[]) => {
    try {
      const promises = permutaIds.map(async (id) => {
        await updateDoc(doc(db, 'permutas', id), {
          arquivada: true,
          dataArquivamento: new Date().toISOString()
        });
      });
      await Promise.all(promises);
    } catch (error) {
      console.error('Error archiving permutas:', error);
      throw error;
    }
  };

  const desarquivarPermutas = async (permutaIds: string[]) => {
    try {
      const promises = permutaIds.map(async (id) => {
        await updateDoc(doc(db, 'permutas', id), {
          arquivada: false,
          dataArquivamento: undefined
        });
      });
      await Promise.all(promises);
    } catch (error) {
      console.error('Error unarchiving permutas:', error);
      throw error;
    }
  };

  const confirmarPermuta = async (permutaId: string, rgMilitar: string, senha: string): Promise<{success: boolean; error?: string}> => {
    try {
      console.log('🔍 [CONFIRMAÇÃO] Iniciando confirmação da permuta:', permutaId, 'pelo militar RG:', rgMilitar);

      // Buscar permuta no Firestore
      const permutaDoc = await getDoc(doc(db, 'permutas', permutaId));
      if (!permutaDoc.exists()) {
        console.log('❌ [CONFIRMAÇÃO] Permuta não encontrada');
        return { success: false, error: 'Permuta não encontrada.' };
      }

      const permutaData = permutaDoc.data() as PermutaFirestore;

      // Verificar se o militar está envolvido nesta permuta
      const isMilitarEntra = permutaData.militarEntraRg === rgMilitar;
      const isMilitarSai = permutaData.militarSaiRg === rgMilitar;

      if (!isMilitarEntra && !isMilitarSai) {
        console.log('❌ [CONFIRMAÇÃO] Militar não está envolvido nesta permuta');
        return { success: false, error: 'Você não está envolvido nesta permuta.' };
      }

      // Verificar se já confirmou
      if (isMilitarEntra && permutaData.confirmadaPorMilitarEntra) {
        console.log('⚠️ [CONFIRMAÇÃO] Militar ENTRA já confirmou');
        return { success: false, error: 'Você já confirmou esta permuta.' };
      }
      if (isMilitarSai && permutaData.confirmadaPorMilitarSai) {
        console.log('⚠️ [CONFIRMAÇÃO] Militar SAI já confirmou');
        return { success: false, error: 'Você já confirmou esta permuta.' };
      }

      // Validar senha verificando na coleção usuarios
      console.log('🔍 [CONFIRMAÇÃO] Validando senha do militar...');
      const usuarioDoc = await getDoc(doc(db, 'usuarios', rgMilitar));

      if (!usuarioDoc.exists()) {
        console.log('❌ [CONFIRMAÇÃO] Usuário não cadastrado');
        return { success: false, error: 'Você precisa estar cadastrado na plataforma para confirmar permutas.' };
      }

      const usuarioData = usuarioDoc.data();
      if (usuarioData.senha !== senha) {
        console.log('❌ [CONFIRMAÇÃO] Senha incorreta');
        return { success: false, error: 'Senha incorreta.' };
      }

      console.log('✅ [CONFIRMAÇÃO] Senha validada! Confirmando permuta...');

      // Atualizar permuta com confirmação
      const updateData: Partial<PermutaFirestore> = {};
      if (isMilitarEntra) {
        updateData.confirmadaPorMilitarEntra = true;
        updateData.dataConfirmacaoMilitarEntra = new Date().toISOString();
      }
      if (isMilitarSai) {
        updateData.confirmadaPorMilitarSai = true;
        updateData.dataConfirmacaoMilitarSai = new Date().toISOString();
      }

      await updateDoc(doc(db, 'permutas', permutaId), updateData);

      console.log('✅ [CONFIRMAÇÃO] Permuta confirmada com sucesso!');
      return { success: true };

    } catch (error) {
      console.error('❌ [CONFIRMAÇÃO] Erro durante confirmação:', error);
      return { success: false, error: 'Erro ao confirmar permuta. Tente novamente.' };
    }
  };

  const inverterMilitaresPermuta = async (permutaId: string): Promise<{success: boolean; error?: string}> => {
    try {
      // Buscar permuta no Firestore
      const permutaDoc = await getDoc(doc(db, 'permutas', permutaId));
      if (!permutaDoc.exists()) {
        return { success: false, error: 'Permuta não encontrada.' };
      }

      const permutaData = permutaDoc.data() as PermutaFirestore;

      // Preparar dados de atualização (apenas incluir campos não-undefined)
      const updateData: any = {
        militarEntraRg: permutaData.militarSaiRg,
        militarSaiRg: permutaData.militarEntraRg,
        // Inverter as confirmações (usar false como padrão se undefined)
        confirmadaPorMilitarEntra: permutaData.confirmadaPorMilitarSai || false,
        confirmadaPorMilitarSai: permutaData.confirmadaPorMilitarEntra || false,
      };

      // Adicionar datas apenas se existirem
      if (permutaData.dataConfirmacaoMilitarSai !== undefined) {
        updateData.dataConfirmacaoMilitarEntra = permutaData.dataConfirmacaoMilitarSai;
      } else {
        // Remover o campo se não houver data
        updateData.dataConfirmacaoMilitarEntra = null;
      }

      if (permutaData.dataConfirmacaoMilitarEntra !== undefined) {
        updateData.dataConfirmacaoMilitarSai = permutaData.dataConfirmacaoMilitarEntra;
      } else {
        // Remover o campo se não houver data
        updateData.dataConfirmacaoMilitarSai = null;
      }

      await updateDoc(doc(db, 'permutas', permutaId), updateData);

      return { success: true };
    } catch (error) {
      console.error('Error inverting permuta militares:', error);
      return { success: false, error: 'Erro ao inverter militares. Tente novamente.' };
    }
  };

  const openModal = (modal: string) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  const selectPermuta = (permuta: Permuta) => setSelectedPermuta(permuta);
  const clearSelectedPermuta = () => setSelectedPermuta(null);

  const setDocumentData = (permutas: Permuta[] | null) => setDocumentDataState(permutas);
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
    marcarPermutasComoEnviadas,
    arquivarPermutas,
    desarquivarPermutas,
    confirmarPermuta,
    inverterMilitaresPermuta,
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
