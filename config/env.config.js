require("dotenv").config();

const config = {
    development: {
        port: process.env.PORT || 3000,
        secret: process.env.SECRET || "secret",
        origin_url: process.env.ORIGIN_URL || "http://localhost:5173",
        influxdb: {
            INFLUXDB_USERNAME: process.env.INFLUXDB_USERNAME || "root",
            INFLUXDB_PASS: process.env.INFLUXDB_PASS || "root",
            INFLUXDB_HOST: process.env.INFLUXDB_HOST || "http://localhost",
            INFLUX_DATABASE: process.env.INFLUX_DATABASE_DEV || "weather_dev",
            INFLUX_PORT: process.env.INFLUXDB_PORT || 8086,
            INFLUX_ORG: process.env.INFLUX_ORG || "Cowlar",
            INFLUX_BUCKET: process.env.INFLUX_BUCKET || "weather_data",
            INFLUX_TOKEN: process.env.INFLUX_TOKEN,
            INFLUX_MEASUREMENT: process.env.INFLUX_MEASUREMENT || "weather_measurement"
        },
        mysql: {
            username: process.env.MYSQL_USERNAME_DEV || "root",
            password: process.env.MYSQL_PASSWORD_DEV || "root",
            database: process.env.MYSQL_DATABASE_DEV || "database_development",
            host: process.env.MYSQL_HOST_DEV || "127.0.0.1",
            port: process.env.MYSQL_PORT || 3306,
            dialect: "mysql"
        },
        mqtt: {
            protocol: process.env.MQTT_PROTOCOL || "mqtt://",
            host: process.env.MQTT_HOST_DEV || "127.0.0.1",
            port: process.env.MQTT_PORT_DEV || 1883,
            TOPIC: process.env.TOPIC_DEV || "Weather_Data",
        }
    },
    test: {
        port: process.env.PORT || 3000,
        secret: process.env.SECRET || "secret",
        origin_url: process.env.ORIGIN_URL || "http://localhost:5173",
        influxdb: {
            INFLUXDB_USERNAME: process.env.INFLUXDB_USERNAME || "root",
            INFLUXDB_PASS: process.env.INFLUXDB_PASS || "root",
            INFLUXDB_HOST: process.env.INFLUXDB_HOST || "localhost",
            measurement: process.env.INFLUXDB_DATABASE_TEST || "test_measurement",
            INFLUX_DATABASE: process.env.INFLUX_DATABASE_TEST || "weather_test",
            INFLUX_PORT: process.env.INFLUXDB_PORT || 8086,
            INFLUX_ORG: process.env.INFLUX_ORG || "Cowlar",
            INFLUX_BUCKET: process.env.INFLUX_BUCKET_TEST || "weather_data",
            INFLUX_TOKEN: process.env.INFLUX_TOKEN,
            INFLUX_MEASUREMENT: process.env.INFLUX_MEASUREMENT_TEST || "test_measurement"
        },
        mysql: {
            username: process.env.MYSQL_USERNAME_TEST || "root",
            password: process.env.MYSQL_PASSWORD_TEST || "root",
            database: process.env.MYSQL_DATABASE_TEST || "database_test",
            host: process.env.MYSQL_HOST_TEST || "127.0.0.1",
            port: process.env.MYSQL_PORT || 3306,
            dialect: "mysql"
        },
        mqtt: {
            protocol: process.env.MQTT_PROTOCOL || "mqtt://",
            host: process.env.MQTT_HOST_DEV || "127.0.0.1",
            port: process.env.MQTT_PORT_DEV || 1883,
            TOPIC: process.env.TOPIC_TEST || "Weather_Data",
        }
    },
    production: {
        port: process.env.PORT || 3000,
        secret: process.env.SECRET || "secret",
        origin_url: process.env.ORIGIN_URL || "http://localhost:5173",
        influxdb: {
            INFLUXDB_USERNAME: process.env.INFLUXDB_USERNAME || "root",
            INFLUXDB_PASS: process.env.INFLUXDB_PASS || "root",
            INFLUXDB_HOST: process.env.INFLUXDB_HOST || "localhost",
            measurement: process.env.INFLUXDB_DATABASE_PROD || "test_measurement",
            INFLUX_DATABASE: process.env.INFLUX_DATABASE_PROD || "weather_test",
        },
        mqtt: {
            protocol: process.env.MQTT_PROTOCOL || "mqtt://",
            host: process.env.MQTT_HOST_DEV || "127.0.0.1",
            port: process.env.MQTT_PORT_DEV || 1883,
            TOPIC: process.env.TOPIC_TEST || "Weather_Data",
        }
    }
}

module.exports = config[process.env.NODE_ENV || 'development'];