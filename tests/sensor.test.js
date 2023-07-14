const request = require("supertest");
const {app, client} = require("../app"); // Assuming your Express app is defined in app.js
// const influx_client = require("../config/db.utils").getClient();
const {writeClient, queryClient} = require("../config/db.utils");
const {Point} = require('@influxdata/influxdb-client')
const _ = require("lodash");
const config = require('../config/env.config')
const moment = require('moment');
let dataPoints = [];
let dates = [];

describe("Sensor Controller", () => {
  beforeAll(async () => {
    // client.disconnect();
    dates = [
      new Date(_.random(moment().add(1,'hour'), moment().add(2,'hour'))),
      new Date(_.random(moment().add(3,'hour'), moment().add(4,'hour'))),
      new Date(_.random(moment().add(5,'hour'), moment().add(6,'hour'))),
      new Date(_.random(moment().add(7,'hour'), moment().add(8,'hour'))),
    ];

    dataPoints = [
      {
        measurement: "test_measurement",
        tags: { host: "localhost" },
        fields: { temperature: 25, humidity: 50 },
        timestamp: dates[0],
      },
      {
        measurement: "test_measurement",
        tags: { host: "localhost" },
        fields: { temperature: 20, humidity: 22.2 },
        timestamp: dates[1],
      },
      {
        measurement: "test_measurement",
        tags: { host: "localhost" },
        fields: { temperature: 19.8, humidity: 37.5 },
        timestamp: dates[2],
      },
      {
        measurement: "test_measurement",
        tags: { host: "localhost" },
        fields: { temperature: 22, humidity: 22 },
        timestamp: dates[3],
      },
    ];

    const points = dataPoints.map((dataPoint) => new Point(config.influxdb.INFLUX_MEASUREMENT)
      .tag('host', 'localhost')
      .floatField('temperature', dataPoint.fields.temperature)
      .floatField('humidity', dataPoint.fields.humidity)
      // .timestamp(dataPoint.timestamp)
    );

    try {
      await writeClient.writePoints(points);
      console.log("[+] Point Written: ", dataPoints);
      await writeClient.flush()
    } catch (error) {
      console.log("[-] Error: ", error);
    }
  });

  afterAll(() => {
    // queryClient.queryLines(`drop measurement ${config.influxdb.INFLUX_MEASUREMENT}`)
    // .then(res => {
    //   console.log(res);
    //   return
    // })
  });

  describe("Get All Data", () => {
    it("should get all data points", async () => {
      // Mock the request and response objects
      const req = { params: {} };
      const res = { send: jest.fn() };

      // Call the getAllData function
      const response = await request(app)
        .get("/api/v1/sensor/alldata")
        .send(req)
        .expect(200);

      console.log(response.body);
      expect(response.body).not.toHaveLength(0);
    });
  });

  describe("Get Duration data", () => {
    it("should get data points within time frame", async () => {
      const req = {
        body: {
          startTime: dates[1],
          endTime: dates[3],
        },
      };

      const response = await request(app)
        .get("/api/v1/sensor/data/range?startTime=0")
        .expect(200);

      expect(response.body).not.toHaveLength(0)
    }, 10000);
  });
});
