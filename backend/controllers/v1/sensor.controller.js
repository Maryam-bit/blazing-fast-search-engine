const config = require('../../config/env.config')
const { queryClient } = require('../../config/db.utils')

exports.getAllData = async (req, res, next) => {
  try {

    console.log(config.influxdb.INFLUX_BUCKET)
    console.log(config.influxdb.INFLUX_MEASUREMENT)

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

exports.dataRange = async (req, res, next) => {
  try {
    const {startTime, endTime = 'now()'} = req.query;

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
