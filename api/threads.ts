import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './lib/db.js';
import { threads, messages } from './lib/schema.js';

function generateSlug(length = 4): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { initialContent, language = 'javascript' } = req.body;

        if (!initialContent?.trim()) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const slug = generateSlug();

        const [thread] = await db.insert(threads).values({ slug }).returning();
        const [message] = await db.insert(messages).values({
            threadId: thread.id,
            content: initialContent,
            language,
            isCode: true,
        }).returning();

        return res.status(201).json({ slug: thread.slug, threadId: thread.id });
    } catch (error) {
        console.error('Create thread error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
