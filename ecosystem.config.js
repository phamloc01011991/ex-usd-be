module.exports = {
  apps: [
    {
      name: "eth",
      script: "./server.js",
      exec_mode: "cluster",
      instances: "max",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "cron-job",
      script: "./cron-job.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
