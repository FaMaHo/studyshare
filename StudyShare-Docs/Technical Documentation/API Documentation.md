# API Documentation

#project/studyshare #type/documentation #priority/high

## 🎯 Overview

StudyShare API is a RESTful API built with Express.js and TypeScript. It provides endpoints for managing universities, faculties, subjects, and notes.

## 🔗 Base Configuration

- **Base URL**: `http://localhost:4000/api`
- **Content-Type**: `application/json`
- **Authentication**: Currently public (no authentication required)

## 📚 Endpoints

### Universities

#### GET /api/universities
Get all universities with their faculties and subjects.

**Response:**
```json
[
  {
    "id": 1,
    "name": "University of Technology",
    "description": "A leading technical university",
    "type": "Technical",
    "faculties": [
      {
        "id": 1,
        "name": "Computer Science",
        "subjects": [
          {
            "id": 1,
            "name": "Programming"
          }
        ]
      }
    ]
  }
]
```

#### POST /api/universities
Create a new university.

**Request Body:**
```json
{
  "name": "University Name",
  "description": "University description",
  "type": "Technical"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "University Name",
  "description": "University description",
  "type": "Technical"
}
```

### Faculties

#### GET /api/faculties
Get all faculties with their university and subjects.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Computer Science",
    "university": {
      "id": 1,
      "name": "University of Technology"
    },
    "subjects": [
      {
        "id": 1,
        "name": "Programming"
      }
    ]
  }
]
```

#### POST /api/faculties
Create a new faculty.

**Request Body:**
```json
{
  "name": "Faculty Name",
  "universityId": 1
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Faculty Name",
  "universityId": 1
}
```

### Subjects

#### GET /api/subjects
Get all subjects with their faculty and notes.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Programming",
    "faculty": {
      "id": 1,
      "name": "Computer Science"
    },
    "notes": [
      {
        "id": 1,
        "fileName": "lecture1.pdf",
        "fileType": "application/pdf",
        "fileSize": 1024000,
        "professor": "Dr. Smith",
        "semester": "Fall 2024"
      }
    ]
  }
]
```

#### POST /api/subjects
Create a new subject.

**Request Body:**
```json
{
  "name": "Subject Name",
  "facultyId": 1
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Subject Name",
  "facultyId": 1
}
```

### Notes

#### GET /api/notes
Get all notes with subject, faculty, and university information.

**Response:**
```json
[
  {
    "id": 1,
    "fileName": "lecture1.pdf",
    "fileType": "application/pdf",
    "fileSize": 1024000,
    "fileData": "data:application/pdf;base64,JVBERi0xLjQK...",
    "professor": "Dr. Smith",
    "semester": "Fall 2024",
    "uploadedAt": 1704067200000,
    "university": "University of Technology",
    "faculty": "Computer Science",
    "subject": "Programming"
  }
]
```

#### POST /api/notes
Upload a new note.

**Request Body:**
```json
{
  "fileName": "lecture1.pdf",
  "fileType": "application/pdf",
  "fileSize": 1024000,
  "fileData": "data:application/pdf;base64,JVBERi0xLjQK...",
  "professor": "Dr. Smith",
  "semester": "Fall 2024",
  "subjectId": 1
}
```

**Response:**
```json
{
  "id": 1,
  "fileName": "lecture1.pdf",
  "fileType": "application/pdf",
  "fileSize": 1024000,
  "professor": "Dr. Smith",
  "semester": "Fall 2024",
  "subjectId": 1,
  "uploadedAt": 1704067200000
}
```

## 🔧 Error Handling

### Standard Error Response
```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Common Error Codes
- `400` - Bad Request (invalid input)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (server error)

## 📊 Data Models

### University
```typescript
interface University {
  id: number;
  name: string;
  description: string;
  type: string;
  faculties: Faculty[];
}
```

### Faculty
```typescript
interface Faculty {
  id: number;
  name: string;
  universityId: number;
  university: University;
  subjects: Subject[];
}
```

### Subject
```typescript
interface Subject {
  id: number;
  name: string;
  facultyId: number;
  faculty: Faculty;
  notes: Note[];
}
```

### Note
```typescript
interface Note {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileData: string;
  professor: string;
  semester: string;
  uploadedAt: Date;
  subjectId: number;
  subject: Subject;
}
```

## 🔗 Frontend Integration

### API Client Functions
Located in `src/api/api.ts`:

```typescript
// Get all universities
export const getUniversities = async (): Promise<University[]>

// Create a new university
export const createUniversity = async (data: CreateUniversityData): Promise<University>

// Get all faculties
export const getFaculties = async (): Promise<Faculty[]>

// Create a new faculty
export const createFaculty = async (data: CreateFacultyData): Promise<Faculty>

// Get all subjects
export const getSubjects = async (): Promise<Subject[]>

// Create a new subject
export const createSubject = async (data: CreateSubjectData): Promise<Subject>

// Get all notes
export const getNotes = async (): Promise<Note[]>

// Upload a new note
export const uploadNote = async (data: CreateNoteData): Promise<Note>
```

## 🚀 Development

### Running the API
```bash
cd studyshare-backend
npm run dev
```

### Testing Endpoints
```bash
# Test with curl
curl http://localhost:4000/api/universities

# Test with Postman
# Import the API collection
```

## 📝 Notes

- All endpoints return JSON
- File uploads use base64 encoding
- No authentication currently implemented
- CORS enabled for frontend integration
- Error handling with try-catch blocks
- Input validation on all endpoints

## 🔗 Related Documents

- [[Database Schema]] - Database structure and relationships
- [[Frontend API Integration]] - How frontend uses the API
- [[Error Handling]] - Detailed error handling strategy
- [[Development Setup]] - How to set up the development environment 