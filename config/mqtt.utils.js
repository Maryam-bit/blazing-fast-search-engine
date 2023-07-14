const mqtt = require('mqtt');
const config = require('./env.config');

let client;
let connectionString = config.mqtt.protocol + config.mqtt.host + ":" + config.mqtt.port;

function connect() {
  client = mqtt.connect(connectionString);

  client.on('connect', () => {
    client.subscribe(config.influxdb.TOPIC, { qos: 2 }, (err, granted) => {
      if (err) {
        console.error(err);
      }
    });
  });
}

async function disconnect() {
  if (client) {
    await client.end();
  }
}

module.exports = {
  connect,
  disconnect,
  getClient: () => client,
};
