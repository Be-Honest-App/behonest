// utils/ghostId.ts (new file)
export function getGhostId(): string {
    let ghostId = typeof window !== 'undefined' ? localStorage.getItem('ghost_id') : null;
    if (!ghostId) {
        ghostId = crypto.randomUUID(); // Node 14+/browser native
        if (typeof window !== 'undefined') {
            localStorage.setItem('ghost_id', ghostId);
        }
    }
    return ghostId;
}