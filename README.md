[![Backend Tests](https://gitlab.com/cowlar/dojo/abdullah-shafique/weather-station/badges/main/pipeline.svg)](gitlab.com/cowlar/dojo/abdullah-shafique/weather-station)
# Weather Station App Backend

A simple weather station app to display current weather forecast and provide mqtt connection to get live temperature and humidity updates.

## Table of Contents

- [Weather Station App Backend](#weather-station-app-backend)
  - [Table of Contents](#table-of-contents)
  - [Technologies](#technologies)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Usage](#usage)
  - [Docker](#docker)
  - [Tests](#tests)


## Technologies

The Task Manager App is built using the following technologies:

- Frontend:
  - React: JavaScript library for building user interfaces.
  - Tailwind: Ui framework
  - DaisyUI: Ui framework for Tailwind with theme support
  - HTML5 and CSS3: Markup and styling.

- Backend:
  - Node.js: JavaScript runtime for server-side development.
  - Express.js: Web application framework for Node.js.
  - JWT: JWT token based authentication
  - Sequelize: MySQL database connection library for storing User data.
  - Jest: Testing framework for Node.js.
  - MQTT: MQTT client to connect with VerneMQ Broker
  - VerneMQ Broker: MQTT Broker server by VerneMQ
  - InfluxDB: InfluxDb to store weather data

- Deployment:
  - Docker: Containerization platform for packaging the app.
  - Docker Compose: Tool for defining and running multi-container Docker applications.

- GitLab Pipeline:
  - CI/CD pipeline for running tests.

## Getting Started

To get started with the `weather station app` backend, follow these steps:

### Installation

1. Clone the repository:

   ```shell
   git clone https://gitlab.com/cowlar/dojo/abdullah-shafique/weather-station
   ```

2. Navigate to the project directory:

   ```shell
   cd weather-station
   ```

3. Install the dependencies:

   ```shell
   npm install
   ```

### Usage

1. Add the `.env` file in the backend directory with the following (Check the example.env file)

2. Start the backend server. This will start the backend server on `http://localhost:3000`:

   ```shell
   npm run dev
   ```

## Docker

To run the Task Manager App using Docker, follow these steps:

1. Add the `.env` file in the backend directory with the following (Check the example.env file)
   
2. Docker-Compose:

   ```shell
   sudo docker-compose up
   ```

## Tests
To run the tests, follow these steps:
1. Add .env file with the following (Check the example.env file).

2. Run the tests:

   ```shell
   npm run test
   ```