/**
 * Migration script to add 'arquivada' field to existing permutas
 * Run this once to update all existing permuta documents with arquivada: false
 */

import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase-migrate';

async function migratePermutasArquivada() {
  try {
    console.log('Starting migration: adding arquivada field to existing permutas...');

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

      // Only update if arquivada field doesn't exist
      if (data.arquivada === undefined) {
        await updateDoc(doc(db, 'permutas', permutaDoc.id), {
          arquivada: false
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
migratePermutasArquivada()
  .then(() => {
    console.log('Migration script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
