import { NextResponse } from 'next/server';

export async function POST(req) {
    const url = new URL(req.url);
    const ip = url.searchParams.get('ip');

    try {
        const response = await fetch(`http://${ip}/createNewValues`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return NextResponse.json({ message: 'Sensor triggered successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Failed to trigger sensor' }, { status: response.status });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
