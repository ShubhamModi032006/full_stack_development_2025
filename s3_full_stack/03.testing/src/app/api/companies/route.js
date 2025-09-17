// app/api/companies/route.js
import clientPromise from '../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10', 10), 100);
    const skip = Math.max(parseInt(url.searchParams.get('skip') || '0', 10), 0);
    const name = url.searchParams.get('name');
    const location = url.searchParams.get('location');
    const skill = url.searchParams.get('skill');

    const client = await clientPromise;
<<<<<<< HEAD
    const db = client.db();
    const coll = db.collection('Companies');
=======
    const db = client.db("workbook");          
    const coll = db.collection("companies");  
>>>>>>> 7dcf11bc180a6097a0630f9e2ab5c0c1a21d5056

    const filter = {};
    if (name) filter.name = { $regex: new RegExp(name, 'i') };
    if (location) filter.location = { $regex: new RegExp(location, 'i') };
    if (skill) filter['hiringCriteria.skills'] = { $in: [skill] };

    const items = await coll.find(filter).skip(skip).limit(limit).toArray();
    return NextResponse.json({ count: items.length, items }, { status: 200 });
  } catch (err) {
    console.error('GET /api/companies error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
