import express from 'express';
import cors from 'cors';
import { db } from './api/lib/db';
import { threads, messages } from './api/lib/schema';
import { eq } from 'drizzle-orm';

const app = express();
app.use(cors());
app.use(express.json());

function generateSlug(length = 4): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// POST /api/threads
app.post('/api/threads', async (req, res) => {
    try {
        const { initialContent, language = 'javascript' } = req.body;
        if (!initialContent?.trim()) {
            return res.status(400).json({ error: 'Content is required' });
        }
        const slug = generateSlug();
        const [thread] = await db.insert(threads).values({ slug }).returning();
        await db.insert(messages).values({
            threadId: thread.id,
            content: initialContent,
            language,
            isCode: true,
        });
        res.status(201).json({ slug: thread.slug, threadId: thread.id });
    } catch (error) {
        console.error('Create thread error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/threads/:slug
app.get('/api/threads/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const [thread] = await db.select().from(threads).where(eq(threads.slug, slug));
        if (!thread) {
            return res.status(404).json({ error: 'Thread not found' });
        }
        const threadMessages = await db.select().from(messages).where(eq(messages.threadId, thread.id));
        res.json({ ...thread, messages: threadMessages });
    } catch (error) {
        console.error('Get thread error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/messages/:slug
app.post('/api/messages/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { content, language = 'javascript' } = req.body;
        if (!content?.trim()) {
            return res.status(400).json({ error: 'Content is required' });
        }
        const [thread] = await db.select().from(threads).where(eq(threads.slug, slug));
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
        res.status(201).json(message);
    } catch (error) {
        console.error('Create message error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/lock/:slug
app.post('/api/lock/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const [thread] = await db.update(threads)
            .set({ locked: true })
            .where(eq(threads.slug, slug))
            .returning();
        if (!thread) {
            return res.status(404).json({ error: 'Thread not found' });
        }
        res.json({ success: true, locked: true });
    } catch (error) {
        console.error('Lock thread error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
