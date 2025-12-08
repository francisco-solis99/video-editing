export type Chunk = [number, number]; // [startTime, endTime] in seconds

export interface VideoContextType {
  originalVideo: File | null;
  setOriginalVideo: (file: File | null) => void;
  outputVideo?: File | null;
  setOutputVideo?: (file: File | null) => void;
}