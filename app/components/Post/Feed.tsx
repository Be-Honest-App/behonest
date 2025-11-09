'use client';

import useSWR from 'swr';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { pusherClient } from '@/lib/pusherClient';
import { type Channel } from 'pusher-js'; // NEW: Direct import of Channel type from pusher-js
import PostActions from '../PostActions';

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

// PostContent component (unchanged)
export function PostContent({ content }: { content: string }) {
    const [expanded, setExpanded] = useState(false);
    const limit = 150;
    const isLong = content.length > limit;

    if (!isLong) {
        return (
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {content}
            </p>
        );
    }

    const truncated = `${content.slice(0, limit)}...`;

    return (
        <div className="mb-4">
            <p className="text-sm text-gray-600 leading-relaxed">
                {expanded ? content : truncated}
            </p>
            <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm text-orange-500 hover:cursor-pointer"
            >
                {expanded ? 'View less' : 'View more'}
            </button>
        </div>
    );
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
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
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
        keepPreviousData: true,  // Prevents flicker/revert during re-fetches
        // refreshInterval: 0,  // Disabled polling (Pusher handles real-time)
    });

    const latestId = useRef(posts?.[0]?._id);
    const channelRef = useRef<Channel | null>(null);  // Now properly typed via direct import
    const queryStringRef = useRef(queryString);  // Ref for stable access in Pusher handler (avoids ESLint dep issue)

    // Update ref on queryString change
    useEffect(() => {
        queryStringRef.current = queryString;
    }, [queryString]);

    // Re-fetch on filter changes
    useEffect(() => {
        mutate();
    }, [queryString, mutate]);

    // Pusher: Bind once on mount, unbind on unmount (stable deps)
    useEffect(() => {
        if (!channelRef.current) {
            channelRef.current = pusherClient.subscribe('posts-channel');
        }
        const channel = channelRef.current;

        console.log('Pusher bound');  // DEBUG: Logs once per mount

        channel.bind('new-post', async (newPost: PostProps) => {
            console.log('New post event:', newPost._id, 'Current filters:', queryStringRef.current);  // Use ref (no dep needed)
            // Always revalidate (API enforces filters—no optimistic insert)
            await mutate();
            latestId.current = newPost._id;
        });

        channel.bind('update-like', (updatedPost: PostProps) => {
            mutate(
                (current = []) =>
                    current.map((p) =>
                        p._id === updatedPost._id
                            ? { ...p, likes: updatedPost.likes, likedBy: updatedPost.likedBy }
                            : p
                    ),
                { revalidate: false }
            );
        });

        channel.bind('update-share', (updatedPost: PostProps) => {
            mutate(
                (current = []) =>
                    current.map((p) =>
                        p._id === updatedPost._id
                            ? { ...p, shares: updatedPost.shares }
                            : p
                    ),
                { revalidate: false }
            );
        });

        return () => {
            if (channel) {
                channel.unbind_all();
                pusherClient.unsubscribe('posts-channel');
                channelRef.current = null;
            }
        };
    }, [mutate]);  // Stable deps—no queryString (use ref inside)

    const hasActiveFilters = searchParams.get('category') || searchParams.get('country');

    if (isLoading && !posts) {
        return <div className="text-center py-8 text-gray-500">Loading posts...</div>;
    }

    console.log('Rendered posts count:', posts?.length, 'Filters active:', hasActiveFilters);  // DEBUG

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">

                {/* Sort dropdown (uncomment if needed) */}
                {/* <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Sort</label>
                    <select className="px-2 py-1 text-sm rounded-md border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400">
                        <option>Latest</option>
                        <option>Trending</option>
                    </select>
                </div> */}
            </div>

            {/* Feed list */}
            <div className="space-y-5">
                {posts?.length ? (
                    posts.map((post) => (
                        <div
                            key={post._id}
                            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 transition hover:shadow-md"
                        >
                            {/* Post header */}
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-orange-600">
                                    {post.tag}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {formatRelativeTime(post.time)}
                                </span>
                            </div>
                            
                            <span className="text-lg font-semibold text-gray-800 mb-2 block">
                                <PostContent content={post.businessName ?? ''} />
                            </span>

                            {/* Post body */}
                            <PostContent content={post.content} />

                            {/* Like / Share Actions */}
                            <PostActions
                                postId={post._id}
                                likes={post.likes}
                                shares={post.shares}
                                likedBy={post.likedBy ?? []}
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