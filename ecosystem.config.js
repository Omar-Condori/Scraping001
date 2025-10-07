module.exports = {
  apps: [
    {
      name: 'scraping-platform',
      script: 'npm',
      args: 'run production',
      cwd: '/Users/omar/Documents/PageWeb/Scraping001',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};