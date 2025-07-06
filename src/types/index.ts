// Core data types
export interface Note {
  id?: number;
  university: string;
  faculty: string;
  subject: string;
  professor: string;
  semester: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileData: string;
  uploadedAt: number;
  subjectId?: number;
}

export interface Subject {
  id: number;
  name: string;
}

export interface Faculty {
  id: number;
  name: string;
  subjects: Subject[];
}

export interface University {
  id: number;
  name: string;
  description: string;
  type: string;
  faculties: Faculty[];
}

// Page navigation types
export type Page =
  | { name: 'main' }
  | { name: 'university'; university: University }
  | { name: 'faculty'; university: University; faculty: Faculty }
  | { name: 'subject'; university: University; faculty: Faculty; subject: Subject }
  | { name: 'note'; note: Note };

// Sort options
export type SortOption = 'newest' | 'oldest' | 'az' | 'za';

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface UniversityForm {
  name: string;
  description: string;
  type: string;
}

export interface FacultyForm {
  name: string;
  universityId: number;
}

export interface SubjectForm {
  name: string;
  facultyId: number;
}

export interface NoteForm {
  fileName: string;
  fileType: string;
  fileSize: number;
  fileData: string;
  professor: string;
  semester: string;
  subjectId: number;
}

// Modal props types
export interface AddNoteModalProps {
  open: boolean;
  onClose: () => void;
  universities: University[];
  refreshUniversities: () => void;
  refreshNotes: () => void;
}

export interface AddUniversityModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (university: UniversityForm) => void;
}

// File types
export interface FilePreview {
  name: string;
  size: number;
  type: string;
}

// Filter types
export interface Filters {
  university: string;
  faculty: string;
  subject: string;
  fileType: string;
  search: string;
}

// Constants
export const UNIVERSITY_TYPES = [
  'Technical',
  'Medical',
  'Economic',
  'Arts',
  'Law',
  'Other',
] as const;

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB 