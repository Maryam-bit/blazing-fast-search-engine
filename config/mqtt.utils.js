const mqtt = require('mqtt');
const config = require('./env.config');

let client;
// Another free public broker server address: mqtt://test.mosquitto.org/
function connect() {
  client = mqtt.connect('mqtt://broker.hivemq.com');

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
