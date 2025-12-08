// src/lib/ffmpeg.ts
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import type { Chunk } from '@/types/videoTypes';
// Import URL strings for the core files so Vite copies them
// Note: Vite will treat these as assets because of '?url'
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';

let ffmpegInstance: FFmpeg | null = null;

export async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;

  const ffmpeg = new FFmpeg();

  // helpful logging (can be removed later)
  ffmpeg.on('log', ({ message }) => console.log('[ffmpeg log]', message));
  ffmpeg.on('progress', (p) => console.log('[ffmpeg progress]', p));

  // IMPORTANT: pass coreURL + wasmURL (so the worker + wasm are found)
  await ffmpeg.load({ coreURL, wasmURL });

  ffmpegInstance = ffmpeg;
  return ffmpegInstance;
}

/**
 * Detects silent ranges in audio and returns a list of non-silent chunks to keep.
 * Each chunk is [startTime, endTime] in seconds.
 */
export async function detectSilentChunks(
  file: File,
  threshold: number = 0.02,
  minSilenceDuration: number = 0.5
): Promise<Array<Chunk>> {
  try {
    const audioCtx = new AudioContext();
    const ab = await file.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(ab.slice(0));
    const raw = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const duration = audioBuffer.duration;

    // Detect silent ranges
    const silentSegments: Array<[number, number]> = [];
    let isSilent = false;
    let startTime = 0;

    for (let i = 0; i < raw.length; i++) {
      const v = Math.abs(raw[i]);
      if (!isSilent && v < threshold) {
        isSilent = true;
        startTime = i / sampleRate;
      }
      if (isSilent && v >= threshold) {
        const endTime = i / sampleRate;
        if (endTime - startTime >= minSilenceDuration) {
          silentSegments.push([startTime, endTime]);
        }
        isSilent = false;
      }
    }

    console.log('Detected silent segments:', silentSegments);

    // Build non-silent chunks from silent ranges
    const chunks: Array<[number, number]> = [];
    let last = 0;
    for (const [s, e] of silentSegments) {
      if (s > last) chunks.push([last, s]);
      last = e;
    }
    if (last < duration) chunks.push([last, duration]);

    console.log('Non-silent chunks to keep:', chunks);
    return chunks;
  } catch (err) {
    console.error('Error detecting silence:', err);
    throw err;
  }
}

/**
 * Extract and concatenate non-silent chunks using ffmpeg.
 * Expects chunks as array of [startTime, endTime] pairs (seconds).
 */
async function processChunksWithFFmpeg(
  ffmpeg: FFmpeg,
  inputName: string,
  chunks: Array<[number, number]>,
  outputName: string,
  onProgress?: (percent: number) => void
): Promise<void> {
  // Helper to call ffmpeg.run or ffmpeg.exec
  const run = async (args: string[]) => {
    const ffmpegObj = ffmpeg as unknown as { run?: (...args: string[]) => Promise<void>; exec?: (args: string[]) => Promise<void> };
    if (typeof ffmpegObj.run === 'function') {
      return await ffmpegObj.run(...args);
    }
    if (typeof ffmpegObj.exec === 'function') {
      return await ffmpegObj.exec(args);
    }
    throw new Error('No ffmpeg run/exec method available');
  };

  console.log(`Processing ${chunks.length} chunks`);

  // Extract each chunk
  for (let i = 0; i < chunks.length; i++) {
    const [start, end] = chunks[i];
    const duration = end - start;
    const segName = `seg_${i}.mp4`;

    console.log(`Extracting chunk ${i}: start=${start.toFixed(2)}s, duration=${duration.toFixed(2)}s`);
    await run([
      '-ss', `${start}`,
      '-i', inputName,
      '-t', `${duration}`,
      '-c', 'copy',
      segName,
    ]);
    if (onProgress) {
      // Reserve last 10% for concat step
      const percent = Math.round(((i + 1) / (chunks.length + 1)) * 90);
      onProgress(percent);
    }
  }

  // Build concat list
  let concatList = '';
  for (let i = 0; i < chunks.length; i++) {
    concatList += `file 'seg_${i}.mp4'\n`;
  }
  console.log('Concat list:', concatList);
  await ffmpeg.writeFile('concat_list.txt', new TextEncoder().encode(concatList));

  // Concatenate all chunks
  console.log('Starting concatenation');
  await run([
    '-f', 'concat',
    '-safe', '0',
    '-i', 'concat_list.txt',
    '-c', 'copy',
    outputName,
  ]);
  if (onProgress) onProgress(100);
  console.log('Concatenation complete');
}

/**
 * Main function: Remove silence from a video file by detecting silent audio ranges
 * and concatenating non-silent chunks.
 */
export async function removeSilenceWithFilter(file: File, chunks: Chunk[], onProgress?: (percent: number) => void): Promise<Blob> {
  console.log('removeSilenceWithFilter: starting');
  const ffmpeg = await getFFmpeg();
  const inputName = 'input.mp4';
  const outputName = 'output.mp4';

  try {
    // Write input file
    console.log('Writing input file to ffmpeg FS');
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    // Detect non-silent chunks
    // const chunks = await detectSilentChunks(file);

    if (chunks.length === 0) {
      console.log('No non-silent chunks found; returning original file');
      const original = await ffmpeg.readFile(inputName);
      const uint8 = original instanceof ArrayBuffer ? new Uint8Array(original) : original instanceof Uint8Array ? original : new TextEncoder().encode(original);
      return new Blob([new Uint8Array(uint8)], { type: 'video/mp4' });
    }

    // Process chunks with ffmpeg
    await processChunksWithFFmpeg(ffmpeg, inputName, chunks, outputName, onProgress);

    // Read and return output
    console.log('Reading output file');
    const data = await ffmpeg.readFile(outputName);
    const uint8 = data instanceof ArrayBuffer ? new Uint8Array(data) : data instanceof Uint8Array ? data : new TextEncoder().encode(data);
    console.log('Output Blob created, size:', uint8.length);
    return new Blob([new Uint8Array(uint8)], { type: 'video/mp4' });
  } catch (err) {
    console.error('removeSilenceWithFilter error:', err);
    throw err;
  }
}

export async function attachLogs() {
  try {
    const ffmpeg = await getFFmpeg();
    // ffmpeg.on already attached in getFFmpeg; but you can add UI-friendly logging:
    ffmpeg.on('log', ({ message }) => {
      // setLog((l) => [...l, message]);
      console.log('[ffmpeg log]', message);
    });
    ffmpeg.on('progress', (p) => {
      // setLog((l) => [...l, `progress: ${JSON.stringify(p)}`]);
      console.log(p)
    });
  } catch (e) {
    console.warn('attachLogs error', e);
  }
}