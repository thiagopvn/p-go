export interface Militar {
  rg: string;
  grad: string;
  quadro: string;
  nome: string;
  unidade: string;
  senha?: string; // Password - optional in militares collection (requires registration)
  role?: 'admin' | 'user'; // User role
}

// Usuario type for registered users in 'usuarios' collection
export interface Usuario {
  rg: string; // Document ID and unique identifier
  senha: string; // User-defined password (required for registered users)
  role: 'admin' | 'user'; // User role
  // The following fields are validated against 'militares' collection during registration:
  grad: string;
  quadro: string;
  nome: string;
  unidade: string;
  createdAt?: Date; // When the user registered
}

export type Funcao = "COMANDANTE DO 1º SOCORRO" | "COMANDANTE DO 2º SOCORRO" | "BUSCA E SALVAMENTO";

export interface Permuta {
  id: string;
  data: string;
  funcao: Funcao;
  militarEntra: Militar; // Full militar object for UI
  militarSai: Militar; // Full militar object for UI
  status: 'Pendente' | 'Aprovada' | 'Rejeitada';
  enviada: boolean; // Whether document was generated and sent to ajudância
  dataEnvio?: string; // When the document was sent (ISO string)
}

// Firestore document types (how data is stored in Firebase)
export interface PermutaFirestore {
  id: string;
  data: string;
  funcao: Funcao;
  militarEntraRg: string; // Only RG reference
  militarSaiRg: string; // Only RG reference
  status: 'Pendente' | 'Aprovada' | 'Rejeitada';
  enviada: boolean; // Whether document was generated and sent to ajudância
  dataEnvio?: string; // When the document was sent (ISO string)
}