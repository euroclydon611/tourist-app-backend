// DRILLING
module.exports = {
  apps: [
    {
      name: "tourism-reginald-be",
      script: "build/server.js",
      exec_mode: "cluster",
      instances: "1",
    },
  ],
  deploy: {
    production: {
      user: "root",
      host: "147.182.237.161",
      ref: "origin/prod_drilling",
      repo: "git@github.com:Calculus-Solutions/jodi_be.git",
      path: "/home/jodi_drilling/jodi_be",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      ssh_options: "ForwardAgent=yes",
    },
  },
};




