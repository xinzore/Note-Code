import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../lib/db.js';
import { threads, messages } from '../lib/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { slug } = req.query;
    const slugStr = Array.isArray(slug) ? slug[0] : slug;

    if (!slugStr) return res.status(400).json({ error: 'Slug required' });

    try {
        const [thread] = await db.select().from(threads).where(eq(threads.slug, slugStr));

        if (!thread) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        const threadMessages = await db.select().from(messages).where(eq(messages.threadId, thread.id));

        return res.status(200).json({
            ...thread,
            messages: threadMessages,
        });
    } catch (error) {
        console.error('Get thread error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
