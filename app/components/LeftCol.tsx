'use client'

import { useState } from 'react'

export default function LeftCol() {
    const [postText, setPostText] = useState('')
    const [businessName, setBusinessName] = useState('')
    const [category, setCategory] = useState('General')
    const [isPosting, setIsPosting] = useState(false)

    const shareText =
        postText.length > 100
            ? postText.substring(0, 100) + '...'
            : postText || 'Share your best or worst customer service experience on Be Honest!'

    const handlePost = async () => {
        if (!postText.trim()) return
        setIsPosting(true)

        const newPost = {
            tag: `${category} • ${businessName || 'General'}`,
            businessName: businessName || null,
            time: new Date().toISOString(),
            title: postText.substring(0, 50) + '...',
            content: postText,
            likes: 0,
            shares: 0,
        }

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPost),
            })

            if (res.ok) {
                setPostText('')
                setBusinessName('')
            } else {
                console.error('Failed to save post.')
            }
        } catch (error) {
            console.error('Post error:', error)
        } finally {
            setIsPosting(false)
        }
    }

    return (
        <div className="flex flex-col gap-5 sticky top-0 z-10 bg-white md:static md:z-auto md:bg-transparent p-4 md:p-0">
            {/* Quick Post card */}
            <div className="bg-white rounded-2xl shadow-md p-5">
                <strong className="text-gray-800 text-lg block mb-1">Quick Post</strong>
                <p className="text-gray-500 text-sm mb-3">
                    Share a customer service experience in under 2 minutes.
                </p>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                    <option value="General">General</option>
                    <option value="Banking">Work Life</option>
                    <option value="Telecom">Customer Service</option>
                    <option value="Food & Beverage">Student Life</option>
                </select>

                <input
                    type="text"
                    placeholder="Business Name (optional)"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="mt-3 w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />

                <textarea
                    placeholder="Write your experience..."
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className="mt-3 w-full h-24 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />

                <div className="flex justify-between items-center mt-4">
                    <div className="text-xs text-gray-500">
                        Visibility: <span className="font-semibold text-gray-700">Public</span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handlePost}
                            disabled={isPosting}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-md transition"
                        >
                            {isPosting ? 'Posting...' : 'Post Anonymously'}
                        </button>
                        {/* <button className="border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-md hover:bg-gray-100 transition">
                            Attach proof
                        </button> */}
                    </div>
                </div>
            </div>

            {/* Share preview card */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-300 rounded-2xl p-5 text-white text-center shadow-md">
                <p className="text-sm mb-3">{shareText}</p>
                {/* <div className="flex justify-center gap-3">
                    <button className="bg-orange-600/20 border border-white/50 text-white text-sm px-3 py-2 rounded-md hover:bg-orange-600/30 transition">
                        Download Image
                    </button>
                </div> */}
            </div>

            {/* Filters card */}
            <div className="bg-white rounded-2xl shadow-md p-5">
                <strong className="text-gray-800 text-lg block mb-3">Filters</strong>
                <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-orange-400 mb-3">
                    <option>Select industry</option>
                    <option>Banking</option>
                    <option>Telecom</option>
                    <option>Food & Beverage</option>
                </select>
                <input
                    type="text"
                    placeholder="Country or city"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-orange-400"
                />

                <div className="flex gap-2 mt-3">
                    <button className="bg-orange-500 text-white text-sm px-4 py-2 rounded-md hover:bg-orange-600 transition">
                        Apply
                    </button>
                    <button className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-md hover:bg-gray-200 transition">
                        Clear
                    </button>
                </div>
            </div>
        </div>
    )
}