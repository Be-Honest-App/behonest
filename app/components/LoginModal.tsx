'use client'

import { useState } from 'react'

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleCreate = () => {
        alert('Account created (mock). You can now create ShoutLink.')
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className={`modal ${isOpen ? 'show' : ''}`}>
            <div className="box card">
                <h3>Login / Create Account</h3>
                <div className="muted">Create a simple account to manage your ShoutLink(s)</div>
                <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button className="btn" onClick={handleCreate}>Create</button>
                    <button className="btn secondary" onClick={onClose}>Cancel</button>
                </div>
                <div style={{ marginTop: '8px' }} className="muted">
                    Or <button className="btn secondary">Continue with Google</button>
                </div>
            </div>
        </div>
    )
}