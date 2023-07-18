const request = require("supertest");
const {app} = require("../app");
const {writeClient, queryClient} = require("../config/db.utils");
const {Point} = require('@influxdata/influxdb-client')
const config = require('../config/env.config')
const fixtures = require('./fixtures/sensor_tests_fixtures')

describe("Sensor Controller", () => {
  beforeAll(async () => {
    
    const points = fixtures.dataPoints.map((dataPoint) => new Point(config.influxdb.INFLUX_MEASUREMENT)
      .tag('host', 'localhost')
      .floatField('temperature', dataPoint.fields.temperature)
      .floatField('humidity', dataPoint.fields.humidity)
    );

    try {
      await writeClient.writePoints(points);
      console.log("[+] Point Written: ", fixtures.dataPoints);
      await writeClient.flush()
    } catch (error) {
      console.log("[-] Error: ", error);
    }
  });

  describe("Get All Data", () => {
    it("should get all data points", async () => {
      const req = { params: {} };

      const response = await request(app)
        .get("/api/v1/sensor/alldata")
        .send(req)
        .expect(200);

      console.log(response.body);
      expect(response.body).not.toHaveLength(0);
    });
  });

  describe("Get Duration data", () => {
    it("should get data points within the time frame", async () => {
      const response = await request(app)
        .get(`/api/v1/sensor/data/range?startTime=${fixtures.startTime.getTime()}&endTime=${fixtures.endTime.getTime()}`)
        .expect(200);
  
      expect(response.body).not.toHaveLength(0);
    }, 10000);
  });
});
