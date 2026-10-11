import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', message = 'Loading templates...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 text-indigo-500',
    md: 'w-8 h-8 text-indigo-600',
    lg: 'w-12 h-12 text-indigo-600',
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center" role="status" aria-live="polite">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin`} />
      {message && <p className="mt-3 text-sm font-medium text-slate-500">{message}</p>}
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default LoadingSpinner;
