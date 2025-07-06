# StudyShare API Documentation

## Base URL
```
http://localhost:4000/api
```

## Authentication
Currently, the API doesn't require authentication. All endpoints are publicly accessible.

## Endpoints

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
  "fileData": "data:application/pdf;base64,JVBERi0xLjQK...",
  "professor": "Dr. Smith",
  "semester": "Fall 2024",
  "uploadedAt": "2024-01-01T00:00:00.000Z",
  "subjectId": 1
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Missing required fields: name, description, type"
}
```

### 404 Not Found
```json
{
  "error": "University not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create university"
}
```

## File Upload Guidelines

### Supported File Types
- PDF: `application/pdf`
- Word Documents: `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- PowerPoint: `application/vnd.ms-powerpoint`, `application/vnd.openxmlformats-officedocument.presentationml.presentation`
- Text Files: `text/plain`

### File Size Limit
- Maximum file size: 10MB

### File Data Format
Files must be converted to base64 data URL format:
```
data:application/pdf;base64,JVBERi0xLjQK...
```

## Rate Limiting
Currently, there are no rate limits implemented. Consider implementing rate limiting for production use.

## CORS
The API supports CORS for cross-origin requests from the frontend application.

## Database Schema

### University
```sql
CREATE TABLE University (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL
);
```

### Faculty
```sql
CREATE TABLE Faculty (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  universityId INTEGER NOT NULL,
  FOREIGN KEY (universityId) REFERENCES University(id)
);
```

### Subject
```sql
CREATE TABLE Subject (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  facultyId INTEGER NOT NULL,
  FOREIGN KEY (facultyId) REFERENCES Faculty(id)
);
```

### Note
```sql
CREATE TABLE Note (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fileName TEXT NOT NULL,
  fileType TEXT NOT NULL,
  fileSize INTEGER NOT NULL,
  fileData TEXT NOT NULL,
  professor TEXT NOT NULL,
  semester TEXT NOT NULL,
  uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  subjectId INTEGER NOT NULL,
  FOREIGN KEY (subjectId) REFERENCES Subject(id)
);
``` 