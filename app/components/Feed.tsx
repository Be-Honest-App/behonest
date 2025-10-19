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

    // ✅ Real-time updates with Pusher
    useEffect(() => {
        const channel = pusherClient.subscribe('posts-channel');

        // New post broadcast
        channel.bind('new-post', (newPost: PostProps) => {
            mutate((current = []) => [newPost, ...current], { revalidate: false });
            latestId.current = newPost._id;
        });

        // Like update broadcast
        channel.bind('update-like', (updatedPost: PostProps) => {
            mutate(
                (current = []) =>
                    current.map((p) =>
                        p._id === updatedPost._id ? { ...p, likes: updatedPost.likes, likedBy: updatedPost.likedBy } : p
                    ),
                { revalidate: false }
            );
        });

        // Share update broadcast
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
        <div className="card">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="m-0">Customer Service Stories</h2>
                    <div className="muted mt-1">Top rants & reviews from around the world.</div>
                </div>

                <div className="flex gap-2 items-center">
                    <div className="muted small">Sort</div>
                    <select className="px-2 py-1 rounded border border-[var(--glass)]">
                        <option>Latest</option>
                        <option>Trending</option>
                    </select>
                </div>
            </div>

            {/* Feed list */}
            <div className="feed mt-3">
                {posts?.length ? (
                    posts.map((post) => (
                        <div key={post._id} className="post">
                            {/* Post header */}
                            <div className="flex items-center gap-2">
                                <div className="pill">
                                    {post.tag}{' '}
                                    {post.businessName && post.businessName.trim() !== `(${post.businessName})`}
                                </div>
                                <div className="muted ml-auto">{formatRelativeTime(post.time)}</div>
                            </div>

                            {/* Post body */}
                            <h3 className="my-2">{post.title}</h3>
                            <div className="muted">{post.content}</div>

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
                    <div className="muted">No posts yet - be the first to share!</div>
                )}
            </div>
        </div>
    );
}
