const config = require('../../config/env.config')
const { queryClient } = require('../../config/db.utils')
const dataService = require('../../services/sensorService')

exports.getAllData = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const results = await dataService.getAllData(limit);
    res.send(results);
  } catch (error) {
    console.log("[-] Error: ", error);
    res.status(500).json({ error: 'An error occurred while executing the query' });
  }
};

exports.dataRange = async (req, res, next) => {
  try {
    const {startTime=0, endTime = 'now()'} = req.query;
    const results = await dataService.getDataRange(startTime, endTime);
    res.send(results);
  } catch (error) {
    console.log("[-] Error: ", error);
    res.status(500).json({ error: 'An error occurred while executing the query' });
  }
}
