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
        <div className="bg-card rounded-custom shadow-card border border-glass p-4 min-w-[260px]">
            <div className="flex justify-between items-center mb-2">
                <strong className="font-bold">Trending Tags</strong>
                <span className="text-muted text-xs">#customerstories</span>
            </div>

            <div className="flex flex-col gap-2">
                {tags.map((tag) => (
                    <span key={tag} className="px-2 py-1.5 rounded-full bg-black/3 text-xs">
                        #{tag}
                    </span>
                ))}
            </div>

            <hr className="my-3 border-t border-glass" />

            <div>
                <strong className="font-bold block">Why Be Honest?</strong>
                <p className="text-muted text-sm mt-2">
                    Focused on customer service stories first - but supports personal
                    anonymous links too.
                </p>
            </div>
        </div>
    );
}