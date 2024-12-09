import { NextResponse } from 'next/server';

export async function GET(req) {
    const url = new URL(req.url);
    const ip = url.searchParams.get('ip');

    try {
        const response = await fetch(`http://${ip}/getSensorStatus`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const status = await response.json();
            return NextResponse.json({ message: 'Sensor status fetched successfully', status }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Failed to fetch sensor status' }, { status: response.status });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
