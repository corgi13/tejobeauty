#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Complete Tejo Nails to Tejo Beauty Rebranding Script
 * This script updates all references across the entire project
 */

const REPLACEMENTS = [
  // Brand name replacements
  { from: /Tejo Nails/g, to: 'Tejo Beauty' },
  { from: /tejo-nails/g, to: 'tejo-beauty' },
  { from: /tejonails/g, to: 'tejobeauty' },
  { from: /TEJO_NAILS/g, to: 'TEJO_BEAUTY' },
  { from: /TejoNails/g, to: 'TejoBeauty' },
  
  // Domain replacements
  { from: /tejo-nails\.com/g, to: 'tejo-beauty.com' },
  { from: /tejonails\.com/g, to: 'tejobeauty.com' },
  
  // Email replacements
  { from: /@tejo-nails\.com/g, to: '@tejo-beauty.com' },
  { from: /@tejonails\.com/g, to: '@tejobeauty.com' },
  
  // Product/service terminology
  { from: /nail care/gi, to: 'beauty care' },
  { from: /nail products/gi, to: 'beauty products' },
  { from: /nail salon/gi, to: 'beauty salon' },
  { from: /nail studio/gi, to: 'beauty studio' },
  { from: /nail technician/gi, to: 'beauty professional' },
  { from: /nail art/gi, to: 'beauty art' },
  { from: /nail polish/gi, to: 'beauty polish' },
  { from: /manicure/gi, to: 'beauty treatment' },
  { from: /pedicure/gi, to: 'beauty service' },
  
  // Database and API references
  { from: /tejo_nails/g, to: 'tejo_beauty' },
  { from: /TEJO_NAILS_/g, to: 'TEJO_BEAUTY_' },
  
  // File and directory names
  { from: /tejo-nails-platform/gi, to: 'tejo-beauty-platform' },
  { from: /TEJO-NAILS-PLATFORM/g, to: 'TEJO-BEAUTY-PLATFORM' },
  
  // Meta descriptions and titles
  { from: /Professional nail care platform/gi, to: 'Professional beauty care platform' },
  { from: /B2B nail products/gi, to: 'B2B beauty products' },
  { from: /Wholesale nail supplies/gi, to: 'Wholesale beauty supplies' },
];

const EXCLUDED_DIRS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'coverage',
  '.nyc_output',
  'logs',
  '*.log',
  '.DS_Store',
  'Thumbs.db'
];

const INCLUDED_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt', '.html', '.css', '.scss',
  '.sql', '.prisma', '.env', '.env.example', '.yml', '.yaml', '.xml', '.php',
  '.py', '.rb', '.go', '.java', '.cs', '.cpp', '.c', '.h', '.sh', '.bat'
];

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return INCLUDED_EXTENSIONS.includes(ext) || path.basename(filePath).startsWith('.env');
}

function shouldSkipDirectory(dirName) {
  return EXCLUDED_DIRS.some(excluded => {
    if (excluded.includes('*')) {
      return dirName.includes(excluded.replace('*', ''));
    }
    return dirName === excluded;
  });
}

function processFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return { processed: false, reason: 'File does not exist' };
    }

    const stats = fs.statSync(filePath);
    if (stats.size > 10 * 1024 * 1024) { // Skip files larger than 10MB
      return { processed: false, reason: 'File too large' };
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let changeCount = 0;

    // Apply all replacements
    REPLACEMENTS.forEach(replacement => {
      const originalContent = content;
      content = content.replace(replacement.from, replacement.to);
      if (content !== originalContent) {
        modified = true;
        changeCount++;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { processed: true, changes: changeCount };
    }

    return { processed: false, reason: 'No changes needed' };
  } catch (error) {
    return { processed: false, reason: error.message };
  }
}

function processDirectory(dirPath, results = { processed: 0, skipped: 0, errors: 0, files: [] }) {
  try {
    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        if (!shouldSkipDirectory(item)) {
          processDirectory(itemPath, results);
        } else {
          console.log(`Skipping directory: ${itemPath}`);
        }
      } else if (stats.isFile() && shouldProcessFile(itemPath)) {
        const result = processFile(itemPath);
        
        if (result.processed) {
          results.processed++;
          results.files.push({
            path: itemPath,
            changes: result.changes
          });
          console.log(`✓ Processed: ${itemPath} (${result.changes} changes)`);
        } else if (result.reason === 'No changes needed') {
          // Don't count as skipped if no changes needed
        } else {
          results.skipped++;
          console.log(`⚠ Skipped: ${itemPath} (${result.reason})`);
        }
      }
    });
  } catch (error) {
    results.errors++;
    console.error(`Error processing directory ${dirPath}:`, error.message);
  }

  return results;
}

function updatePackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Update package.json fields
      if (packageJson.name) packageJson.name = packageJson.name.replace(/tejo-?nails/gi, 'tejo-beauty');
      if (packageJson.description) {
        packageJson.description = packageJson.description
          .replace(/Tejo Nails/g, 'Tejo Beauty')
          .replace(/nail care/gi, 'beauty care')
          .replace(/nail products/gi, 'beauty products');
      }
      if (packageJson.homepage) packageJson.homepage = packageJson.homepage.replace(/tejo-?nails/gi, 'tejo-beauty');
      if (packageJson.repository && packageJson.repository.url) {
        packageJson.repository.url = packageJson.repository.url.replace(/tejo-?nails/gi, 'tejo-beauty');
      }
      if (packageJson.bugs && packageJson.bugs.url) {
        packageJson.bugs.url = packageJson.bugs.url.replace(/tejo-?nails/gi, 'tejo-beauty');
      }

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
      console.log('✓ Updated package.json');
    } catch (error) {
      console.error('Error updating package.json:', error.message);
    }
  }
}

function updateReadme() {
  const readmePath = path.join(process.cwd(), 'README.md');
  
  if (fs.existsSync(readmePath)) {
    try {
      let content = fs.readFileSync(readmePath, 'utf8');
      
      // Update README content
      content = content.replace(/# Tejo Nails/g, '# Tejo Beauty');
      content = content.replace(/Tejo Nails Platform/g, 'Tejo Beauty Platform');
      content = content.replace(/nail care platform/gi, 'beauty care platform');
      content = content.replace(/B2B nail products/gi, 'B2B beauty products');
      content = content.replace(/wholesale nail supplies/gi, 'wholesale beauty supplies');
      
      fs.writeFileSync(readmePath, content, 'utf8');
      console.log('✓ Updated README.md');
    } catch (error) {
      console.error('Error updating README.md:', error.message);
    }
  }
}

function createMigrationReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFilesProcessed: results.processed,
      totalFilesSkipped: results.skipped,
      totalErrors: results.errors,
      totalChanges: results.files.reduce((sum, file) => sum + file.changes, 0)
    },
    processedFiles: results.files,
    replacements: REPLACEMENTS.map(r => ({
      from: r.from.toString(),
      to: r.to
    }))
  };

  const reportPath = path.join(process.cwd(), 'migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\n📊 Migration report saved to: ${reportPath}`);
  
  return report;
}

function main() {
  console.log('🚀 Starting Tejo Nails → Tejo Beauty Migration...\n');
  console.log('This script will update all brand references across the project.\n');

  const startTime = Date.now();
  const projectRoot = process.cwd();

  console.log(`Processing directory: ${projectRoot}\n`);

  // Process all files
  const results = processDirectory(projectRoot);

  // Update specific files
  updatePackageJson();
  updateReadme();

  // Generate report
  const report = createMigrationReport(results);

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log('\n🎉 Migration completed successfully!');
  console.log('═'.repeat(50));
  console.log(`📁 Files processed: ${report.summary.totalFilesProcessed}`);
  console.log(`⚠️  Files skipped: ${report.summary.totalFilesSkipped}`);
  console.log(`❌ Errors: ${report.summary.totalErrors}`);
  console.log(`🔄 Total changes: ${report.summary.totalChanges}`);
  console.log(`⏱️  Duration: ${duration}s`);
  console.log('═'.repeat(50));

  if (report.summary.totalChanges > 0) {
    console.log('\n✅ Brand migration completed successfully!');
    console.log('🔍 Please review the changes and test the application.');
    console.log('📝 Consider updating:');
    console.log('   - Logo files and images');
    console.log('   - Favicon');
    console.log('   - Social media links');
    console.log('   - SSL certificates (if domain changed)');
    console.log('   - DNS records (if domain changed)');
  } else {
    console.log('\n💡 No changes were made. The project may already be updated.');
  }

  console.log('\n🚀 Next steps:');
  console.log('   1. Review migration-report.json for details');
  console.log('   2. Test the application thoroughly');
  console.log('   3. Update environment variables');
  console.log('   4. Deploy to staging for testing');
  console.log('   5. Update production when ready');
}

// Run the migration
if (require.main === module) {
  main();
}

module.exports = {
  processFile,
  processDirectory,
  REPLACEMENTS,
  main
};