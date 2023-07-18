var express = require("express");
var logger = require("morgan");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const client = require('./config/mqtt.utils')
const config = require('./config/env.config')
const db = require('./models')
const mqttLog = require('./services/mqttMessageLog')
require("dotenv").config();

// importing the router
var UserApiRouterV1 = require("./routes/v1/user_api");
var SensorApiRouterV1 = require("./routes/v1/sensor_api");

var app = express();

mqttClient = client.client

require("./config/initDb");

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
});

const corsOptions = {
  origin: config.origin_url,
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE", "PATCH"],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(logger("dev"));
app.use(cookieParser());

mqttClient.on("message", async (topic, message, packet) => {
  if (packet.retain === true) {
    return;
  }
  if (topic === config.mqtt.TOPIC) {
    const payload = JSON.parse(message);
    const temperature = payload.temperature;
    const humidity = payload.humidity;

    try {
      await mqttLog.insertIntoDB(temperature, humidity);
    } catch (error) {
      console.debug("[-] Error: ", error);
    }
  }
});

mqttClient.on('close', () => console.log('disconnected', new Date()));
mqttClient.on('error', err => console.error('error', err));

app.use("/api/v1/user", UserApiRouterV1);
app.use("/api/v1/sensor", SensorApiRouterV1);

app.all("*", (req, res, next) => {
  res.status(404).json({ Error: `Cant Find ${req.originalUrl}` }); // 404 Not Found
});

module.exports = {app, client};
