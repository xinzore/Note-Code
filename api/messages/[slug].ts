import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../lib/db';
import { threads, messages } from '../lib/schema';
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
        const { content, language = 'javascript' } = req.body;

        if (!content?.trim()) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const [thread] = await db.select().from(threads).where(eq(threads.slug, slugStr));

        if (!thread) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        if (thread.locked) {
            return res.status(403).json({ error: 'Thread is locked' });
        }

        const [message] = await db.insert(messages).values({
            threadId: thread.id,
            content,
            language,
            isCode: true,
        }).returning();

        return res.status(201).json(message);
    } catch (error) {
        console.error('Create message error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
