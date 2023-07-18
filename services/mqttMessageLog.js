const { writeClient } = require("../config/db.utils");
const { Point } = require("@influxdata/influxdb-client");
const config = require("../config/env.config");

exports.insertIntoDB = async (temperature, humidity) => {
  try {
    let point = new Point(config.influxdb.INFLUX_MEASUREMENT)
      .tag("host", "localhost")
      .floatField("temperature", temperature)
      .floatField("humidity", humidity);

    await writeClient.writePoint(point);
    await writeClient.flush();
    console.debug("[+] Point Written: ", point);
  } catch (error) {
    console.debug("[-] Error: ", error);
    throw error;
  }
};
