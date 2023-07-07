const influx_client = require("../../config/db.utils")
const config = require('../../config/env.config')
const { queryClient } = require('../../config/db.utils')
const measurement = config.influxdb.INFLUX_MEASUREMENT

exports.getAllData = async (req, res, next) => {
  try {
    const query = `from(bucket: "${config.influxdb.INFLUX_BUCKET}")
    |> range(start: 0)
    |> filter(fn: (r) => r._measurement == "${config.influxdb.INFLUX_MEASUREMENT}")`
  
    queryClient.collectRows(query).then((results) =>{
      res.send(results);
    }).catch((err) =>{
      console.log("[-] Error: ", err);
      res.status(500).json({ error: 'An error occurred while executing the query' });
    })
  } catch (error) {
    console.log("[-] Error: ", error);
    res.status(500).json({ error: 'An error occurred while executing the query' });
  }
};

exports.durationData = async (req, res, next) => {
  try {
    const { startTime, endTime } = req.body;
  
    const result = await influx_client.query(`
      select * from ${measurement}
      where time>='${startTime}' AND time<='${endTime}'
    `);
    // console.table(result);
    res.send(result);
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: 'An error occurred while executing the query' });
  }
  
};

exports.dataRange = async (req, res, next) => {
  try {
    const {startTime, endTime} = req.query;

    const query = `from(bucket: "${config.influxdb.INFLUX_BUCKET}")
    |> range(start: ${startTime}, stop: ${endTime})
    |> filter(fn: (r) => r._measurement == "${config.influxdb.INFLUX_MEASUREMENT}")`

    queryClient.collectRows(query).then((results) =>{
      res.send(results);
    }).catch((err) =>{
      console.log("[-] Error: ", err);
      res.status(500).json({ error: 'An error occurred while executing the query' });
    })
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: 'An error occurred while executing the query' });
  }
}
