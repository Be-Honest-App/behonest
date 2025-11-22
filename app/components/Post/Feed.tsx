'use client';

import useSWR from 'swr';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { pusherClient } from '@/lib/pusherClient';
import PostActions from '../PostActions';
import PostContent from '../PostContent';

interface PostProps {
    _id: string;
    tag: string;
    businessName?: string | null;
    time: string;
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

export function formatRelativeTime(isoString: string): string {
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
    });
}

export function Feed({ initialPosts }: { initialPosts: PostProps[] }) {
    const searchParams = useSearchParams();
    const queryString = searchParams.toString();
    const swrKey = queryString ? `/api/posts?${queryString}` : '/api/posts';

    const { data: posts, mutate, isLoading } = useSWR<PostProps[]>(swrKey, fetcher, {
        fallbackData: initialPosts,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
    });

    const latestId = useRef(posts?.[0]?._id);
    const currentTag = searchParams.get('tag');

    // Pusher for real-time (filter new posts client-side if tag active)
    useEffect(() => {
        const channel = pusherClient.subscribe('posts-channel');

        channel.bind('new-post', (newPost: PostProps) => {
            if (!currentTag || newPost.tag === currentTag) {
                mutate((current = []) => [newPost, ...current], { revalidate: false });
            }
            latestId.current = newPost._id;
        });

        channel.bind('update-like', (updated: { id: string; likes: number }) => {
            mutate((current = []) =>
                current.map((p) => (p._id === updated.id ? { ...p, likes: updated.likes } : p)),
                { revalidate: false }
            );
        });

        channel.bind('update-share', (updated: { id: string; shares: number }) => {
            mutate((current = []) =>
                current.map((p) => (p._id === updated.id ? { ...p, shares: updated.shares } : p)),
                { revalidate: false }
            );
        });

        return () => {
            channel.unbind_all();
            pusherClient.unsubscribe('posts-channel');
        };
    }, [mutate, currentTag]);

    const hasActiveFilters = searchParams.get('tag') || searchParams.get('country');

    if (isLoading && !posts) {
        return <div className="text-center py-8 text-gray-500">Loading posts...</div>;
    }

    return (
        <div className="flex-1 max-w-2xl mx-auto p-4 bg-orange-500/10 rounded-2xl shadow-sm">
            {/* Feed list */}
            <div className="space-y-5">
                {posts?.length ? (
                    posts.map((post) => (
                        <div
                            key={post._id}
                            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 transition hover:shadow-md"
                        >
                            {/* Post header - Mobile Responsive */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-2">
                                <div className="flex flex-wrap items-center space-x-2">
                                    <span className="text-sm font-medium text-orange-600">
                                        {post.tag}
                                    </span>
                                    {post.businessName && (
                                        <span className="text-sm font-medium text-orange-600">• {post.businessName}</span>
                                    )}
                                </div>
                            </div>

                            {/* Post body */}
                            <PostContent content={post.content} />

                            {/* Like / Share Actions */}
                            <PostActions
                                postId={post._id}
                                likes={post.likes}
                                shares={post.shares}
                                likedBy={post.likedBy ?? []}
                                time={post.time}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-gray-500 text-center py-8">
                        {hasActiveFilters ? 'No posts match your filters. Try adjusting them!' : 'No posts yet - be the first to share!'}
                    </div>
                )}
            </div>
        </div>
    );
}