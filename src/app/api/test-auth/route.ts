import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';

export async function GET() {
  try {
    const token = process.env.SANITY_API_TOKEN;
    if (!token) {
        return NextResponse.json({ success: false, error: "No Token Found" });
    }

    // Try to create a temp doc
    const doc = { _type: 'test-doc', name: 'Test Write' };
    const created = await writeClient.create(doc);
    
    // Clean up
    await writeClient.delete(created._id);

    return NextResponse.json({ success: true, message: "Write successful", tokenIdPartial: token.substring(0, 5) + "..." });
  } catch (error: any) {
    console.error("Sanity Write Test Failed:", error);
    return NextResponse.json({ success: false, error: error.message, stack: error.stack });
  }
}
