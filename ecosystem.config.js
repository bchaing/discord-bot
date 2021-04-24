module.exports = {
  apps : [{
    name: 'Bonk Bot',
    script: 'index.js',
    watch: '.',
    ignore_watch: ["node_modules", "assets", "database.sqlite", "database.sqlite-journal"],
    args: [
          "--color",
        ],
    },
  ],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
