import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Thread {
    id: number;
    slug: string;
    locked: boolean;
    createdAt: string;
    messages: Message[];
}

interface Message {
    id: number;
    threadId: number;
    content: string;
    language: string;
    isCode: boolean;
    createdAt: string;
}

export function useCreateThread() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { initialContent: string; language?: string }) => {
            const res = await fetch('/api/threads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create thread');
            return res.json() as Promise<{ slug: string; threadId: number }>;
        },
    });
}

export function useThread(slug: string) {
    return useQuery<Thread>({
        queryKey: ['thread', slug],
        queryFn: async () => {
            const res = await fetch(`/api/threads/${slug}`);
            if (!res.ok) throw new Error('Thread not found');
            return res.json();
        },
        enabled: !!slug,
        refetchInterval: 3000,
    });
}

export function useCreateMessage(slug: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { content: string; language?: string }) => {
            const res = await fetch(`/api/messages/${slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to send message');
            return res.json() as Promise<Message>;
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
            const res = await fetch(`/api/lock/${slug}`, {
                method: 'POST',
            });
            if (!res.ok) throw new Error('Failed to lock thread');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['thread', slug] });
        },
    });
}
