"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import PostContent from "./PostContent";
import clsx from "clsx";

interface SplitPostProps {
    content: string;
    time: string;
    tag: string;
    businessName?: string | null;
    chunkSize?: number;
}

export default function SplitPost({
    content,
    time,
    tag,
    businessName,
    chunkSize = 600,
}: SplitPostProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Split content into chunks
    const chunks: string[] = [];
    for (let i = 0; i < content.length; i += chunkSize) {
        chunks.push(content.slice(i, i + chunkSize));
    }

    const [currentPage, setCurrentPage] = useState(0);
    const [animate, setAnimate] = useState(false);

    // Fade animation handlers
    const handleNext = useCallback(() => {
        if (currentPage < chunks.length - 1) {
            setAnimate(true);
            setTimeout(() => {
                setCurrentPage((prev) => prev + 1);
                setAnimate(false);
            }, 200);
        }
    }, [currentPage, chunks.length]);

    const handlePrev = useCallback(() => {
        if (currentPage > 0) {
            setAnimate(true);
            setTimeout(() => {
                setCurrentPage((prev) => prev - 1);
                setAnimate(false);
            }, 200);
        }
    }, [currentPage]);

    // Swipe support
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let touchStartY: number | null = null;
        const threshold = 50;

        const onTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };

        const onTouchEnd = (e: TouchEvent) => {
            if (touchStartY === null) return;
            const delta = touchStartY - e.changedTouches[0].clientY;
            if (delta > threshold) handleNext();
            if (delta < -threshold) handlePrev();
            touchStartY = null;
        };

        el.addEventListener("touchstart", onTouchStart, { passive: true });
        el.addEventListener("touchend", onTouchEnd, { passive: true });

        return () => {
            el.removeEventListener("touchstart", onTouchStart);
            el.removeEventListener("touchend", onTouchEnd);
        };
    }, [handleNext, handlePrev]);

    return (
        <div className="relative" ref={containerRef}>
            {/* Header with tag circle and business info */}
            <div className="flex items-center mb-4 space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">{tag.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200/50">
                            {tag}
                        </span>
                        {businessName && <span className="text-sm font-medium text-gray-600">• {businessName}</span>}
                    </div>
                </div>
            </div>

            {/* Navigation buttons top-right */}
            {chunks.length > 1 && (
                <div className="absolute top-0 right-0 flex space-x-2">
                    {currentPage > 0 && (
                        <button
                            onClick={handlePrev}
                            className="px-3 py-1 text-xs rounded-md bg-orange-200 hover:bg-orange-300 text-orange-800"
                        >
                            Previous
                        </button>
                    )}
                    {currentPage < chunks.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="px-3 py-1 text-xs rounded-md bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            Next
                        </button>
                    ) : (
                        <span className="px-3 py-1 text-xs rounded-md bg-gray-200 text-gray-600 cursor-default">
                            End of Story
                        </span>
                    )}
                </div>
            )}

            {/* Post content */}
            <div className={clsx("transition-opacity duration-200 ease-in-out mt-6", animate ? "opacity-0" : "opacity-100")}>
                <PostContent content={chunks[currentPage]} full />
            </div>

            {/* Bottom row: date left, page right */}
            <div className="flex justify-between mt-4 text-xs text-gray-500">
                <span>
                    {new Date(time).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>
                {chunks.length > 1 && <span>Part {currentPage + 1} of {chunks.length}</span>}
            </div>
        </div>
    );
}
