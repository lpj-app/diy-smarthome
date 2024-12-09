"use client";

import React, { useState } from 'react';
import './component.css'; // Import the CSS file

const { dbIP } = require("../../keys.json");

const SensorButton = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [sensorName, setSensorName] = useState('');
    const [sensorType, setSensorType] = useState('');
    const [sensorID, setSensorID] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://${dbIP}:3010/api/sensor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sensorName, sensorType, sensorID }),
            });
            if (response.ok) {
                // Clear the input fields
                setSensorName('');
                setSensorType('');
                setSensorID('');
                setShowPopup(false);
                window.location.reload();
            } else {
                console.error('Failed to add sensor:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div className="fixed bottom-24 right-4">
            <button
                className="bg-textColor hover:opacity-80 text-white px-4 py-2 rounded-full shadow-lg"
                onClick={() => setShowPopup(true)}
            >
                Add Sensor
            </button>
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl mb-4 text-blue-600">Add Sensor</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Sensor Name <span className="info">ℹ️
                                    <span className="info-text">
                                        <p className={"info-head"}>Definition Sensor Name:</p>
                                        <ul>
                                            <li>Geben sie den Raum des Sensors an.</li>
                                            <li>Halten Sie den Namen kurz und prägnant.</li>
                                            <li>Vermeiden Sie Sonderzeichen.</li>
                                            <li>Bspw. Bad, Wohnzimmer, ...</li>
                                        </ul>
                                    </span>
                                </span></label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded text-black"
                                    value={sensorName}
                                    onChange={(e) => setSensorName(e.target.value)}
                                    placeholder={"Ort des Sensors"}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Sensor Type <span className="info">ℹ️
                                    <span className="info-text">
                                        <p className={"info-head"}>Definition Sensor-Typ:</p>
                                        <ul>
                                            <li>Geben Sie die Art des Sensors an.</li>
                                            <li>Beispiel: Temperatursensor, Feuchtigkeitssensor.</li>
                                        </ul>
                                    </span>
                                </span></label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded text-black"
                                    value={sensorType}
                                    onChange={(e) => setSensorType(e.target.value)}
                                    placeholder={"Art (Temperatursensor, ...)"}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Sensor ID <span className="info">ℹ️
                                    <span className="info-text">
                                        <p className={"info-head"}>Eindeutiges Kürzel definieren:</p>
                                        <ul>
                                            <li>Zusammensetzung aus:</li>
                                            <li>Ort, Art, Anzahl</li>
                                            <li>Bspw: Küche, Temperatur, 1</li>
                                            <li>kt1</li>
                                        </ul>
                                    </span>
                                </span></label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded text-black"
                                    value={sensorID}
                                    onChange={(e) => setSensorID(e.target.value)}
                                    placeholder={"Eindeutiges Kürzel"}
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-4 px-4 py-2 bg-red-700 rounded"
                                    onClick={() => setShowPopup(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-700 text-white rounded"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SensorButton;
