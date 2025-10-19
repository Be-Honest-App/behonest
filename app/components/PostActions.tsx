'use client';

import { useState, useEffect } from 'react';

interface PostActionsProps {
    postId: string;
    likes: number;
    shares: number;
    likedBy?: string[];
}

export default function PostActions({ postId, likes, shares }: PostActionsProps) {
    const [likeCount, setLikeCount] = useState(likes);
    const [shareCount, setShareCount] = useState(shares);
    const [hasLiked, setHasLiked] = useState(false);

    // Each user has a local ID so they can only like once (simulate user session)
    useEffect(() => {
        const storedLikes = JSON.parse(localStorage.getItem('likedPosts') || '[]') as string[];
        if (storedLikes.includes(postId)) {
            setHasLiked(true);
        }
    }, [postId]);

    // ✅ Toggle like (optimistic UI + backend sync)
    const handleLike = async () => {
        const storedLikes = JSON.parse(localStorage.getItem('likedPosts') || '[]') as string[];
        const alreadyLiked = storedLikes.includes(postId);

        // Optimistic update
        setHasLiked(!alreadyLiked);
        setLikeCount((prev) => prev + (alreadyLiked ? -1 : 1));

        try {
            const res = await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ unlike: alreadyLiked }), // toggle action
            });

            if (!res.ok) throw new Error('Failed to toggle like');

            // Update localStorage state
            const updatedLikes = alreadyLiked
                ? storedLikes.filter((id) => id !== postId)
                : [...storedLikes, postId];
            localStorage.setItem('likedPosts', JSON.stringify(updatedLikes));
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert optimistic update on error
            setHasLiked(alreadyLiked);
            setLikeCount((prev) => prev + (alreadyLiked ? 1 : -1));
        }
    };

    // ✅ Handle share (simple counter + backend sync)
    const handleShare = async () => {
        try {
            setShareCount((prev) => prev + 1); // optimistic UI
            const res = await fetch(`/api/posts/${postId}/share`, { method: 'POST' });
            if (!res.ok) throw new Error('Failed to share post');

            // Copy link to clipboard
            const postUrl = `${window.location.origin}/posts/${postId}`;
            await navigator.clipboard.writeText(postUrl);
            alert('Post link copied to clipboard!');
        } catch (error) {
            console.error('Error sharing post:', error);
            setShareCount((prev) => prev - 1);
        }
    };

    return (
        <div className="flex gap-2 mt-3">
            {/* Like Button */}
            <button
                className={`btn secondary transition ${hasLiked ? 'bg-pink-500 text-white hover:bg-pink-600' : ''
                    }`}
                onClick={handleLike}
            >
                ❤️ {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </button>

            {/* Share Button */}
            <button className="btn secondary" onClick={handleShare}>
                🔗 {shareCount} {shareCount === 1 ? 'Share' : 'Shares'}
            </button>

            {/* Download Image (optional stub) */}
            <button className="btn secondary">📥 Download image</button>
        </div>
    );
}
