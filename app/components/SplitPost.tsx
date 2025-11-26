"use client";

import { useState, useCallback } from "react";
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
    // Split content into chunks
    const chunks: string[] = [];
    for (let i = 0; i < content.length; i += chunkSize) {
        chunks.push(content.slice(i, i + chunkSize));
    }

    const [currentPage, setCurrentPage] = useState(0);
    const [animate, setAnimate] = useState(false);

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

    return (
        <div className="relative w-full max-w-full">
            {/* Header with tag circle and business info */}
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:space-x-3 space-y-2 sm:space-y-0">
                <div className="flex flex-row items-center mb-4 space-x-3 flex-wrap">
                    {/* Tag circle */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="text-white font-bold text-sm sm:text-base">
                            {tag.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    {/* Tag and business info */}
                    <div className="flex flex-wrap items-center space-x-2">
                        <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold bg-orange-100 text-orange-700 border border-orange-200/50">
                            {tag}
                        </span>
                        {businessName && (
                            <span className="text-xs sm:text-sm font-medium text-gray-600 truncate max-w-xs sm:max-w-sm">
                                • {businessName}
                            </span>
                        )}
                    </div>
                </div>

            </div>

            {/* Navigation buttons top-right */}
            {chunks.length > 1 && (
                <div className="absolute top-0 right-0 flex space-x-2 z-10">
                    {currentPage > 0 && (
                        <button
                            onClick={handlePrev}
                            className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md bg-orange-200 hover:bg-orange-300 text-orange-800 whitespace-nowrap"
                        >
                            Previous
                        </button>
                    )}
                    {currentPage < chunks.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md bg-orange-500 hover:bg-orange-600 text-white whitespace-nowrap"
                        >
                            Next
                        </button>
                    ) : (
                        <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md bg-gray-200 text-gray-600 cursor-default whitespace-nowrap">
                            End of Story
                        </span>
                    )}
                </div>
            )}

            {/* Post content */}
            <div
                className={clsx(
                    "transition-opacity duration-200 ease-in-out mt-4 sm:mt-6 break-words",
                    animate ? "opacity-0" : "opacity-100"
                )}
            >
                <PostContent content={chunks[currentPage]} full />
            </div>

            {/* Bottom row: date left, page right */}
            <div className="flex flex-row justify-between mt-4 text-xs sm:text-sm text-gray-500 w-full">
                <span className="truncate">
                    {new Date(time).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>
                {chunks.length > 1 && (
                    <span className="truncate text-right">
                        Part {currentPage + 1} of {chunks.length}
                    </span>
                )}
            </div>

        </div>
    );
}
