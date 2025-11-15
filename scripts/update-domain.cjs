#!/usr/bin/env node
/**
 * Script pour mettre à jour le nom de domaine dans tous les fichiers SEO
 * Usage: node scripts/update-domain.cjs https://votre-nouveau-domaine.com
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const newDomain = args[0];

if (!newDomain) {
  console.error('\n❌ Erreur: Veuillez fournir un nom de domaine');
  console.log('\nUsage: node scripts/update-domain.cjs https://votre-domaine.com\n');
  process.exit(1);
}

// Valider le format du domaine
if (!newDomain.startsWith('http://') && !newDomain.startsWith('https://')) {
  console.error('\n❌ Erreur: Le domaine doit commencer par http:// ou https://\n');
  process.exit(1);
}

const oldDomain = 'https://sahabiguide.com';
const domainWithoutProtocol = newDomain.replace(/^https?:\/\//, '');

console.log('\n🔄 Mise à jour du domaine...\n');
console.log(`Ancien domaine: ${oldDomain}`);
console.log(`Nouveau domaine: ${newDomain}\n`);

// Fichiers à mettre à jour
const filesToUpdate = [
  'index.html',
  'public/sitemap.xml',
  'public/robots.txt',
  'public/_redirects'
];

let updatedCount = 0;
let errorCount = 0;

filesToUpdate.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Ignoré: ${file} (fichier non trouvé)`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // Remplacer l'ancien domaine par le nouveau
    content = content.replace(new RegExp(oldDomain, 'g'), newDomain);
    
    // Pour _redirects, remplacer aussi le domaine sans protocole
    if (file.includes('_redirects')) {
      content = content.replace(/sahabiguide\.com/g, domainWithoutProtocol);
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ Mis à jour: ${file}`);
      updatedCount++;
    } else {
      console.log(`ℹ️  Aucun changement: ${file}`);
    }
    
  } catch (error) {
    console.error(`❌ Erreur sur ${file}:`, error.message);
    errorCount++;
  }
});

console.log('\n' + '='.repeat(50));
console.log(`\n✅ Fichiers mis à jour: ${updatedCount}`);
console.log(`❌ Erreurs: ${errorCount}\n`);

if (errorCount === 0) {
  console.log('🎉 Mise à jour terminée avec succès!');
  console.log('\n⚠️  N\'oubliez pas de:');
  console.log('  1. Reconstruire le projet: npm run build');
  console.log('  2. Vérifier le SEO: npm run seo:check');
  console.log('  3. Tester localement: npm run preview\n');
} else {
  console.log('⚠️  Des erreurs se sont produites. Vérifiez les messages ci-dessus.\n');
  process.exit(1);
}

