import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
    try {
        const { sensors } = await req.json();
        const sensorIPsFilePath = path.resolve('sensorIPs.json');

        const sensorIPsData = JSON.parse(fs.readFileSync(sensorIPsFilePath, 'utf-8'));

        // Füge fehlende Sensor-IDs hinzu
        sensors.forEach(sensor => {
            if (!(sensor.sensorID in sensorIPsData)) {
                sensorIPsData[sensor.sensorID] = '';
            }
        });

        // Entferne Sensor-IDs, die nicht mehr vorhanden sind
        Object.keys(sensorIPsData).forEach(sensorID => {
            if (!sensors.some(sensor => sensor.sensorID === sensorID)) {
                delete sensorIPsData[sensorID];
            }
        });

        fs.writeFileSync(sensorIPsFilePath, JSON.stringify(sensorIPsData, null, 2));

        return NextResponse.json({ message: 'Sensor IPs updated' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating sensor IPs', error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { sensorID, newIP } = await req.json();
        const sensorIPsFilePath = path.resolve('sensorIPs.json');

        const sensorIPsData = JSON.parse(fs.readFileSync(sensorIPsFilePath, 'utf-8'));

        // Aktualisiere die IP für die gegebene Sensor-ID
        if (sensorID in sensorIPsData) {
            sensorIPsData[sensorID] = newIP;
        } else {
            return NextResponse.json({ message: 'Sensor ID not found' }, { status: 404 });
        }

        fs.writeFileSync(sensorIPsFilePath, JSON.stringify(sensorIPsData, null, 2));

        return NextResponse.json({ message: 'Sensor IP updated' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating sensor IP', error: error.message }, { status: 500 });
    }
}
