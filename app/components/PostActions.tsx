'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Heart, Share2, Twitter, Facebook, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { formatRelativeTime } from './Post/Feed';

interface PostActionsProps {
    postId: string;
    likes: number;
    time: string;
    shares: number;
    likedBy: string[]; // Ignored for anon
}

export default function PostActions({ postId, likes, shares, time }: PostActionsProps) {
    const [localLikes, setLocalLikes] = useState(likes);
    const [localShares, setLocalShares] = useState(shares);
    const [isLiked, setIsLiked] = useState(false);
    const [fingerprint, setFingerprint] = useState<string | null>(null);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const shareButtonRef = useRef<HTMLDivElement>(null);

    // Memoize shareUrl and shareText (runs only on client after hydration)
    const { shareUrl, shareText } = useMemo(() => {
        if (typeof window === 'undefined') {
            return { shareUrl: '', shareText: '' };
        }
        return {
            shareUrl: `${window.location.origin}/share/${postId}`,
            shareText: 'Check out this honest customer service story on BeHonest!',
        };
    }, [postId]);

    // Init FingerprintJS once
    useEffect(() => {
        const loadFingerprint = async () => {
            if (typeof window === 'undefined') return;
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            const hash = result.visitorId;
            setFingerprint(hash);
            // Load localStorage liked check using hash
            const likedPosts = JSON.parse(localStorage.getItem(`beHonestLikedPosts_${hash}`) || '[]') as string[];
            setIsLiked(likedPosts.includes(postId));
        };
        loadFingerprint();
    }, [postId]);

    // Dynamic positioning for menu (centered, with mobile fallback)
    const getMenuPosition = () => {
        if (!shareButtonRef.current) return 'left-1/2 -translate-x-1/2';
        const rect = shareButtonRef.current.getBoundingClientRect();
        const spaceRight = window.innerWidth - rect.right;
        const spaceLeft = rect.left;
        const menuWidth = 280; // Approximate menu width
        // Center if enough space on both sides; otherwise, align to edge with space
        if (spaceLeft >= menuWidth / 2 && spaceRight >= menuWidth / 2) {
            return 'left-1/2 -translate-x-1/2'; // Centered
        } else if (spaceLeft > spaceRight) {
            return 'left-0 translate-x-0'; // Left-aligned
        } else {
            return 'right-0 translate-x-0'; // Right-aligned
        }
    };

    // Shared increment logic for shares
    const incrementShare = useCallback(() => {
        const previousShares = localShares;
        setLocalShares(previousShares + 1); // Optimistic update
        fetch(`/api/posts/${postId}/share`, { method: 'POST' })
            .catch((err) => {
                console.error('Share increment failed:', err);
                setLocalShares(previousShares); // Revert on failure
            });
    }, [localShares, postId]);

    const toggleLike = async () => {
        if (!fingerprint) return;
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
                        fingerprintHash: fingerprint,
                        liked: true
                    }),
                });
                if (res.status === 429) {
                    const errorData = await res.json();
                    toast.error(errorData.error || 'Already liked—try again later.');
                    // Revert
                    setIsLiked(false);
                    setLocalLikes(likes);
                    const likedPosts = JSON.parse(localStorage.getItem(`beHonestLikedPosts_${fingerprint}`) || '[]') as string[];
                    const updated = likedPosts.filter((id) => id !== postId);
                    localStorage.setItem(`beHonestLikedPosts_${fingerprint}`, JSON.stringify(updated));
                    return;
                }
                if (!res.ok) throw new Error('Failed to like');
                toast.success('Liked! ❤️');
            } catch (err) {
                console.error('Like failed:', err);
                toast.error('Like failed—please try again.');
                // Revert
                setIsLiked(false);
                setLocalLikes(likes);
                const likedPosts = JSON.parse(localStorage.getItem(`beHonestLikedPosts_${fingerprint}`) || '[]') as string[];
                const updated = likedPosts.filter((id) => id !== postId);
                localStorage.setItem(`beHonestLikedPosts_${fingerprint}`, JSON.stringify(updated));
            }
        }
    };

    const handleShare = () => {
        setShowShareMenu((prev) => !prev); // Toggle menu visibility
    };

    const copyToClipboard = async () => {
        incrementShare(); // Increment on option selection
        try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success('Link copied to clipboard! 📋');
        } catch {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = shareUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            toast.success('Link copied!');
        }
        setShowShareMenu(false);
    };

    const shareToSocial = (platform: string) => {
        incrementShare(); // Increment on option selection
        let url = '';
        switch (platform) {
            case 'twitter':
                url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                break;
            default:
                return;
        }
        window.open(url, '_blank', 'width=600,height=400,noopener,noreferrer');
        setShowShareMenu(false);
    };

    const nativeShare = () => {
        incrementShare(); // Increment on option selection
        if (typeof navigator.share === 'function') {
            navigator.share({
                title: 'BeHonest Post',
                text: shareText,
                url: shareUrl,
            }).then(() => setShowShareMenu(false)).catch(() => {
                setShowShareMenu(false); // Close even on error
            });
        }
    };

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shareButtonRef.current && !shareButtonRef.current.contains(event.target as Node)) {
                setShowShareMenu(false);
            }
        };
        if (showShareMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showShareMenu]);

    const menuPosition = getMenuPosition();

    return (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-4">
            <div className="flex items-center gap-6">
                <button
                    onClick={toggleLike}
                    disabled={!fingerprint}
                    className={`flex items-center gap-1 text-sm font-medium transition ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
                    {localLikes}
                </button>
                <div ref={shareButtonRef} className="relative inline-block">
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                        <Share2 className="w-4 h-4" />
                        {localShares}
                    </button>
                    {showShareMenu && shareUrl && ( // Guard with shareUrl truthy
                        <div
                            className={`absolute justify-center items-center top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50 overflow-hidden min-w-[256px] max-w-[280px] ${menuPosition
                                } left-0 md:left-96 md:-translate-x-1/2 sm:left-0 sm:w-full sm:translate-x-0`}
                            style={{
                                minWidth: '256px',
                                maxWidth: '280px',
                            }}
                        >
                            {/* Clipboard */}
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Copy className="w-4 h-4 flex-shrink-0" />
                                Copy Link
                            </button>
                            {/* Social Buttons */}
                            <button
                                onClick={() => shareToSocial('twitter')}
                                className="flex items-center gap-2 w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Twitter className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                Share on X
                            </button>
                            <button
                                onClick={() => shareToSocial('facebook')}
                                className="flex items-center gap-2 w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Facebook className="w-4 h-4 text-orange-600 flex-shrink-0" />
                                Share on Facebook
                            </button>
                            {/* <button
                                onClick={() => shareToSocial('linkedin')}
                                className="flex items-center gap-2 w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Linkedin className="w-4 h-4 text-blue-700 flex-shrink-0" />
                                Share on LinkedIn
                            </button> */}
                            {/* Native Share */}
                            {typeof navigator.share === 'function' && (
                                <button
                                    onClick={nativeShare}
                                    className="flex items-center gap-2 w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                                >
                                    <Share2 className="w-4 h-4 flex-shrink-0" />
                                    Native Share
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <span className="text-xs text-gray-500 ml-auto">
                {formatRelativeTime(time)}
            </span>
        </div>
    );
}