import React, { useState } from 'react';
import './component.css';

const {dbIP} = require('../../keys.json');

const sensorIPs = require("../../sensorIPs.json");

const EditSensor = ({ sensor, onClose, onSave, onDelete }) => {
    const sensorID = sensor?.sensorID || ''; // sensorID Textfeld placeholder
    const defaultIp = sensorIPs[sensorID] || 'No IP available';
    const [ipAddress, setIpAddress] = useState('');

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Aktualisiere die IP in der sensorIPs.json Datei
            const response = await fetch('/api/updateSensorSettings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sensorID, newIP: ipAddress })
            });

            if (response.ok) {
                onSave({ sensorID, ipAddress });
                onClose();
            } else {
                console.error('Failed to save sensor IP:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://${dbIP}:3010/api/sensor/${sensorID}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                onDelete(sensorID);
                onClose();
                window.location.reload();
            } else {
                console.error('Failed to delete sensor:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative">
                <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>X</button>
                <h2 className="text-xl mb-4 text-black">Edit sensor</h2>
                <form onSubmit={handleSave}>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="ipAddress">Physical sensor IP:</label>
                        <input
                            type="text"
                            id="ipAddress"
                            className="w-full px-3 py-2 rounded bg-gray-200 border-2 text-black"
                            value={ipAddress}
                            onChange={(e) => setIpAddress(e.target.value)}
                            placeholder={defaultIp}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Virtual sensor ID:</label>
                        <div
                            className="w-full px-3 py-2 rounded text-black bg-gray-200 cursor-not-allowed border-2">
                            {sensorID}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="mr-4 px-4 py-2 bg-red-700 text-white rounded"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                        <button
                            type="submit"
                            className="mr-4 px-4 py-2 bg-green-700 text-white rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSensor;
