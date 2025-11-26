'use client';
import Link from 'next/link';
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
    const feedRef = useRef<HTMLDivElement | null>(null);

    // Pusher for real-time updates
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

    // Scroll intent detection
    useEffect(() => {
        const el = feedRef.current;
        if (!el) return;

        let ticking = false;
        const threshold = 10;
        let touchStartY: number | null = null;

        const dispatchVisible = (visible: boolean) => {
            window.dispatchEvent(new CustomEvent('feed-scroll', { detail: { visible } }));
        };

        const onWheel = (e: WheelEvent) => {
            const delta = e.deltaY;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (Math.abs(delta) > threshold) {
                        dispatchVisible(delta <= 0);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        const onTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches?.[0]?.clientY ?? null;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (touchStartY === null) return;

            const currentY = e.touches?.[0]?.clientY ?? 0;
            const delta = touchStartY - currentY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (Math.abs(delta) > threshold) {
                        dispatchVisible(delta < 0);
                        touchStartY = currentY;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        el.addEventListener('wheel', onWheel, { passive: true });
        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchmove', onTouchMove, { passive: true });

        return () => {
            el.removeEventListener('wheel', onWheel as EventListener);
            el.removeEventListener('touchstart', onTouchStart as EventListener);
            el.removeEventListener('touchmove', onTouchMove as EventListener);
        };
    }, []);

    const hasActiveFilters = searchParams.get('tag') || searchParams.get('country');

    // Loading State
    if (isLoading && !posts) {
        return (
            <div className="flex-1 w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-orange-50/80 to-orange-100/60 rounded-3xl shadow-lg border border-orange-100/50 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center text-orange-600 space-y-4">
                    <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center animate-pulse shadow">
                        <div className="w-6 h-6 bg-orange-200 rounded-full"></div>
                    </div>
                    <div className="text-xl font-light">Loading your feed…</div>
                    <div className="text-sm opacity-70">Fetching the latest updates</div>
                </div>
            </div>
        );
    }

    return (
        <section
            ref={feedRef}
            className="flex-1 w-full max-w-4xl mx-auto bg-gradient-to-br from-orange-50 via-white to-orange-50 min-h-screen relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-orange-100/20 via-transparent to-orange-50/10 pointer-events-none"></div>

            <div className="relative z-10 pt-4 pb-20">
                <div className="space-y-4 px-4">
                    {posts?.length ? (
                        posts.map((post) => (
                            <article
                                key={post._id}
                                className={`group mx-auto p-6 rounded-3xl shadow-lg bg-gradient-to-br from-white to-orange-50/20 border border-orange-300/30 my-14 mt-5`}
                            >
                                {/* Header */}
                                <header className="flex items-start justify-between mb-4 pb-3 border-b border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-sm">
                                            <span className="text-white text-sm font-semibold">
                                                {post.tag.charAt(0).toUpperCase()}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200 mr-2">
                                                {post.tag}
                                            </span>

                                            {post.businessName && (
                                                <span className="text-xs font-medium text-gray-500">
                                                    {post.businessName}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </header>

                                {/* Content */}
                                <div className="mb-1">
                                    <PostContent content={post.content} />
                                </div>

                                {/* Read Story */}
                                <div className="flex justify-center my-2">
                                    <Link href={`/post/${post._id}`} className="group">
                                        <button
                                            className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-full shadow-lg group-hover:shadow-xl transition-all group-hover:-translate-y-0.5 hover:cursor-pointer"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            Read Story
                                        </button>
                                    </Link>
                                </div>

                                {/* Footer */}


                                <div className="pt-3 pb-2">
                                    <PostActions
                                        postId={post._id}
                                        likes={post.likes}
                                        shares={post.shares}
                                        likedBy={post.likedBy ?? []}
                                        time={post.time}
                                    />
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center shadow">
                                <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                                    <span className="text-orange-600 text-base font-bold">O</span>
                                </div>
                            </div>

                            <div className="text-xl font-light text-gray-600 mb-2">
                                {hasActiveFilters ? 'Nothing here yet' : 'Welcome to your feed'}
                            </div>

                            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                                {hasActiveFilters
                                    ? 'No posts match your filters. Adjust them to explore more.'
                                    : 'Stories from your community will appear here as you follow tags and businesses.'}
                            </p>

                            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-sm">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Start Exploring
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
