require('dotenv').config()
const db = require("./models");
const {app} = require('./app');
const config = require('./config/env.config')

const port = config.port;
let server = "";
server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
    // server = app.listen(port, () => {
    //   console.log(`App running on port ${port}...`);
    // });
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
});

// Shut down the server when the process is terminated
process.on('SIGTERM', () => {
  console.log('Server Shutting down gracefully');
  server.close(() => {
    console.log('[-] Server closed');
  });
});

process.on('uncaughtException', function(err) {
  console.log(err)
  process.exit(1);
})

process.on('unhandledRejection', function(err) {
  console.log(err);
  process.exit(1);
});
