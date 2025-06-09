// Simple build script to inject environment variables into the app
const fs = require('fs');

// Load environment variables from .env file
require('dotenv').config();

// Read environment variables (will use .env file locally, Netlify env vars in production)
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

// Create a config file with the environment variables
const configContent = `// Auto-generated configuration file
window.APP_CONFIG = {
  SUPABASE_URL: "${supabaseUrl}",
  SUPABASE_ANON_KEY: "${supabaseAnonKey}",
  NODE_ENV: "${process.env.NODE_ENV || 'development'}"
};

// Validate configuration
if (window.APP_CONFIG.SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE') {
  console.warn('⚠️ Supabase URL not configured. Please set SUPABASE_URL environment variable.');
}

if (window.APP_CONFIG.SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
  console.warn('⚠️ Supabase anon key not configured. Please set SUPABASE_ANON_KEY environment variable.');
}

console.log('✅ App configuration loaded');
`;

// Write the config file
fs.writeFileSync('js/config.js', configContent);
console.log('✅ Build complete - config.js generated');