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
    // Split content
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

            {/* Header */}
            <div className="flex items-center gap-3 mb-3">

                {/* Circle Icon */}
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                        {tag.charAt(0).toUpperCase()}
                    </span>
                </div>

                {/* Tag + Business */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 min-w-0">

                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200/50 flex-shrink-0">
                        {tag}
                    </span>

                    {businessName && (
                        <span className="text-sm font-medium text-gray-600 truncate max-w-[200px] sm:max-w-xs">
                            • {businessName}
                        </span>
                    )}

                </div>
            </div>

            {/* Navigation buttons */}
            {/* Navigation buttons */}
            {chunks.length > 1 && (
                <div className="flex flex-wrap sm:absolute sm:top-0 sm:right-0 gap-2 mt-2 sm:mt-0 z-10 justify-end">
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
                        <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md bg-gray-200 text-gray-600 whitespace-nowrap cursor-default">
                            End of Story
                        </span>
                    )}
                </div>
            )}


            {/* Content */}
            <div
                className={clsx(
                    "transition-opacity duration-200 ease-in-out mt-4 sm:mt-6 break-words",
                    animate ? "opacity-0" : "opacity-100"
                )}
            >
                <PostContent content={chunks[currentPage]} full />
            </div>

            {/* Footer: time + part */}
            <div className="flex flex-wrap justify-between mt-4 text-xs sm:text-sm text-gray-500 w-full gap-2">
                <span className="truncate max-w-[70%]">
                    {new Date(time).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>

                {chunks.length > 1 && (
                    <span className="truncate text-right max-w-[30%]">
                        Part {currentPage + 1} of {chunks.length}
                    </span>
                )}
            </div>

        </div>
    );
}
