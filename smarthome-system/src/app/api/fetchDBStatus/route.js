import { NextResponse } from 'next/server';

const { dbIP } = require("../../../../keys.json");

export async function GET(req) {
    try {
        const response = await fetch(`http://${dbIP}:3010/api/getDBStatus`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const status = await response.json();
            return NextResponse.json({ message: 'Database status fetched successfully', status }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Failed to fetch database status' }, { status: response.status });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
