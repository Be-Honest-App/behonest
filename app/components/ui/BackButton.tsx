'use client'

import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'


type BackButtonProps = {
    className?: string
    children?: React.ReactNode
    /**
     * Where to go if there's no history to go back to.
     * Defaults to homepage (`/`).
     */
    fallbackHref?: string
    ariaLabel?: string
}

/**
 * Simple accessible back button for Next.js App Router.
 * Calls router.back() when possible, otherwise navigates to fallbackHref.
 */
export default function BackButton({
    className = '',
    children = 'Back',
    fallbackHref = '/',
    ariaLabel = 'Go back',
}: BackButtonProps) {
    const router = useRouter()

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            // If there's a navigation history, go back. Otherwise go to fallback.
            if (typeof window !== 'undefined' && window.history.length > 1) {
                router.back()
            } else {
                router.push(fallbackHref)
            }
        },
        [router, fallbackHref]
    )

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={ariaLabel}
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                border: 'none',
                padding: 0,
                margin: 0,
                cursor: 'pointer',
                font: 'inherit',
                color: 'inherit',
            }}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                focusable="false"
            >
                <path
                    d="M15 18l-6-6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <span>{children}</span>
        </button>
    )
}