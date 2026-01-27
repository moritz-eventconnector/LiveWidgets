'use client';

import { useEffect } from 'react';

export default function ClientRuntimeLogger() {
  useEffect(() => {
    const logPrefix = '[LiveWidgets][client]';
    console.info(logPrefix, 'hydration start', {
      href: window.location.href,
      userAgent: navigator.userAgent
    });

    const handleError = (event: ErrorEvent) => {
      console.error(logPrefix, 'window error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error(logPrefix, 'unhandled rejection', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    console.info(logPrefix, 'listeners attached');

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      console.info(logPrefix, 'listeners detached');
    };
  }, []);

  return null;
}
