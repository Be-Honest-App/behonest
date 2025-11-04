// components/PostActions.tsx (updated with Lucide React icons)
// First, install: npm i lucide-react
'use client';

import { useState } from 'react';
import { Heart, Share2 } from 'lucide-react'; // Import icons

interface PostActionsProps {
    postId: string;
    likes: number;
    shares: number;
    likedBy: string[]; // For like toggle (expand if auth needed)
}

export default function PostActions({ postId, likes, shares, likedBy }: PostActionsProps) {
    const [localLikes, setLocalLikes] = useState(likes);
    const [localShares, setLocalShares] = useState(shares);
    const [isLiked, setIsLiked] = useState(likedBy.includes('user-id-placeholder')); // Replace with real user ID

    const handleLike = async () => {
        const newLikes = isLiked ? localLikes - 1 : localLikes + 1;
        setIsLiked(!isLiked);
        setLocalLikes(newLikes);

        try {
            await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ liked: !isLiked }),
            });
            // Pusher broadcast happens in API
        } catch (error) {
            console.error('Like failed:', error);
            // Revert on error
            setIsLiked(isLiked);
            setLocalLikes(likes);
        }
    };

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/posts/${postId}`;
        const newShares = localShares + 1;
        setLocalShares(newShares); // Optimistic update

        // Copy to clipboard
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Link copied! Share it with friends.'); // Swap for toast lib later
        } catch {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = shareUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Link copied!');
        }

        // API call to increment (no body needed)
        try {
            await fetch(`/api/posts/${postId}/share`, { method: 'POST' });
            // Pusher handled in API
        } catch (error) {
            console.error('Share increment failed:', error);
            setLocalShares(shares); // Revert
        }

        // Native share (mobile/desktop)
        if (navigator.share) {
            navigator.share({
                title: 'Be Honest Post',
                text: 'Check out this customer service story!',
                url: shareUrl,
            }).catch(() => { }); // Ignore if cancelled
        }
    };

    return (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-4">
            <div className="flex items-center gap-6">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 text-sm font-medium transition ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
                    {localLikes}
                </button>
                <button
                    onClick={handleShare}
                    className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                    <Share2 className="w-4 h-4" />
                    {localShares}
                </button>
            </div>
            {/* <button className="text-sm text-gray-500 hover:text-gray-700">Comment</button> */}
        </div>
    );
}