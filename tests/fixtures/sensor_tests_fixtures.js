const moment = require('moment');

const dataPoints = [
  {
    measurement: "test_measurement",
    tags: { host: "localhost" },
    fields: { temperature: 25, humidity: 50 },
    timestamp: new Date(moment().add(1, 'hour')),
  },
  {
    measurement: "test_measurement",
    tags: { host: "localhost" },
    fields: { temperature: 20, humidity: 22.2 },
    timestamp: new Date(moment().add(3, 'hour')),
  },
  {
    measurement: "test_measurement",
    tags: { host: "localhost" },
    fields: { temperature: 19.8, humidity: 37.5 },
    timestamp: new Date(moment().add(5, 'hour')),
  },
  {
    measurement: "test_measurement",
    tags: { host: "localhost" },
    fields: { temperature: 22, humidity: 22 },
    timestamp: new Date(moment().add(7, 'hour')),
  },
];

exports.dataPoints = dataPoints;
exports.startTime = dataPoints[1].timestamp;
exports.endTime = dataPoints[3].timestamp;