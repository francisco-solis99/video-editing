import React, { createContext, useState } from 'react';
import type { VideoContextType } from '@/types/videoTypes';

// Context
// eslint-disable-next-line react-refresh/only-export-components
export const VideoContext = createContext<VideoContextType | undefined>(undefined);

// Provider
export const VideoContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [originalVideo, setOriginalVideo] = useState<File | null>(null);
  const [outputVideo, setOutputVideo] = useState<File | null>(null);

  const value: VideoContextType = {
    originalVideo,
    setOriginalVideo,
    outputVideo,
    setOutputVideo,
  };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
};

