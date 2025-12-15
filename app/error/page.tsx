// app/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();

  // Get error details from URL
  const error = searchParams.get('error') || 'Authentication Failed';
  const message = searchParams.get('message') || 'Unable to authenticate. Please try again.';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-3">{error}</h1>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>

          <button
            onClick={() => (window.location.href = '/login')}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
