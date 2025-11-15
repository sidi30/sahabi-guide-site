#!/usr/bin/env node
/**
 * Script de vérification SEO pour SahabiGuide
 * Vérifie que tous les éléments SEO sont en place
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Vérification SEO pour SahabiGuide\n');
console.log('=' .repeat(50));

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

// Fonction helper pour vérifier l'existence d'un fichier
function checkFile(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    checks.passed.push(`✅ ${description}`);
    return true;
  } else {
    checks.failed.push(`❌ ${description} - Fichier manquant: ${filePath}`);
    return false;
  }
}

// Fonction pour vérifier le contenu d'un fichier
function checkFileContent(filePath, searchString, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    checks.failed.push(`❌ ${description} - Fichier non trouvé`);
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  if (content.includes(searchString)) {
    checks.passed.push(`✅ ${description}`);
    return true;
  } else {
    checks.failed.push(`❌ ${description} - Contenu manquant`);
    return false;
  }
}

// 1. Vérifier les fichiers essentiels
console.log('\n📁 Fichiers essentiels:');
checkFile('public/favicon.png', 'Favicon PNG');
checkFile('public/logo.svg', 'Logo SVG');
checkFile('public/robots.txt', 'Robots.txt');
checkFile('public/sitemap.xml', 'Sitemap XML');
checkFile('public/manifest.json', 'Manifest PWA');
checkFile('public/_headers', 'Headers (Netlify/Vercel)');
checkFile('public/_redirects', 'Redirections');

// 2. Vérifier le contenu de index.html
console.log('\n📄 Métadonnées HTML:');
checkFileContent('index.html', '<meta name="description"', 'Meta Description');
checkFileContent('index.html', '<meta name="keywords"', 'Meta Keywords');
checkFileContent('index.html', '<link rel="canonical"', 'Canonical URL');
checkFileContent('index.html', 'property="og:', 'Open Graph Tags');
checkFileContent('index.html', 'name="twitter:', 'Twitter Cards');
checkFileContent('index.html', '"@type": "Organization"', 'Schema.org - Organization');
checkFileContent('index.html', '"@type": "BreadcrumbList"', 'Schema.org - Breadcrumb');
checkFileContent('index.html', '/favicon.png', 'Favicon dans HTML');
checkFileContent('index.html', 'manifest.json', 'Manifest lié');

// 3. Vérifier robots.txt
console.log('\n🤖 Robots.txt:');
checkFileContent('public/robots.txt', 'User-agent:', 'User-agent défini');
checkFileContent('public/robots.txt', 'Sitemap:', 'Sitemap référencé');

// 4. Vérifier sitemap.xml
console.log('\n🗺️  Sitemap:');
checkFileContent('public/sitemap.xml', '<urlset', 'Format XML valide');
checkFileContent('public/sitemap.xml', '<loc>', 'URLs présentes');
checkFileContent('public/sitemap.xml', '<lastmod>', 'Dates de modification');

// 5. Vérifier manifest.json
console.log('\n📱 Manifest PWA:');
checkFileContent('public/manifest.json', '"name":', 'Nom de l\'app');
checkFileContent('public/manifest.json', '"icons":', 'Icônes définies');
checkFileContent('public/manifest.json', '"theme_color":', 'Couleur de thème');

// Afficher les résultats
console.log('\n' + '='.repeat(50));
console.log('\n📊 RÉSULTATS:\n');

checks.passed.forEach(msg => console.log(msg));
if (checks.warnings.length > 0) {
  console.log('');
  checks.warnings.forEach(msg => console.log(msg));
}
if (checks.failed.length > 0) {
  console.log('');
  checks.failed.forEach(msg => console.log(msg));
}

console.log('\n' + '='.repeat(50));
console.log(`\n✅ Réussi: ${checks.passed.length}`);
console.log(`⚠️  Avertissements: ${checks.warnings.length}`);
console.log(`❌ Échecs: ${checks.failed.length}`);

if (checks.failed.length === 0) {
  console.log('\n🎉 Toutes les vérifications SEO sont passées!\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Certaines vérifications ont échoué. Veuillez corriger les problèmes ci-dessus.\n');
  process.exit(1);
}

