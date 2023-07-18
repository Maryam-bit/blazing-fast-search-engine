FROM node:19-buster-slim

LABEL maintainer="Abdullah"
LABEL version="1.0"
LABEL description="This is the backend server for the Weather Station app"
LABEL environment="development"

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# General App Settings
ENV NODE_ENV=development
ENV SECRET=secret
ENV PORT=3000

# INFLUXDB General Config
ENV INFLUXDB_USERNAME=root
ENV INFLUXDB_PASS=root
ENV INFLUXDB_HOST=http://localhost
ENV INFLUXDB_PORT=8086

# INFLUXDB Development Config
ENV INFLUX_DATABASE_DEV=weather_dev
ENV INFLUX_MEASUREMENT_DEV=weather_data
ENV TOPIC_DEV=Weather_Data
ENV INFLUX_ORG=Cowlar
ENV INFLUX_BUCKET=weather_data
ENV INFLUX_TOKEN=61lhcUUm4pW8qg2dtNo5zrW-7qTxR0GT38dDIdskKxG6cprYcvsuClzqPbl_BWoN_I-DOtB3LpAl7D2czj367w==
ENV INFLUX_MEASUREMENT=weather_measurement

# MySQL Development Config
ENV MYSQL_USERNAME_DEV=root
ENV MYSQL_PASSWORD_DEV=root
ENV MYSQL_DATABASE_DEV=database_development
ENV MYSQL_HOST_DEV=127.0.0.1

#MQTT configuration
ENV MQTT_PROTOCOL=mqtt://
ENV MQTT_HOST_DEV=127.0.0.1
ENV MQTT_PORT_DEV=1883,

EXPOSE 3000
EXPOSE 3306
EXPOSE 8086
EXPOSE 1883
CMD [ "npm", "run", "dev" ]