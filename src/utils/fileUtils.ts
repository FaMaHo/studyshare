import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../types';

/**
 * Get file name without extension
 */
export function getFileNameWithoutExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1) return fileName;
  return fileName.slice(0, lastDot);
}

/**
 * Validate file type
 */
export function isValidFileType(fileType: string): boolean {
  return ALLOWED_FILE_TYPES.includes(fileType as any);
}

/**
 * Validate file size
 */
export function isValidFileSize(fileSize: number): boolean {
  return fileSize <= MAX_FILE_SIZE;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file type for badge display
 */
export function getFileTypeForBadge(fileType: string): string {
  if (fileType.includes('pdf')) return 'PDF';
  if (fileType.includes('word')) return 'DOC';
  if (fileType.includes('presentation')) return 'PPT';
  if (fileType.includes('text')) return 'TXT';
  return 'FILE';
}

/**
 * Get badge colors for file type
 */
export function getBadgeColors(fileType: string): { background: string; color: string } {
  if (fileType.includes('pdf')) {
    return { background: '#f3d6db', color: '#b91c1c' };
  }
  if (fileType.includes('word')) {
    return { background: '#dbeafe', color: '#1d4ed8' };
  }
  if (fileType.includes('presentation')) {
    return { background: '#fef3c7', color: '#b45309' };
  }
  if (fileType.includes('text')) {
    return { background: '#d1fae5', color: '#047857' };
  }
  return { background: '#e5e7eb', color: '#374151' };
}

/**
 * Decode base64 text data
 */
export function decodeBase64Text(base64Data: string): string | null {
  try {
    const base64 = base64Data.split(',')[1];
    if (!base64) return null;
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  } catch (error) {
    console.error('Error decoding base64 text:', error);
    return null;
  }
} 