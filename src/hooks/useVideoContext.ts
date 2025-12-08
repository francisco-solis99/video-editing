import { useContext } from 'react';
import type { VideoContextType } from '@/types/videoTypes';
import { VideoContext } from '@/context/VideoContext';

export function useVideoContext(): VideoContextType {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext must be used within a VideoContextProvider');
  }
  return context;
};