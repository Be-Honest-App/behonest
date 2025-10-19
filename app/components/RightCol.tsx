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
        revalidateOnFocus: false, // 🚫 No re-fetch on focus
        refreshInterval: 0, // 🚫 No polling
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
        <div className="card" style={{ minWidth: '260px' }}>
            <div className="flex justify-between items-center">
                <strong>Trending Tags</strong>
                <div className="muted small">#customerstories</div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
                {tags.map((tag) => (
                    <div key={tag} className="pill">
                        #{tag}
                    </div>
                ))}
            </div>

            <hr className="my-3 border-t border-[var(--glass)]" />

            <div>
                <strong>Why Be Honest?</strong>
                <div className="muted mt-2">
                    Focused on customer service stories first - but supports personal
                    anonymous links too.
                </div>
            </div>
        </div>
    );
}
