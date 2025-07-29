module.exports = {
  apps: [
    {
      name: "tejo-nails-backend",
      script: "dist/main.js",
      cwd: "/root/tejo-nails-platform (1)/backend",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 3002,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3002,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
    },
  ],
};
