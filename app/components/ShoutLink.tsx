'use client'

import { useState } from 'react'
import { LoginModal } from './LoginModal'
import { ShareCard } from './ShareCard'

export default function ShoutLink() {
    const [slug, setSlug] = useState('ayodele')
    const [showModal, setShowModal] = useState(false)
    const [shareText, setShareText] = useState('Tell me your secret - on Be Honest!')

    const handleCreateLink = () => {
        alert(`ShoutLink created: behonest.me/${slug} (mock)`)
    }

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value || 'ayodele'
        setSlug(value)
        setShareText(`${value} - on Be Honest!`)
    }

    return (
        <>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ margin: 0 }}>ShoutLink — Personal honest links</h2>
                        <div className="muted" style={{ marginTop: '6px' }}>Create a social-ready link where people can leave anonymous feedback about you.</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn" onClick={() => setShowModal(true)}>Login / Create Account</button>
                    </div>
                </div>
                <div className="center" style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' as const }}>
                        <div>
                            <label className="muted">Ask a question</label>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                <input
                                    id="shoutSlug"
                                    placeholder="e.g Tell me your secret"
                                    value={slug}
                                    onChange={handleSlugChange}
                                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--glass)' }}
                                />
                                <button className="btn" onClick={handleCreateLink}>Create Link</button>
                            </div>
                            <div className="muted" style={{ marginTop: '8px' }}>
                                Preview: <span style={{ fontWeight: '700' }}>behonest.me/</span>
                                <span>{slug}...</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, alignItems: 'center' }}>
                            <div style={{ flex: 1, minWidth: '240px' }}>
                                <div className="link-preview">
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '800', fontSize: '16px' }}>behonest.me/<span>{slug}</span></div>
                                        <div className="muted" style={{ marginTop: '6px' }}>
                                            People can leave anonymous feedback via this link. You will see responses privately. Once you create a new link, the previous link stops running
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', alignItems: 'center' }}>
                                        <div className="qr"></div>
                                        <div className="muted" style={{ fontSize: '12px' }}>QR placeholder</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ flex: 1, minWidth: '220px' }}>
                                <div className="card">
                                    <div style={{ fontWeight: '800' }}>Social Image Preview</div>
                                    <ShareCard text={shareText} />
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <strong>Login to see your responses</strong>
                            <div className="muted" style={{ marginTop: '8px' }}>
                                You will see messages here once people start responding to your link. Export as image or copy a shareable card for social media.
                            </div>
                            <div style={{ marginTop: '8px' }}>
                                <div className="post" style={{ marginBottom: '8px' }}>
                                    <div className="muted small">3 days ago - 40 response</div>
                                    <div style={{ marginTop: '6px' }}>Tell me your secret nobody knows - Click to see all response</div>
                                </div>
                                <div className="post">
                                    <div className="muted small">1 week ago - 100 response</div>
                                    <div style={{ marginTop: '6px' }}>What do you love about me? - Click to see all response</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                <button className="btn">Create Social image preview card</button>
                                <button className="btn secondary">Generate printable QR</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    )
}