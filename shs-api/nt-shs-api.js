process.env.MONGODB_SUPPRESS_SYSTEM_LOG = 'true';

const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const Sensor = require('./SensorAPIBlueprint');
const Dataset = require('./DatasetAPIBlueprint'); // Add Dataset model
const { apiUser, apiKey, dbIP } = require('./keys.json');

app.use(cors());
app.use(express.json());

const port = 3010;

const connectWithRetry = () => {
    const { apiUser, apiKey, dbIP } = JSON.parse(fs.readFileSync('./keys.json', 'utf8'));

    mongoose.connect(`mongodb://${apiUser}:${apiKey}@${dbIP}:27017/nt-shs?authMechanism=DEFAULT&authSource=admin`, {
    })
        .then(() => {
            console.log('Connected to MongoDB');
            console.log(`Server running on port ${port}\n`);
        })
        .catch((err) => {
            //console.error('Could not connect to MongoDB, maybe check server IP', err);
            console.error('Could not connect to database:\n' +
                "- Check server IP\n" +
                "- Check API login for database"
            );
            console.log('---> Retrying in 5 seconds...\n');
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

//-------------------------Sensor-------------------------//
// Add new sensor
app.post('/api/sensor', async (req, res) => {
    try {
        const { sensorName, sensorType, sensorID } = req.body;
        const newSensor = new Sensor({ sensorName, sensorType, sensorID });
        await newSensor.save();
        res.status(201).send(newSensor);
    } catch (error) {
        console.error('Error adding new sensor:', error);
        res.status(400).send(error);
    }
});

// Get all sensors with latest dataset
app.get('/api/sensors', async (req, res) => {
    try {
        const sensors = await Sensor.find();
        const sensorData = await Promise.all(sensors.map(async sensor => {
            const latestData = await Dataset.findOne({ sensorID: sensor.sensorID }).sort({ date: -1 });
//           console.log(`Fetched latest data for sensorID ${sensor.sensorID}:`, latestData);
            return {
                ...sensor.toObject(),
                latestValue: latestData ? latestData.value : 'N/A',
                lastUpdated: latestData ? latestData.date : 'N/A'
            };
        }));
        res.status(200).send(sensorData);
    } catch (error) {
        console.error('Error fetching sensors:', error);
        res.status(500).send(error);
    }
});

// Delete sensor
app.delete('/api/sensor/:sensorID', async (req, res) => {
    try {
        const { sensorID } = req.params;
        const deletedSensor = await Sensor.findOneAndDelete({ sensorID });
        if (!deletedSensor) {
            return res.status(404).send('Sensor not found');
        }
        res.status(200).send(deletedSensor);
    } catch (error) {
        console.error('Error deleting sensor:', error);
        res.status(400).send(error);
    }
});

//-------------------------Create dataset-------------------------//
app.post('/api/dataset', async (req, res) => {
    try {
        const { sensorID, value } = req.body;
        const date = new Date(); // Create a timestamp
        const newDataset = new Dataset({ sensorID, value, date });
        await newDataset.save();
        res.status(201).send(newDataset);
    } catch (error) {
        console.error('Error adding new dataset:', error);
        res.status(400).send(error);
    }
});

//-------------------------Status requests-------------------------//
app.get('/api/getDBStatus', async (req, res) => {
    try {
        const status = await mongoose.connection.db.admin().serverStatus();
        res.status(200).send({ status });
    } catch (error) {
        console.error('Error fetching database status:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/api/getAPIStatus', async (req, res) => {
    try {
        res.status(200).send({ status: "online" });
    } catch (error) {
        //console.error('Error fetching database status:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

//-------------------------Start Express-------------------------//
app.listen(port, () => {
    //console.log(`Server running on port ${port}`);
});
