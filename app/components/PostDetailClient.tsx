// app/components/PostDetailClient.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PostActions from './PostActions';
import PostContent from './PostContent';

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

function PostLoading() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                    <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                </div>
                <p className="text-gray-500">Loading story...</p>
            </div>
        </main>
    );
}

export default function PostDetailClient({ post }: { post: PostProps }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
        });
    }

    if (!mounted) {
        return <PostLoading />;
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-orange-50/20">
            {/* Subtle background pattern */}
            
            <div className="relative max-w-2xl mx-auto p-4 pt-16 pb-20">
                {/* Back Button & Header */}
                <div className="flex items-start justify-between mb-6 gap-4">
                    <button
                        onClick={() => router.back()}
                        className="group inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-sm hover:bg-white hover:shadow-md hover:border-gray-300 transition-all duration-200"
                    >
                        <svg className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Feed
                    </button>
                    <div className="flex-1 text-center">
                        <h1 className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent font-black text-2xl sm:text-3xl leading-tight">
                            Honest Story
                        </h1>
                    </div>
                    <div className="w-10"></div> {/* Spacer for alignment */}
                </div>

                {/* Post Card */}
                <article className="bg-white/90 backdrop-blur-sm border border-gray-100/50 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                    {/* Header */}
                    <header className="p-6 pb-4 border-b border-gray-100/30">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-sm">
                                        {post.tag.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200/50">
                                            {post.tag}
                                        </span>
                                        {post.businessName && (
                                            <span className="text-sm font-medium text-gray-600">• {post.businessName}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">{formatRelativeTime(post.time)}</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content - Full, non-truncated */}
                    <div className="p-6">
                        <h2 className="text-gray-900 font-bold text-2xl sm:text-3xl mb-6 leading-tight break-words">
                            {post.title}
                        </h2>
                        <div className="prose prose-lg max-w-none text-gray-700 mb-8 prose-headings:text-gray-900 prose-p:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:border-orange-300 prose-blockquote:pl-4 prose-blockquote:text-gray-600 prose-ul:ml-6 prose-ol:ml-6 prose-li:mb-1">
                            <PostContent content={post.content} full={true} />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100/30"></div>

                    {/* Actions */}
                    <div className="p-6 pt-4">
                        <PostActions
                            postId={post._id}
                            likes={post.likes}
                            shares={post.shares}
                            likedBy={post.likedBy ?? []}
                            time={post.time}
                        />
                    </div>
                </article>
            </div>
        </main >
    );
}