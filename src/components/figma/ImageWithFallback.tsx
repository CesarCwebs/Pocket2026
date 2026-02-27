'use client';

import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
}

export const ImageWithFallback = ({ src, fallback, alt, ...props }: ImageWithFallbackProps) => {
  const [error, setError] = useState<React.SyntheticEvent<HTMLImageElement, Event> | null>(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  if (error || !src) {
    return (
      <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold">
        {fallback || (alt ? alt.charAt(0).toUpperCase() : 'U')}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={setError}
      {...props}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};
