const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
    sensorID: String,
    value: String,
    date: Date
}, { collection: 'dataset', versionKey: false });

const Dataset = mongoose.model('Dataset', datasetSchema);

module.exports = Dataset;
