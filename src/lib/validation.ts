/**
 * Video file size validation utilities
 */

// Maximum file size in MB (set to 100 MB as a reasonable limit for Vercel serverless functions)
// You can adjust this based on your Vercel plan and processing time limits
export const MAX_VIDEO_SIZE_MB = 50;
export const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate video file size and type
 * @param file - The video file to validate
 * @returns ValidationResult with isValid flag and error message if invalid
 */
export function validateVideoFile(file: File): ValidationResult {
  // Check file type
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de archivo no permitido. Usa MP4, MOV o AVI. Recibido: ${file.type || 'desconocido'}`,
    };
  }

  // Check file size
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `El archivo es demasiado grande (${sizeMB} MB). El límite máximo es ${MAX_VIDEO_SIZE_MB} MB.`,
    };
  }

  return { isValid: true };
}

/**
 * Format bytes to human-readable size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
