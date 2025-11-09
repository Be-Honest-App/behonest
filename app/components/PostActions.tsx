// components/PostActions.tsx (full update)
'use client';

import { useState } from 'react';
import { Heart, Share2 } from 'lucide-react';
import { getGhostId } from '../utils/ghostId'; // Import ghost ID

interface PostActionsProps {
    postId: string;
    likes: number;
    shares: number;
    likedBy: string[];
}

export default function PostActions({ postId, likes, shares, likedBy }: PostActionsProps) {
    const ghostId = getGhostId();
    const [localLikes, setLocalLikes] = useState(likes);
    const [localShares, setLocalShares] = useState(shares);
    const [isLiked, setIsLiked] = useState(likedBy.includes(ghostId)); // Real check!

    const [isToggling, setIsToggling] = useState(false); // Prevent spam clicks

    const handleLike = async () => {
        if (isToggling) return;
        setIsToggling(true);

        const action = isLiked ? 'unlike' : 'like';
        const newLikes = isLiked ? localLikes - 1 : localLikes + 1;

        // Optimistic UI
        setIsLiked(!isLiked);
        setLocalLikes(newLikes);

        try {
            const res = await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, ghostId }),
            });

            if (!res.ok) throw new Error('Toggle failed');
            const { data } = await res.json();
            // Use response for confirm (Pusher will sync others)
            setLocalLikes(data.likes);
        } catch (error) {
            console.error('Like failed:', error);
            // Revert
            setIsLiked(isLiked); // Original state
            setLocalLikes(likes); // Original prop
        } finally {
            setIsToggling(false);
        }
    };

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/posts/${postId}`;
        const newShares = localShares + 1;
        setLocalShares(newShares); // Optimistic

        // Copy to clipboard
        try {
            await navigator.clipboard.writeText(shareUrl);
            // TODO: Use toast lib (e.g., react-hot-toast) instead of alert
            alert('Link copied! Share it with friends.');
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

        // API call (assuming /share route exists—mirror like logic if needed)
        try {
            await fetch(`/api/posts/${postId}/share`, { method: 'POST' });
        } catch (error) {
            console.error('Share increment failed:', error);
            setLocalShares(shares); // Revert
        }

        // Native share
        if (navigator.share) {
            navigator.share({
                title: 'Be Honest Post',
                text: 'Check out this customer service story!',
                url: shareUrl,
            }).catch(() => { }); // Ignore cancel
        }
    };

    return (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-4">
            <div className="flex items-center gap-6">
                <button
                    onClick={handleLike}
                    disabled={isToggling}
                    className={`flex items-center gap-1 text-sm font-medium transition ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
                        } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
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