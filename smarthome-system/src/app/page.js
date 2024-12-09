"use client";

import React, { useEffect, useState } from 'react';
import { Navbar, Footer } from '@/components/pageLayout';
import SensorButton from "@/components/addSensor";
import Sensor from "@/components/Sensor";

const { dbIP, fetchInterval } = require("../../keys.json");

export default function Home() {
    const [sensors, setSensors] = useState([]);

    const fetchSensors = async () => {
        try {
            const response = await fetch(`http://${dbIP}:3010/api/sensors`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched sensor data:', data);
            setSensors(Array.isArray(data) ? data : []);
            await updateSensorIPs(data);
        } catch (error) {
            console.error('Error fetching sensor data:', error.message);
        }
    };

    const updateSensorIPs = async (sensors) => {
        try {
            const response = await fetch('/api/updateSensorSettings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sensors })
            });
            if (!response.ok) {
                console.error(`Error updating sensor IPs:`, response.statusText);
            }
        } catch (error) {
            console.error('Error updating sensor IPs:', error.message);
        }
    };

    useEffect(() => {
        fetchSensors();
        const interval = setInterval(fetchSensors, fetchInterval);

        return () => clearInterval(interval);
    }, []);

    const groupedSensors = sensors.reduce((acc, sensor) => {
        const key = sensor.sensorName.toLowerCase();
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(sensor);
        return acc;
    }, {});

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="p-3" style={{ flex: 1 }}>
                {Object.keys(groupedSensors).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-9">
                        {Object.keys(groupedSensors).map((sensorName) => (
                            <div className="text-center rounded-xl py-5 bg-textColor mt-10" key={sensorName}>
                                <h2 className="text-xl font-bold text-white w-full mb-2">
                                    {sensorName.charAt(0).toUpperCase() + sensorName.slice(1).toLowerCase()}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2">
                                    {groupedSensors[sensorName].map((sensor) => (
                                        <Sensor
                                            key={sensor._id}
                                            sensorRoom={sensor.sensorRoom}
                                            sensorType={sensor.sensorType}
                                            latestValue={sensor.latestValue !== undefined ? sensor.latestValue : 'N/A'}
                                            lastUpdated={sensor.lastUpdated}
                                            sensorID={sensor.sensorID}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-center" style={{height: "70vh"}}>
                        <p className="text-2xl font-bold bg-textColor rounded-lg">No sensor data available</p>
                        <ul className="list-disc text-left mt-4 text-gray-350">
                            <li>Verify network connection</li>
                            <li>Check for server connection and correct ip</li>
                            <li>Ensure the API is running</li>
                            <li>Already added sensors?</li>
                        </ul>
                    </div>
                )}
            </div>
            <SensorButton />
            <Footer />
        </div>
    );
}
