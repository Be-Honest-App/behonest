'use client';

import { useState, useEffect } from 'react';
import { Heart, Share2 } from 'lucide-react';
import FingerprintJS from '@fingerprintjs/fingerprintjs'; // Import

interface PostActionsProps {
    postId: string;
    likes: number;
    shares: number;
    likedBy: string[]; // Ignored for anon
}

export default function PostActions({ postId, likes, shares}: PostActionsProps) {
    const [localLikes, setLocalLikes] = useState(likes);
    const [localShares] = useState(shares);
    const [isLiked, setIsLiked] = useState(false);
    const [fingerprint, setFingerprint] = useState<string | null>(null); // Cache hash

    // Init FingerprintJS once
    useEffect(() => {
        const loadFingerprint = async () => {
            if (typeof window === 'undefined') return;
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            const hash = result.visitorId; // Stable anon hash
            setFingerprint(hash);
            // Load localStorage liked check using hash
            const likedPosts = JSON.parse(localStorage.getItem(`beHonestLikedPosts_${hash}`) || '[]') as string[];
            setIsLiked(likedPosts.includes(postId));
        };
        loadFingerprint();
    }, [postId]);

    const toggleLike = async () => {
        if (!fingerprint) return; // Wait for init

        if (isLiked) {
            // Local undo (no server call)
            setLocalLikes(localLikes - 1);
            setIsLiked(false);
            const likedPosts = JSON.parse(localStorage.getItem(`beHonestLikedPosts_${fingerprint}`) || '[]') as string[];
            const updated = likedPosts.filter((id) => id !== postId);
            localStorage.setItem(`beHonestLikedPosts_${fingerprint}`, JSON.stringify(updated));
        } else {
            setLocalLikes(localLikes + 1);
            setIsLiked(true);
            // Update localStorage
            const likedPosts = JSON.parse(localStorage.getItem(`beHonestLikedPosts_${fingerprint}`) || '[]') as string[];
            if (!likedPosts.includes(postId)) {
                likedPosts.push(postId);
                localStorage.setItem(`beHonestLikedPosts_${fingerprint}`, JSON.stringify(likedPosts));
            }

            try {
                const res = await fetch(`/api/posts/${postId}/like`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fingerprintHash: fingerprint, // Send for server validation
                        liked: true
                    }),
                });

                if (res.status === 429) {
                    const errorData = await res.json();
                    alert(errorData.error || 'Already liked—try again later.'); // Or toast
                    // Revert
                    setIsLiked(false);
                    setLocalLikes(likes);
                    const likedPosts = JSON.parse(localStorage.getItem(`beHonestLikedPosts_${fingerprint}`) || '[]') as string[];
                    const updated = likedPosts.filter((id) => id !== postId);
                    localStorage.setItem(`beHonestLikedPosts_${fingerprint}`, JSON.stringify(updated));
                    return;
                }

                if (!res.ok) throw new Error('Failed to like');
            } catch (error) {
                console.error('Like failed:', error);
                // Revert
                setIsLiked(false);
                setLocalLikes(likes);
                const likedPosts = JSON.parse(localStorage.getItem(`beHonestLikedPosts_${fingerprint}`) || '[]') as string[];
                const updated = likedPosts.filter((id) => id !== postId);
                localStorage.setItem(`beHonestLikedPosts_${fingerprint}`, JSON.stringify(updated));
            }
        }
    };

    // handleShare unchanged...
    const handleShare = async () => {
        // Your existing share code
    };

    return (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-4">
            <div className="flex items-center gap-6">
                <button
                    onClick={toggleLike}
                    disabled={!fingerprint} // Wait for fingerprint
                    className={`flex items-center gap-1 text-sm font-medium transition ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
                    {localLikes}
                </button>
                <button onClick={handleShare} className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                    <Share2 className="w-4 h-4" />
                    {localShares}
                </button>
            </div>
        </div>
    );
}