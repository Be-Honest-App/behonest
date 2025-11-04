'use client'

import React from 'react'

interface ShareCardProps {
    text: string
    onCopy?: () => void
    onDownload?: () => void
}

export function ShareCard({ text, onCopy, onDownload }: ShareCardProps) {
    return (
        <div className="bg-gradient-to-r from-orange-500 to-orange-300 p-[2px] rounded-2xl shadow-md inline-block">
            <div className="bg-white rounded-2xl p-6 flex flex-col items-start">
                <p className="text-gray-800 text-sm md:text-base">{text}</p>

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={onCopy}
                        className="text-xs bg-orange-500 text-white px-3 py-2 rounded-md hover:bg-orange-600 transition-colors"
                    >
                        Copy Link
                    </button>

                    <button
                        onClick={onDownload}
                        className="text-xs bg-orange-100 text-orange-700 px-3 py-2 rounded-md hover:bg-orange-200 transition-colors"
                    >
                        Download Image
                    </button>
                </div>
            </div>
        </div>
    )
}
