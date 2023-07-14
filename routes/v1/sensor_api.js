var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
const sensorController = require('../../controllers/v1/sensor.controller')
const validator = require('../../middlewares/validatator')
const sensorSchema = require('../../schemas/sensor.schema')
dotenv.config();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  res.send("Sensor Router");
});

// GET all data and number of data points by limit
router.get("/alldata/", sensorController.getAllData);

//GET all data between timestamps
// router.post("/duration-data/", validator(sensorSchema.duration_data) ,sensorController.durationData);

// GET all data between startTime and endTime (Query params)
router.get("/data/range", sensorController.dataRange);

module.exports = router;
