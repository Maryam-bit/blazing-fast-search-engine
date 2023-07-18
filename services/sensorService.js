const config = require('../config/env.config')
const { queryClient } = require('../config/db.utils')

exports.getAllData = async (limit) => {
    const query = `from(bucket: "${config.influxdb.INFLUX_BUCKET}")
    |> range(start: 0)
    |> filter(fn: (r) => r["_measurement"] == "${config.influxdb.INFLUX_MEASUREMENT}")
    |> filter(fn: (r) => r["_field"] == "humidity" or r["_field"] == "temperature")
    |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> keep(columns: ["_time","humidity", "temperature"])
    |> limit(n: ${limit})
    `
  
    return queryClient.collectRows(query)
}

exports.getDataRange = async (startTime, endTime) => {
    const query = `from(bucket: "${config.influxdb.INFLUX_BUCKET}")
    |> range(start: ${startTime}, stop: ${endTime})
    |> filter(fn: (r) => r._measurement == "${config.influxdb.INFLUX_MEASUREMENT}")
    |> filter(fn: (r) => r["_field"] == "humidity" or r["_field"] == "temperature")
    |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> keep(columns: ["_time","humidity", "temperature"])`

    return queryClient.collectRows(query)
}