'use client';

import useSWR from 'swr';
import { useEffect, useRef } from 'react';
import { pusherClient } from '@/lib/pusherClient';
import PostActions from './PostActions';

interface PostProps {
    _id: string;
    tag: string;
    businessName?: string | null;
    time: string;
    title: string;
    content: string;
    likes: number;
    shares: number;
    likedBy?: string[];
}

const fetcher = async (url: string): Promise<PostProps[]> => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch');
    const { data } = await res.json();
    return data;
};

function formatRelativeTime(isoString: string): string {
    const now = Date.now();
    const postDate = new Date(isoString).getTime();
    const diffMs = now - postDate;

    if (isNaN(postDate)) return 'Invalid date';
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
}

export function Feed({ initialPosts }: { initialPosts: PostProps[] }) {
    const { data: posts, mutate } = useSWR<PostProps[]>('/api/posts', fetcher, {
        fallbackData: initialPosts,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
    });

    const latestId = useRef(posts?.[0]?._id);

    // ✅ Real-time updates with Pusher (unchanged)
    useEffect(() => {
        const channel = pusherClient.subscribe('posts-channel');

        channel.bind('new-post', (newPost: PostProps) => {
            mutate((current = []) => [newPost, ...current], { revalidate: false });
            latestId.current = newPost._id;
        });

        channel.bind('update-like', (updatedPost: PostProps) => {
            mutate(
                (current = []) =>
                    current.map((p) =>
                        p._id === updatedPost._id ? { ...p, likes: updatedPost.likes, likedBy: updatedPost.likedBy } : p
                    ),
                { revalidate: false }
            );
        });

        channel.bind('update-share', (updatedPost: PostProps) => {
            mutate(
                (current = []) =>
                    current.map((p) =>
                        p._id === updatedPost._id ? { ...p, shares: updatedPost.shares } : p
                    ),
                { revalidate: false }
            );
        });

        return () => {
            channel.unbind_all();
            pusherClient.unsubscribe('posts-channel');
        };
    }, [mutate]);

    return (
        <div className="bg-card rounded-custom shadow-card border border-glass p-4 max-w-custom mx-auto md:grid md:grid-cols-[360px_1fr_360px] md:gap-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h2 className="m-0 text-lg font-bold">Customer Service Stories</h2>
                    <p className="text-muted text-sm mt-1">Top rants & reviews from around the world.</p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-muted text-xs">Sort</span>
                    <select className="px-2 py-1 rounded border border-glass bg-transparent">
                        <option>Latest</option>
                        <option>Trending</option>
                    </select>
                </div>
            </div>

            {/* Feed list */}
            <div className="flex flex-col gap-3">
                {posts?.length ? (
                    posts.map((post) => (
                        <div key={post._id} className="p-3.5 rounded-xl border border-glass bg-gradient-to-b from-white/5 to-transparent">
                            {/* Post header */}
                            <div className="flex items-center justify-between mb-2">
                                <span className="px-2 py-1.5 rounded-full bg-black/3 text-xs">
                                    {post.tag} {post.businessName && post.businessName.trim() !== `(${post.businessName})` ? post.businessName : ''}
                                </span>
                                <span className="text-muted text-xs ml-auto">{formatRelativeTime(post.time)}</span>
                            </div>

                            {/* Post body */}
                            <h3 className="my-2 text-base font-semibold">{post.title}</h3>
                            <p className="text-muted text-sm">{post.content}</p>

                            {/* ✅ Modular like/share actions */}
                            <PostActions
                                postId={post._id}
                                likes={post.likes}
                                shares={post.shares}
                                likedBy={post.likedBy ?? []}
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-muted text-sm">No posts yet - be the first to share!</p>
                )}
            </div>
        </div>
    );
}