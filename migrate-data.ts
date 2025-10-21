/**
 * Migration script to populate Firebase Firestore with initial data
 * Run this script once to set up the database with militares data
 *
 * Usage: npx tsx migrate-data.ts
 */

import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { MILITARES_INICIAIS } from './constants';
import type { Militar } from './types';

const ADMIN_RG = '12961'; // J.SANTOS from GOCG

async function migrateMilitares() {
  console.log('Starting migration of militares to Firestore...');

  let successCount = 0;
  let errorCount = 0;

  for (const militar of MILITARES_INICIAIS) {
    try {
      // Add senha and role to each militar
      const militarWithAuth: Militar = {
        ...militar,
        senha: militar.rg, // Default password is the RG number
        role: militar.rg === ADMIN_RG ? 'admin' : 'user'
      };

      // Use RG as document ID
      await setDoc(doc(db, 'militares', militar.rg), militarWithAuth);
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
  console.log('\nAdmin user:');
  console.log(`  RG: ${ADMIN_RG}`);
  console.log(`  Password: ${ADMIN_RG}`);
  console.log('\nAll users have their RG as default password.');
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
