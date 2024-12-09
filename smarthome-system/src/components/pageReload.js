"use client";

import React from 'react';
import './component.css';

const sensorIPs = require('../../sensorIPs.json');

const PageReloadButton = () => {
    const handleReload = async () => {
        try {
            // Fetch sensor IPs from the JSON file
            const ips = Object.values(sensorIPs);

            for (const ip of ips) {
                const response = await fetch(`/api/requestSensorData?ip=${ip}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                console.log(`Response from ${ip}:`, data);

                if (response.ok) {
                    console.log(`Sensor data request sent successfully to ${ip}`);
                } else {
                    console.error(`Failed to send sensor data request to ${ip}`, data);
                }
            }
        } catch (error) {
            console.error('Error sending sensor data request', error);
        }
    };

    return (
        <div className='flex justify-center'>
            <button onClick={handleReload}><img className='svg mr-4' src='/arrow-clockwise.svg' alt='Reload page'></img></button>
        </div>
    );
};

export default PageReloadButton;
