const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running Tejo Beauty Test Suite\n');

// Backend Tests
console.log('📦 Backend Tests');
console.log('================');
try {
  process.chdir(path.join(__dirname, 'backend'));
  execSync('npm test', { stdio: 'inherit' });
  console.log('✅ Backend tests passed\n');
} catch (error) {
  console.log('❌ Backend tests failed\n');
}

// Frontend Tests
console.log('🎨 Frontend Tests');
console.log('=================');
try {
  process.chdir(path.join(__dirname, 'frontend'));
  execSync('npm test', { stdio: 'inherit' });
  console.log('✅ Frontend tests passed\n');
} catch (error) {
  console.log('❌ Frontend tests failed\n');
}

// E2E Tests
console.log('🔄 E2E Tests');
console.log('============');
try {
  process.chdir(path.join(__dirname, 'backend'));
  execSync('npm run test:e2e', { stdio: 'inherit' });
  console.log('✅ E2E tests passed\n');
} catch (error) {
  console.log('❌ E2E tests failed\n');
}

console.log('🎉 Test suite completed!');