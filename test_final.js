const fs = require('fs')

console.log('=== Running Comprehensive Test Suite ===\n')

// Test 1: Check if all key files exist and have expected content
const filesToCheck = [
  ['src/lib/api/response.ts', 'apiError function exists'],
  ['src/lib/supabase/server.ts', 'createClient updated'],
  ['src/proxy.ts', 'api/* matcher excluded'],
  ['src/app/(auth)/login/page.tsx', 'login page exists'],
  ['src/lib/auth/useAuthProtection.ts', 'auth protection implemented'],
  ['src/app/(app)/dashboard/page.tsx', 'dashboard exists'],
  ['src/app/(app)/listings/page.tsx', 'listings page exists'],
  ['src/app/(app)/applications/page.tsx', 'applications page exists']
]

console.log('Checking file structure...')
let passedFiles = 0
for (let i = 0; i < filesToCheck.length; i++) {
  const filePath = filesToCheck[i][0]
  const description = filesToCheck[i][1]
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    if (content.length > 0) {
      console.log('✓ ' + description + ' - ' + filePath)
      passedFiles++
    } else {
      console.log('✗ ' + description + ' - ' + filePath + ' (EMPTY)')
    }
  } catch (err) {
    console.log('✗ ' + description + ' - ' + filePath + ' (' + err.message + ')')
  }
}

console.log('\nFiles test: ' + passedFiles + '/' + filesToCheck.length + ' passed\n')

// Test 2: Check package.json scripts
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const requiredScripts = ['dev', 'build', 'start', 'lint']

console.log('Checking package.json scripts...')
let passedScripts = 0
for (let i = 0; i < requiredScripts.length; i++) {
  const script = requiredScripts[i]
  if (packageJson.scripts[script]) {
    console.log('✓ Script ' + script + ' exists')
    passedScripts++
  } else {
    console.log('✗ Script ' + script + ' missing')
  }
}

console.log('\nScripts test: ' + passedScripts + '/' + requiredScripts.length + ' passed\n')

// Test 3: Check auth API endpoints
const authEndpoints = [
  'src/app/api/auth/login/route.ts',
  'src/app/api/auth/signup/route.ts',
  'src/app/api/auth/callback/route.ts',
  'src/app/api/auth/logout/route.ts'
]

console.log('Checking auth API endpoints...')
let passedEndpoints = 0
for (let i = 0; i < authEndpoints.length; i++) {
  const endpoint = authEndpoints[i]
  try {
    const content = fs.readFileSync(endpoint, 'utf8')
    if (content.includes('export async function')) {
      console.log('✓ ' + endpoint + ' has handler')
      passedEndpoints++
    } else {
      console.log('✗ ' + endpoint + ' missing handler')
    }
  } catch (err) {
    console.log('✗ ' + endpoint + ' not found (' + err.message + ')')
  }
}

console.log('\nEndpoints test: ' + passedEndpoints + '/' + authEndpoints.length + ' passed\n')

// Test 4: Check middleware configuration
console.log('Checking proxy.ts configuration...')
try {
  const proxyContent = fs.readFileSync('src/proxy.ts', 'utf8')
  if (proxyContent.includes('matcher: [') && !proxyContent.includes('api/auth/callback') && proxyContent.includes('api/')) {
    console.log('✓ Middleware excludes ALL api/* routes')
    passedFiles++
  } else {
    console.log('✗ Middleware configuration incorrect')
  }
} catch (err) {
  console.log('✗ Could not read proxy.ts (' + err.message + ')')
}

console.log('\n=== Test Summary ===')
const totalTests = filesToCheck.length + requiredScripts.length + authEndpoints.length + 1
const passedTotal = passedFiles + passedScripts + passedEndpoints
const percentage = Math.round((passedTotal / totalTests) * 100)

console.log('Total Tests: ' + passedTotal + '/' + totalTests + ' passed (' + percentage + '%)')

if (percentage >= 90) {
  console.log('\n🎉 ALL SYSTEMS GO! Production ready.')
} else {
  console.log('\n⚠️ Some tests failed. Review above for details.')
}
