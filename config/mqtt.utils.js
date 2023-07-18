const mqtt = require('mqtt');
const config = require('./env.config');

let client;

console.log("🚀 ~ file: mqtt.utils.js:6 ~ config.mqtt:", config.mqtt)
let connectionString = config.mqtt.protocol + config.mqtt.host + ":" + config.mqtt.port;

client = mqtt.connect(connectionString, {
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 4000
});

client.on('connect', async () => {
  console.log("Connected to MQTT")
  await client.subscribe(config.mqtt.TOPIC, { qos: 2 }, (err, granted) => {
    if (err) {
      console.error(err);
    }
  });
});


async function disconnect() {
  if (client) {
    await client.end();
  }
}

module.exports = {
  disconnect,
  client,
};
