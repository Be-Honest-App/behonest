// app/components/PostContent.tsx (New client component for interactivity)
'use client';

import { useState } from 'react';

interface PostContentProps {
    content: string;
}

export default function PostContent({ content }: PostContentProps) {
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