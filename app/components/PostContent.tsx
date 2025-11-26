// app/components/PostContent.tsx
'use client';

import { useState } from 'react';

interface PostContentProps {
    content: string;
    full?: boolean;
}

export default function PostContent({ content, full = false }: PostContentProps) {
    const [expanded, setExpanded] = useState(false);
    const limit = 150;
    const isLong = content.length > limit;

    if (full) {
        return (
            <div className="prose prose-lg max-w-none text-gray-700 mb-8 prose-headings:text-gray-900 prose-p:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:border-orange-300 prose-blockquote:pl-4 prose-blockquote:text-gray-600 prose-ul:ml-6 prose-ol:ml-6 prose-li:mb-1">
                <div className="text-gray-700 leading-relaxed space-y-4">
                    {content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        );
    }

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