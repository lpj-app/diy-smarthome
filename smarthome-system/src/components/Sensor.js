"use client";

import React, { useState, useEffect } from 'react';
import EditSensor from "@/components/EditSensor";

export default function Sensor({ sensorRoom, sensorType, latestValue, lastUpdated, sensorID }) {
    const [isEditing, setIsEditing] = useState(false);
    const [sensorData, setSensorData] = useState({ sensorRoom, sensorType, latestValue, lastUpdated, sensorID });
    const [showEditButton, setShowEditButton] = useState(false);

    useEffect(() => {
        setSensorData({ sensorRoom, sensorType, latestValue, lastUpdated, sensorID });
    }, [sensorRoom, sensorType, latestValue, lastUpdated, sensorID]);

    const formattedDate = lastUpdated !== 'N/A' ? new Date(lastUpdated).toLocaleDateString('de-DE') : 'N/A';
    const formattedTime = lastUpdated !== 'N/A' ? new Date(lastUpdated).toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
    }) : 'N/A';
    const formattedDateTime = lastUpdated !== 'N/A' ? `${formattedDate} - ${formattedTime}` : 'N/A';

    const handleSave = (updatedSensor) => {
        setSensorData(updatedSensor);
        setIsEditing(false);
    };

    const handleDelete = (sensorID) => {
        console.log('Sensor deleted:', sensorID);
        setIsEditing(false);
    };

    return (
        <div className='flex justify-center mt-5 relative'>
            <div className='bg-CardBackground rounded-xl text-center text-textColor px-3 w-60'
                 onMouseEnter={() => setShowEditButton(true)}
                 onMouseLeave={() => setShowEditButton(false)}
                 style={{ zIndex: isEditing ? 'auto' : 'initial' }} // Ensure sensor object z-index is not higher
            >
                <div className='font-bold text-white mt-1'>{sensorData.sensorRoom}</div>
                <div className='bg-cardItem cardItem rounded-xl'>
                    <p>Type: {sensorData.sensorType}</p>
                </div>
                <div className='bg-cardItem cardItem rounded-xl'>
                    <p>Value: {sensorData.latestValue}</p>
                </div>
                <div>
                    <p className='cardItem mb-3 rounded-xl bg-cardItem text-sm'>
                        {formattedDateTime}
                    </p>
                </div>
                {showEditButton && (
                    <button
                        className="my-2 bg-textColor hover:opacity-80 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setIsEditing(true)}
                    >
                        EDIT
                    </button>
                )}
            </div>
            {isEditing && (
                <div style={{ position: 'fixed', zIndex: 9999 }}> {/* Ensure popup is above other content */}
                    <EditSensor
                        sensor={sensorData}
                        onClose={() => setIsEditing(false)}
                        onSave={handleSave}
                        onDelete={handleDelete}
                    />
                </div>
            )}
        </div>
    );
}
