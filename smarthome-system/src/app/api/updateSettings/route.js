import fs from 'fs';
import path from 'path';

export async function POST(req) {
    const { ip, interval } = await req.json();
    const filePath = path.resolve('keys.json');

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        data.dbIP = ip;
        data.fetchInterval = interval;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return new Response(JSON.stringify({ message: 'Settings updated' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error updating settings' }), { status: 500 });
    }
}
