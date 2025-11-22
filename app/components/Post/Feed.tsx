'use client';

import useSWR from 'swr';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation'; // Add useRouter
import { pusherClient } from '@/lib/pusherClient';
import { type Channel } from 'pusher-js'; // NEW: Direct import of Channel type from pusher-js
import PostActions from '../PostActions';
import PostContent from '../PostContent'; // Your imported component
// import Filters from '../Filters'; // New/updated filter component below

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
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
}

export function Feed({ initialPosts }: { initialPosts: PostProps[] }) {
    const searchParams = useSearchParams();
    // const router = useRouter(); // For URL updates
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
    const currentTag = searchParams.get('tag'); // Read current tag filter

    // Pusher for real-time (filter new posts client-side if tag active)
    useEffect(() => {
        queryStringRef.current = queryString;
    }, [queryString]);

        channel.bind('new-post', (newPost: PostProps) => {
            // If no filter or matches current tag, add to top
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
            if (channel) {
                channel.unbind_all();
                pusherClient.unsubscribe('posts-channel');
                channelRef.current = null;
            }
        };
    }, [mutate, currentTag]); // Re-sub on tag change

    // const handleFilterChange = (newFilters: { tag?: string; country?: string }) => {
    //     const params = new URLSearchParams(searchParams.toString());
    //     if (newFilters.tag) {
    //         params.set('tag', newFilters.tag);
    //     } else {
    //         params.delete('tag');
    //     }
    //     if (newFilters.country) {
    //         params.set('country', newFilters.country);
    //     } else {
    //         params.delete('country');
    //     }
    //     router.push(`?${params.toString()}`); // Update URL, triggers SWR re-fetch
    // };

    const hasActiveFilters = searchParams.get('tag') || searchParams.get('country');

    if (isLoading && !posts) {
        return <div className="text-center py-8 text-gray-500">Loading posts...</div>;
    }

    console.log('Rendered posts count:', posts?.length, 'Filters active:', hasActiveFilters);  // DEBUG

    return (
        <div className="flex-1 max-w-2xl mx-auto p-4">
            {/* Header with Filters */}
            {/* <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Be-Honest Feed</h1>
                <Filters
                    industries={['Customer Service', 'Work Life', 'Student Life']} // Hardcoded or from topTags
                    initialTag={searchParams.get('tag') || ''}
                    initialCountry={searchParams.get('country') || ''}
                    onChange={(filters) => handleFilterChange({ tag: filters.tag, country: filters.country })}
                    onClear={() => handleFilterChange({})} // Clear both
                />
            </div> */}

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
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-orange-600">
                                        {post.tag}
                                    </span>
                                    {post.businessName && (
                                        <span className="text-sm font-medium text-orange-600">• {post.businessName}</span>
                                    )}
                                </div>
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