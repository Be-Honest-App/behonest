interface ShareCardProps {
    text: string
}

export function ShareCard({ text }: ShareCardProps) {
    return (
        <div className="w-full p-6 rounded-xl text-center bg-fun-grad text-white font-bold text-xl">
            {text}
            <div className="flex gap-2 justify-center mt-4">
                <button className="btn text-xs px-2.5 py-1.5">Copy Link</button>
                <button className="btn-secondary text-xs px-2.5 py-1.5">Download Image</button>
            </div>
        </div>
    )
}