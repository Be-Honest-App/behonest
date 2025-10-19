'use client';

import { useState } from 'react';
import { ShareCard } from './ShareCard';

export function LeftCol() {
    const [postText, setPostText] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [category, setCategory] = useState('General');
    const [isPosting, setIsPosting] = useState(false);

    const shareText =
        postText.length > 100
            ? postText.substring(0, 100) + '...'
            : postText || 'Share your best or worst customer service experience on Be Honest!';

    const handlePost = async () => {
        if (!postText.trim()) return;
        setIsPosting(true);

        const newPost = {
            tag: `${category} • ${businessName || 'General'}`,
            businessName: businessName || null,
            time: new Date().toISOString(),
            title: postText.substring(0, 50) + '...',
            content: postText,
            likes: 0,
            shares: 0,
        };

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPost),
            });

            if (res.ok) {
                // ✅ Clear input after successful post
                setPostText('');
                setBusinessName('');
            } else {
                console.error('Failed to save post.');
            }
        } catch (error) {
            console.error('Post error:', error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="card">
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <strong>Quick Post</strong>
                <span className="muted" style={{ fontSize: '12px' }}></span>
            </div>

            {/* Subtitle */}
            <div className="muted" style={{ marginTop: '8px', fontSize: '13px' }}>
                Share a customer service experience in under 2 minutes. Attach optional proof.
            </div>

            {/* Category */}
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass)',
                    marginTop: '8px',
                }}
            >
                <option value="General">General</option>
                <option value="Banking">Banking</option>
                <option value="Telecom">Telecom</option>
                <option value="Food & Beverage">Food & Beverage</option>
            </select>

            {/* Business name */}
            <input
                type="text"
                placeholder="Business name (optional) e.g. Konga"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass)',
                    marginTop: '8px',
                }}
            />

            {/* Post text */}
            <textarea
                placeholder="Write your experience..."
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                style={{
                    width: '100%',
                    height: '120px',
                    marginTop: '8px',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass)',
                }}
            />

            {/* Buttons and visibility */}
            <div
                style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '8px',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div className="muted">
                    Visibility: <span className="pill">Public</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        className="btn"
                        onClick={handlePost}
                        disabled={isPosting}
                    >
                        {isPosting ? 'Posting...' : 'Post Anonymously'}
                    </button>
                    <button className="btn secondary">Attach proof</button>
                </div>
            </div>

            {/* Share preview */}
            <div style={{ marginTop: '16px' }}>
                <ShareCard text={shareText} />
            </div>

            {/* Divider */}
            <hr
                style={{
                    margin: '12px 0',
                    border: 'none',
                    borderTop: '1px solid var(--glass)',
                }}
            />

            {/* Filters */}
            <div>
                <strong>Filters</strong>
                <div
                    style={{
                        marginTop: '8px',
                        display: 'flex',
                        gap: '8px',
                        flexDirection: 'column' as const,
                    }}
                >
                    <select
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid var(--glass)',
                        }}
                    >
                        <option>Select industry</option>
                        <option>Banking</option>
                        <option>Telecom</option>
                        <option>Food & Beverage</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Country or city"
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid var(--glass)',
                        }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn secondary">Apply</button>
                        <button className="btn secondary">Clear</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
