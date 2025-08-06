module.exports = {
  apps: [
    {
      name: 'tejo-beauty-backend',
      cwd: './backend',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        JWT_SECRET: 'your-jwt-secret-here',
        DATABASE_URL: 'postgresql://user:password@localhost:5432/tejobeauty'
      }
    },
    {
      name: 'tejo-beauty-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};