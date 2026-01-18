import { pgTable, serial, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';

export const threads = pgTable('threads', {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    locked: boolean('locked').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    threadId: integer('thread_id').references(() => threads.id).notNull(),
    content: text('content').notNull(),
    language: text('language').default('javascript'),
    isCode: boolean('is_code').default(true),
    createdAt: timestamp('created_at').defaultNow(),
});

export type Thread = typeof threads.$inferSelect;
export type Message = typeof messages.$inferSelect;
