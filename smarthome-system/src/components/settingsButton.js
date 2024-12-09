"use client";

import React, { useState } from 'react';
import './component.css';

const { dbIP, fetchInterval } = require("../../keys.json");

const SettingsButton = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [ip, setIp] = useState(dbIP);
    const [interval, setInterval] = useState(fetchInterval);
    const [message, setMessage] = useState('');

    const togglePopup = () => {
        setShowPopup(!showPopup);
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/updateSettings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ip, interval }),
        });
        if (response.ok) {
            //setMessage('Settings updated successfully');
            setShowPopup(false);
            window.location.reload();
        } else {
            console.log("Error updating settings")
            //setMessage('Error updating settings');
        }
    };

    return (
        <div className='flex justify-center'>
            <button
                onClick={togglePopup}
                className='ps-5'
            >
                <img className='svg' src='/gear-fill.svg'></img>
            </button>
            {showPopup && (
                <div className="popup-container" style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 style={{color: "black"}}>Settings</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label style={{color: "black"}}>Server IP:</label>
                            <input
                                type="text"
                                value={ip}
                                onChange={(e) => setIp(e.target.value)}
                                placeholder={dbIP}
                                style={{
                                    width: '100%',
                                    padding: '5px',
                                    margin: '10px 0',
                                    backgroundColor: '#f0f0f0',
                                    color: "black"
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{color: "black"}}>Fetch Interval (ms):</label>
                            <input
                                type="number"
                                value={interval}
                                onChange={(e) => setInterval(e.target.value)}
                                placeholder={fetchInterval}
                                style={{
                                    width: '100%',
                                    padding: '5px',
                                    margin: '10px 0',
                                    backgroundColor: '#f0f0f0',
                                    color: "black"
                                }}
                            />
                        </div>
                        {message && <p>{message}</p>}

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
                                marginTop: '10px',
                                marginRight: '10px'
                            }}
                        >
                            Close
                        </button>

                        <button
                            type="submit"
                            style={{
                                background: 'green',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '10px',
                                marginRight: '10px'
                            }}
                        >
                            Submit
                        </button>

                    </form>
                </div>
            )}
        </div>
    );
};

export default SettingsButton;
