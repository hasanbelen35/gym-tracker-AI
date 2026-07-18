import React from 'react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm dark:bg-brand-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-600 animate-pulse">Yükleniyor...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;