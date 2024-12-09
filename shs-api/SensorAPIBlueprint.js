const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    sensorName: { type: String, required: true },
    sensorType: { type: String, required: true },
    sensorID: { type: String, required: true }
}, { collection: 'sensor', versionKey: false });

const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;