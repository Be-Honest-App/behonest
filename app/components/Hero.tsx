export function Hero() {
    return (
        <div className="card mx-5 md:mx-20" style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center' as const, background: 'var(--fun-grad)', color: 'white' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Speak Your Truth, Stay Anonymous</h1>
            <p style={{ fontSize: '18px', margin: '0 auto', maxWidth: '600px' }}>A safe space to express honestly, share feedback, and collect anonymous responses.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
                {/* <button className="btn" style={{ background: 'white', color: 'var(--accent)' }}>Create ShoutLink</button>
                <button className="btn secondary" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Business</button> */}
            </div>
        </div>
    )
}