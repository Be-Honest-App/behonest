'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to Sentry
        Sentry.captureException(error);
    }, [error]);

    return (
        <html>
            <body>
                <h2>Something went wrong!</h2>
                <button onClick={() => reset()}>Try again</button>
                <details style={{ whiteSpace: 'pre-wrap' }}>
                    <summary style={{ cursor: 'pointer' }}>View error details</summary>
                    {error.message}
                </details>
            </body>
        </html>
    );
}