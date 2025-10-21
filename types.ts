export interface Militar {
  rg: string;
  grad: string;
  quadro: string;
  nome: string;
  unidade: string;
  senha?: string; // Password for login (stored in Firestore)
  role?: 'admin' | 'user'; // User role
}

export type Funcao = "COMANDANTE DO 1º SOCORRO" | "COMANDANTE DO 2º SOCORRO" | "BUSCA E SALVAMENTO";

export interface Permuta {
  id: string;
  data: string;
  funcao: Funcao;
  militarEntra: Militar; // Full militar object for UI
  militarSai: Militar; // Full militar object for UI
  status: 'Pendente' | 'Aprovada' | 'Rejeitada';
}

// Firestore document types (how data is stored in Firebase)
export interface PermutaFirestore {
  id: string;
  data: string;
  funcao: Funcao;
  militarEntraRg: string; // Only RG reference
  militarSaiRg: string; // Only RG reference
  status: 'Pendente' | 'Aprovada' | 'Rejeitada';
}