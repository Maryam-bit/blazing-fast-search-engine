var express = require("express");
var logger = require("morgan");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const {writeClient} = require("./config/db.utils");
const client = require('./config/mqtt.utils')
const config = require('./config/env.config')
const {Point} = require('@influxdata/influxdb-client')
require("dotenv").config();

client.connect();
mqttClient = client.getClient()

// importing the router
var UserApiRouterV1 = require("./routes/v1/user_api");
var SensorApiRouterV1 = require("./routes/v1/sensor_api");

var app = express();

const corsOptions = {
  origin: "http://localhost:5173",
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
  if (topic === config.influxdb.TOPIC) {
    const payload = JSON.parse(message);
    const temperature = payload.temperature;
    const humidity = payload.humidity;
    console.debug("Temperature:", temperature);
    console.debug("Humidity:", humidity);

    try {
      let point = new Point(config.influxdb.INFLUX_MEASUREMENT)
      .tag('host', 'localhost')
      .floatField('temperature', temperature)
      .floatField('humidity', humidity)

      await writeClient.writePoint(point)
      console.debug("[+] Point Written: ", point);
      await writeClient.flush()
    } catch (error) {
        console.debug("[-] Error: ", error);
    }
  }
});

//calling the routers
app.use("/api/v1/user", UserApiRouterV1);
app.use("/api/v1/sensor", SensorApiRouterV1);

app.all("*", (req, res, next) => {
  res.status(404).json({ Error: `Cant Find ${req.originalUrl}` }); // 404 Not Found
});

module.exports = {app, client};
