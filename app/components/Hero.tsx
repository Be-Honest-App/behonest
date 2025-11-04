'use client'

import { GradientCard } from '../components/ui/GradientCard'

export function Hero() {
    return (
        <div className="mx-5 md:mx-20 mt-10" style={{ gridColumn: '1 / -1' }}>
            <GradientCard className="text-center py-12 px-6 md:px-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    Speak Your Truth, Stay Anonymous
                </h1>

                <p className="text-white/90 text-lg max-w-xl mx-auto">
                    A safe space to express honestly, share feedback, and collect anonymous responses.
                </p>

                {/* <div className="flex gap-4 justify-center mt-6">
                    <button className="bg-white text-orange-600 font-semibold px-5 py-2 rounded-md hover:bg-orange-50 transition">
                        Create ShoutLink
                    </button>

                    <button className="border border-white/40 text-white font-semibold px-5 py-2 rounded-md hover:bg-white/10 transition">
                        Business
                    </button>
                </div> */}
            </GradientCard>
        </div>
    )
}
