"use client";

import React, { useState, useEffect, useRef } from 'react';
import './component.css';

const { dbIP } = require("../../keys.json");
const sensorIPs = require('../../sensorIPs.json');

const InfoStatus = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [dbStatus, setDbStatus] = useState('red');
    const [apiStatus, setApiStatus] = useState('red');
    const [sensors, setSensors] = useState([]);
    const [sensorStatuses, setSensorStatuses] = useState({});
    const [sensorFetchError, setSensorFetchError] = useState(false);
    const controllerRef = useRef(null); // To store AbortController instances

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const fetchStatuses = async () => {
        try {
            const dbResponse = await fetch('/api/fetchDBStatus', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: controllerRef.current.signal,
            });
            if (dbResponse.ok) {
                const dbData = await dbResponse.json();
                setDbStatus(dbData.status ? 'green' : 'red');
            } else {
                console.error(`Failed to fetch DB status: ${dbResponse.statusText}`);
                setDbStatus('red');
            }

            const apiResponse = await fetch('/api/fetchAPIStatus', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: controllerRef.current.signal,
            });
            if (apiResponse.ok) {
                const apiData = await apiResponse.json();
                setApiStatus(apiData.status ? 'green' : 'red');
            } else {
                console.error(`Failed to fetch API status: ${apiResponse.statusText}`);
                setApiStatus('red');
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted');
            } else {
                console.error('Error fetching statuses:', error);
                setDbStatus('red');
                setApiStatus('red');
            }
        }
    };

    const fetchSensorStatus = async (sensorID, ip) => {
        try {
            const statusResponse = await fetch(`/api/fetchSensorStatus?ip=${ip}`, {
                signal: controllerRef.current.signal,
            });
            if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                setSensorStatuses(prevStatuses => ({
                    ...prevStatuses,
                    [sensorID]: statusData.status ? 'green' : 'red'
                }));
            } else {
                setSensorStatuses(prevStatuses => ({
                    ...prevStatuses,
                    [sensorID]: 'red'
                }));
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`Fetch for sensor ${sensorID} aborted`);
            } else {
                setSensorStatuses(prevStatuses => ({
                    ...prevStatuses,
                    [sensorID]: 'red'
                }));
                console.error(`Error fetching status for sensor ${sensorID}: ${error.message}`);
            }
        }
    };

    const fetchSensors = async () => {
        try {
            const response = await fetch(`http://${dbIP}:3010/api/sensors`, {
                signal: controllerRef.current.signal,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSensors(Array.isArray(data) ? data : []);
            setSensorFetchError(false); // Reset error state if fetch is successful

            // Fetch status for each sensor
            for (const sensor of data) {
                const ip = sensorIPs[sensor.sensorID];
                if (ip) {
                    fetchSensorStatus(sensor.sensorID, ip);
                } else {
                    setSensorStatuses(prevStatuses => ({
                        ...prevStatuses,
                        [sensor.sensorID]: 'red'
                    }));
                }
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted');
            } else {
                console.error('Error fetching sensor data:', error.message);
                setSensors([]);
                setSensorFetchError(true); // Set error state if fetch fails
            }
        }
    };

    useEffect(() => {
        if (showPopup) {
            controllerRef.current = new AbortController(); // Create a new controller instance

            fetchStatuses();
            fetchSensors();
            const intervalId = setInterval(() => {
                fetchStatuses();
                fetchSensors();
            }, 2000); // Reduced interval to 2 seconds

            return () => {
                clearInterval(intervalId); // Cleanup interval on popup close
                controllerRef.current.abort(); // Abort all outstanding requests
            };
        }
    }, [showPopup]);

    return (
        <div className='flex justify-center'>
            <button onClick={togglePopup}><img className='svg' src='/info-circle.svg' alt='Status' style={{ filter: 'invert(1)' }}></img></button>
            {showPopup && (
                <div className="popup-container" style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                    width: 'auto', // Dynamic width
                    maxWidth: '400px' // Limit max width
                }}>
                    <h2 style={{color: "black", fontWeight: 'bold', textAlign: 'center'}}>Status</h2>
                    <br />
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '20px' }}>
                        <label style={{color: "black", fontWeight: 'bold'}}>Database</label>
                        <span className="status-circle" style={{
                            background: dbStatus,
                            borderRadius: '50%',
                            display: 'inline-block',
                            width: '10px',
                            height: '10px',
                            marginLeft: '10px' // Add margin
                        }}></span>
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '20px' }}>
                        <label style={{color: "black", fontWeight: 'bold'}}>API</label>
                        <span className="status-circle" style={{
                            background: apiStatus,
                            borderRadius: '50%',
                            display: 'inline-block',
                            width: '10px',
                            height: '10px',
                            marginLeft: '10px' // Add margin
                        }}></span>
                    </div>
                    <br /> {/* Add spacing here */}
                    {sensorFetchError ? (
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '20px' }}>
                            <label style={{color: "black", fontWeight: 'bold'}}>No sensors</label>
                        </div>
                    ) : (
                        sensors.map(sensor => (
                            <div key={sensor.sensorID} className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '20px' }}>
                                <label style={{color: "black", fontWeight: 'bold'}}>
                                    {sensor.sensorName} - {sensor.sensorType}
                                </label>
                                <span className="status-circle" style={{
                                    background: sensorStatuses[sensor.sensorID] || 'red', // Default to red if status is undefined
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    width: '10px',
                                    height: '10px',
                                    marginLeft: '10px' // Add margin
                                }}></span>
                            </div>
                        ))
                    )}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={togglePopup}
                            style={{
                                background: 'red',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoStatus;
