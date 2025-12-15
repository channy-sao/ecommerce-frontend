// components/app-footer.tsx
import React from 'react';

export function AppFooter() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'My App';
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';

  return (
    <footer className="text-center p-2 border-t dark:border-gray-800">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        &copy; {new Date().getFullYear()} {appName} , Version: {appVersion}
      </p>
    </footer>
  );
}
