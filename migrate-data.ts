/**
 * Migration script to populate Firebase Firestore with initial data
 * Run this script once to set up the database with militares data
 *
 * Usage: npx tsx migrate-data.ts
 *
 * IMPORTANTE: Este script NÃO cria senhas para os militares.
 * Cada militar precisa fazer seu próprio cadastro na plataforma
 * através da tela de cadastro, validando seus dados contra esta base.
 */

import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase-migrate';
import { MILITARES_INICIAIS } from './constants';
import type { Militar } from './types';

async function migrateMilitares() {
  console.log('Starting migration of militares to Firestore...');
  console.log('NOTE: No passwords will be set. Users must register through the app.\n');

  let successCount = 0;
  let errorCount = 0;

  for (const militar of MILITARES_INICIAIS) {
    try {
      // Migrate militar WITHOUT senha (password)
      // Users must register to create their account
      const militarData: Omit<Militar, 'senha'> = {
        rg: militar.rg,
        grad: militar.grad,
        quadro: militar.quadro,
        nome: militar.nome,
        unidade: militar.unidade,
        role: 'user' // All users start as regular users
      };

      // Use RG as document ID
      await setDoc(doc(db, 'militares', militar.rg), militarData);
      successCount++;
      console.log(`✓ Migrated: ${militar.grad} ${militar.nome} (RG: ${militar.rg})`);
    } catch (error) {
      errorCount++;
      console.error(`✗ Error migrating ${militar.nome}:`, error);
    }
  }

  console.log('\n=== Migration Complete ===');
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total: ${MILITARES_INICIAIS.length}`);
  console.log('\n⚠️ IMPORTANT: No default passwords were created.');
  console.log('Users must register through the app to create their accounts.');
  console.log('The registration process will validate their data against this database.');
}

// Run migration
migrateMilitares()
  .then(() => {
    console.log('\nMigration script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nMigration failed:', error);
    process.exit(1);
  });
