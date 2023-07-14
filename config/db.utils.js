const config = require('./env.config');
const {InfluxDB, Point} = require('@influxdata/influxdb-client')

let url = config.influxdb.INFLUXDB_HOST + ":" + config.influxdb.INFLUX_PORT
let token = config.influxdb.INFLUX_TOKEN

const client = new InfluxDB({url, token})
let writeClient = client.getWriteApi(config.influxdb.INFLUX_ORG, config.influxdb.INFLUX_BUCKET, 'ns')
let queryClient = client.getQueryApi(config.influxdb.INFLUX_ORG)

module.exports = {
    client,
    writeClient,
    queryClient
}