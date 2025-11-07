'use client';

'use client';

import useSWR from 'swr';
import { useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // ✅ this line is crucial
import { pusherClient } from '@/lib/pusherClient';


interface PostProps {
    _id?: string;
    tag: string;
    businessName?: string | null;
    time: string;
    title: string;
    content: string;
    likes: number;
    shares: number;
}

interface ApiResponse {
    data?: PostProps[];
}

interface RightColProps {
    initialTags: string[];
}

export function RightCol({ initialTags }: RightColProps) {
  const { data: apiData, mutate } = useSWR<ApiResponse>('/api/posts', {
    fallbackData: { data: [] },
    revalidateOnFocus: false,
  });

  const posts = useMemo(() => apiData?.data ?? [], [apiData]);
  const router = useRouter();               // ✅
  const searchParams = useSearchParams();   // ✅
  const activeTag = searchParams.get('tag'); // ✅



    // 🧮 Calculate trending tags by frequency
    const trendingTags = useMemo(() => {
        if (!posts.length) return initialTags;

        const freq: Record<string, number> = {};
        posts.forEach((p) => {
            if (p.tag && p.tag.trim() !== '') {
                freq[p.tag] = (freq[p.tag] || 0) + 1;
            }
        });

        return Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([tag]) => tag);
    }, [posts, initialTags]);

    // 🟠 Real-time updates via Pusher
    useEffect(() => {
        const channel = pusherClient.subscribe('posts-channel');

        channel.bind('new-post', (newPost: PostProps) => {
            mutate((current) => {
                const existing = current?.data ?? [];
                return { data: [newPost, ...existing] };
            }, { revalidate: false });
        });

        return () => {
            channel.unbind_all();
            pusherClient.unsubscribe('posts-channel');
        };
    }, [mutate]);

    // ✅ Tag click updates the URL (triggering Feed revalidation)
    const handleTagClick = (tag: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (activeTag === tag) {
            params.delete('tag'); // clicking again removes filter
        } else {
            params.set('tag', tag);
        }

        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-5 sticky top-0 h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
                <strong className="text-gray-800 text-lg">Trending Tags</strong>
                <span className="text-orange-500 text-sm font-medium">#customerstories</span>
            </div>

            <div className="flex flex-col gap-2">
                {trendingTags.length ? (
                    trendingTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className={`text-sm text-left transition px-2 py-1 rounded-md ${activeTag === tag
                                    ? 'bg-orange-100 text-orange-700 font-semibold'
                                    : 'text-gray-700 hover:text-orange-600'
                                }`}
                        >
                            #{tag}
                        </button>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No trending tags yet</p>
                )}
            </div>

            <hr className="my-5 border-t border-gray-100" />

            <div>
                <strong className="text-gray-800 text-lg">Why Be Honest?</strong>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    Focused on customer service stories first - but supports personal
                    anonymous links too.
                </p>
            </div>
        </div>
    );
}
