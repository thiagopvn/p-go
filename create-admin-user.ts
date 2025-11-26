/**
 * Script de emergência para criar um usuário admin de teste
 * Este script cria um usuário diretamente na collection 'usuarios'
 * para permitir o primeiro acesso ao sistema
 *
 * Usage: npx tsx create-admin-user.ts
 */

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase-migrate';

async function createAdminUser() {
  console.log('=== Criando usuário admin de teste ===\n');

  // Dados do admin (baseado no CAP J.SANTOS do GOCG - RG 12961)
  const adminData = {
    rg: "12961",
    grad: "CAP",
    quadro: "QOA",
    nome: "J.SANTOS",
    unidade: "GOCG",
    senha: "admin123", // Senha temporária para teste
    role: "admin"
  };

  try {
    // Verificar se já existe
    const existingUser = await getDoc(doc(db, 'usuarios', adminData.rg));
    if (existingUser.exists()) {
      console.log('⚠️  Usuário admin já existe!');
      console.log('Use as seguintes credenciais:');
      console.log(`RG: ${adminData.rg}`);
      console.log('Senha: (a que foi configurada anteriormente)');
      process.exit(0);
    }

    // Criar o usuário admin
    await setDoc(doc(db, 'usuarios', adminData.rg), adminData);

    console.log('✅ Usuário admin criado com sucesso!\n');
    console.log('=== CREDENCIAIS DE ACESSO ===');
    console.log(`RG: ${adminData.rg}`);
    console.log(`Senha: ${adminData.senha}`);
    console.log(`Nome: ${adminData.grad} ${adminData.nome}`);
    console.log(`Role: ${adminData.role}`);
    console.log('\n⚠️  IMPORTANTE: Troque a senha após o primeiro acesso!');

  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Executar o script
createAdminUser();