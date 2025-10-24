import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Functions
export const functions = getFunctions(app, 'southamerica-east1');

// Se estiver em desenvolvimento local, conectar ao emulador (opcional)
// if (import.meta.env.DEV) {
//   connectFunctionsEmulator(functions, 'localhost', 5001);
// }

// Initialize Analytics (optional, only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };

// Types para a função de envio de email
export interface SendPermutaEmailRequest {
  email: string;
  permuta: {
    data: string;
    funcao: string;
    militarEntra: {
      grad: string;
      quadro: string;
      nome: string;
      rg: string;
      unidade: string;
    };
    militarSai: {
      grad: string;
      quadro: string;
      nome: string;
      rg: string;
      unidade: string;
    };
    confirmadaPorMilitarEntra: boolean;
    confirmadaPorMilitarSai: boolean;
    dataConfirmacao: string;
  };
}

export interface SendPermutaEmailResponse {
  success: boolean;
  message: string;
  emailId?: string;
}

// Função para enviar email de permuta
export const sendPermutaEmail = httpsCallable<SendPermutaEmailRequest, SendPermutaEmailResponse>(
  functions,
  'sendPermutaEmail'
);
