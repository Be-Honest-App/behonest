interface ShareCardProps {
    text: string
}

export function ShareCard({ text }: ShareCardProps) {
    return (
        <div className="share-card ">
            {text}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button className="btn" style={{ fontSize: '12px', padding: '6px 10px' }}>Copy Link</button>
                <button className="btn secondary" style={{ fontSize: '12px', padding: '6px 10px' }}>Download Image</button>
            </div>
        </div>
    )
}