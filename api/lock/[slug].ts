import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../lib/db.js';
import { threads } from '../lib/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { slug } = req.query;
    const slugStr = Array.isArray(slug) ? slug[0] : slug;

    if (!slugStr) return res.status(400).json({ error: 'Slug required' });

    try {
        const [thread] = await db.update(threads)
            .set({ locked: true })
            .where(eq(threads.slug, slugStr))
            .returning();

        if (!thread) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        return res.status(200).json({ success: true, locked: true });
    } catch (error) {
        console.error('Lock thread error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
