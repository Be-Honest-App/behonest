'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusherClient'; // Your client instance

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
    topTags?: { name: string; count: number }[]; // From GET
}

interface RightColProps {
    initialTags: string[];
}

export function RightCol({ initialTags }: RightColProps) {
    const [tags, setTags] = useState<string[]>(initialTags); // Local state for real-time

    const { data: apiData } = useSWR<ApiResponse>('/api/posts', {
        fallbackData: { data: [], topTags: [] },
        revalidateOnFocus: false,
        refreshInterval: 0,
    });

    // Set initial topTags from SWR
    useEffect(() => {
        if (apiData?.topTags && apiData.topTags.length > 0) {
            setTags(apiData.topTags.map((t) => t.name));
        }
    }, [apiData?.topTags]);

    // Pusher subscription for real-time tag updates
    useEffect(() => {
        const channel = pusherClient.subscribe('posts-channel');

        channel.bind('update-tags', ({ topTags }: { topTags: { name: string; count: number }[] }) => {
            setTags(topTags.map((t) => t.name)); // Update state instantly
        });

        return () => {
            channel.unbind('update-tags');
            pusherClient.unsubscribe('posts-channel');
        };
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-md p-5">
            {/* Trending Tags */}
            <div className="flex justify-between items-center mb-3">
                <strong className="text-gray-800 text-lg">Trending Tags</strong>
                <span className="text-orange-500 text-sm font-medium">
                    #customerstories
                </span>
            </div>

            <div className="flex flex-col gap-2">
                {tags.map((tag) => (
                    <div
                        key={tag}
                        className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer transition"
                    >
                        #{tag}
                    </div>
                ))}
            </div>

            <hr className="my-5 border-t border-gray-100" />

            {/* Why Be Honest section */}
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