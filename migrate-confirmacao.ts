/**
 * Migration script to add 'confirmação' fields to existing permutas
 * Run this once to update all existing permuta documents
 */

import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase-migrate';

async function migratePermutasConfirmacao() {
  try {
    console.log('Starting migration: adding confirmação fields to existing permutas...');

    const permutasRef = collection(db, 'permutas');
    const snapshot = await getDocs(permutasRef);

    if (snapshot.empty) {
      console.log('No permutas found in database.');
      return;
    }

    let updated = 0;
    let skipped = 0;

    for (const permutaDoc of snapshot.docs) {
      const data = permutaDoc.data();

      // Only update if confirmação fields don't exist
      if (data.confirmadaPorMilitarEntra === undefined || data.confirmadaPorMilitarSai === undefined) {
        await updateDoc(doc(db, 'permutas', permutaDoc.id), {
          confirmadaPorMilitarEntra: false,
          confirmadaPorMilitarSai: false
        });
        updated++;
        console.log(`Updated permuta ${permutaDoc.id}`);
      } else {
        skipped++;
      }
    }

    console.log('\n=== Migration Complete ===');
    console.log(`Total permutas: ${snapshot.size}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped (already migrated): ${skipped}`);
    console.log('========================\n');

  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}

// Run migration
migratePermutasConfirmacao()
  .then(() => {
    console.log('Migration script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
