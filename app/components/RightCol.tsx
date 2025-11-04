'use client';

import useSWR from 'swr';

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
    const { data: apiData } = useSWR<ApiResponse>('/api/posts', {
        fallbackData: { data: [] },
        revalidateOnFocus: false,
        refreshInterval: 0,
    });

    const posts = apiData?.data ?? [];

    const computedTags = [
        ...new Set(
            posts
                .filter((p) => p.businessName && p.businessName.trim() !== 'General')
                .map((p) => p.businessName!.trim())
        ),
    ].slice(0, 4);

    const tags = computedTags.length > 0 ? computedTags : initialTags;

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