import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Thread {
    id: number;
    slug: string;
    locked: boolean;
    created_at: string;
    messages: Message[];
}

interface Message {
    id: number;
    thread_id: number;
    content: string;
    language: string;
    is_code: boolean;
    created_at: string;
}

function generateSlug(length = 4): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function useCreateThread() {
    return useMutation({
        mutationFn: async (data: { initialContent: string; language?: string }) => {
            const slug = generateSlug();

            // Insert thread
            const { data: thread, error: threadError } = await supabase
                .from('threads')
                .insert({ slug })
                .select()
                .single();

            if (threadError) throw threadError;

            // Insert initial message
            const { error: messageError } = await supabase
                .from('messages')
                .insert({
                    thread_id: thread.id,
                    content: data.initialContent,
                    language: data.language || 'javascript',
                    is_code: true,
                });

            if (messageError) throw messageError;

            return { slug: thread.slug, threadId: thread.id };
        },
    });
}

export function useThread(slug: string) {
    return useQuery<Thread>({
        queryKey: ['thread', slug],
        queryFn: async () => {
            // Get thread
            const { data: thread, error: threadError } = await supabase
                .from('threads')
                .select('*')
                .eq('slug', slug)
                .single();

            if (threadError) throw threadError;

            // Get messages
            const { data: messages, error: messagesError } = await supabase
                .from('messages')
                .select('*')
                .eq('thread_id', thread.id)
                .order('created_at', { ascending: true });

            if (messagesError) throw messagesError;

            return { ...thread, messages: messages || [] };
        },
        enabled: !!slug,
        refetchInterval: 3000,
    });
}

export function useCreateMessage(slug: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { content: string; language?: string }) => {
            // Get thread first
            const { data: thread, error: threadError } = await supabase
                .from('threads')
                .select('id, locked')
                .eq('slug', slug)
                .single();

            if (threadError) throw threadError;
            if (thread.locked) throw new Error('Thread is locked');

            // Insert message
            const { data: message, error: messageError } = await supabase
                .from('messages')
                .insert({
                    thread_id: thread.id,
                    content: data.content,
                    language: data.language || 'javascript',
                    is_code: true,
                })
                .select()
                .single();

            if (messageError) throw messageError;

            return message;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['thread', slug] });
        },
    });
}

export function useLockThread(slug: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { error } = await supabase
                .from('threads')
                .update({ locked: true })
                .eq('slug', slug);

            if (error) throw error;

            return { success: true };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['thread', slug] });
        },
    });
}
