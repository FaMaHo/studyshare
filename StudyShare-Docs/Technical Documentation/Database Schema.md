# Database Schema

#project/studyshare #type/documentation #priority/high

## 🎯 Overview

StudyShare uses Prisma ORM with SQLite database for development. The schema follows a hierarchical structure: University → Faculty → Subject → Note.

## 📊 Entity Relationship Diagram

```
University (1) ←→ (N) Faculty (1) ←→ (N) Subject (1) ←→ (N) Note
```

## 🗄️ Database Models

### University
```prisma
model University {
  id          Int       @id @default(autoincrement())
  name        String    @unique
  description String
  type        String
  faculties   Faculty[]
}
```

**Fields:**
- `id`: Primary key, auto-incrementing integer
- `name`: Unique university name
- `description`: University description
- `type`: University type (e.g., "Technical", "Medical", "Arts")
- `faculties`: One-to-many relationship with Faculty

### Faculty
```prisma
model Faculty {
  id           Int        @id @default(autoincrement())
  name         String
  university   University @relation(fields: [universityId], references: [id])
  universityId Int
  subjects     Subject[]
}
```

**Fields:**
- `id`: Primary key, auto-incrementing integer
- `name`: Faculty name
- `universityId`: Foreign key to University
- `university`: Many-to-one relationship with University
- `subjects`: One-to-many relationship with Subject

### Subject
```prisma
model Subject {
  id         Int      @id @default(autoincrement())
  name       String
  faculty    Faculty  @relation(fields: [facultyId], references: [id])
  facultyId  Int
  notes      Note[]
}
```

**Fields:**
- `id`: Primary key, auto-incrementing integer
- `name`: Subject name
- `facultyId`: Foreign key to Faculty
- `faculty`: Many-to-one relationship with Faculty
- `notes`: One-to-many relationship with Note

### Note
```prisma
model Note {
  id         Int      @id @default(autoincrement())
  fileName   String
  fileType   String
  fileSize   Int
  fileData   String   // base64 or file URL
  professor  String
  semester   String
  uploadedAt DateTime @default(now())
  subject    Subject  @relation(fields: [subjectId], references: [id])
  subjectId  Int
}
```

**Fields:**
- `id`: Primary key, auto-incrementing integer
- `fileName`: Original file name
- `fileType`: MIME type of the file
- `fileSize`: File size in bytes
- `fileData`: Base64 encoded file data or file URL
- `professor`: Professor's name
- `semester`: Academic semester (e.g., "Fall 2024")
- `uploadedAt`: Timestamp when note was uploaded
- `subjectId`: Foreign key to Subject
- `subject`: Many-to-one relationship with Subject

## 🔗 Relationships

### One-to-Many Relationships
1. **University → Faculty**: One university can have many faculties
2. **Faculty → Subject**: One faculty can have many subjects
3. **Subject → Note**: One subject can have many notes

### Foreign Key Constraints
- `Faculty.universityId` references `University.id`
- `Subject.facultyId` references `Faculty.id`
- `Note.subjectId` references `Subject.id`

## 📊 Sample Data

### Universities
```sql
INSERT INTO University (name, description, type) VALUES
('University of Technology', 'A leading technical university', 'Technical'),
('Medical University', 'Specialized in medical sciences', 'Medical'),
('Arts University', 'Focus on creative arts and design', 'Arts');
```

### Faculties
```sql
INSERT INTO Faculty (name, universityId) VALUES
('Computer Science', 1),
('Engineering', 1),
('Medicine', 2),
('Fine Arts', 3);
```

### Subjects
```sql
INSERT INTO Subject (name, facultyId) VALUES
('Programming', 1),
('Data Structures', 1),
('Mechanical Engineering', 2),
('Anatomy', 3),
('Painting', 4);
```

### Notes
```sql
INSERT INTO Note (fileName, fileType, fileSize, fileData, professor, semester, subjectId) VALUES
('lecture1.pdf', 'application/pdf', 1024000, 'base64data...', 'Dr. Smith', 'Fall 2024', 1),
('assignment1.pdf', 'application/pdf', 512000, 'base64data...', 'Prof. Johnson', 'Fall 2024', 1);
```

## 🛠️ Database Operations

### Prisma Commands
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

### Common Queries

#### Get University with Faculties and Subjects
```typescript
const university = await prisma.university.findUnique({
  where: { id: 1 },
  include: {
    faculties: {
      include: {
        subjects: true
      }
    }
  }
});
```

#### Get Notes with Subject Information
```typescript
const notes = await prisma.note.findMany({
  include: {
    subject: {
      include: {
        faculty: {
          include: {
            university: true
          }
        }
      }
    }
  }
});
```

#### Create New Note
```typescript
const note = await prisma.note.create({
  data: {
    fileName: 'lecture1.pdf',
    fileType: 'application/pdf',
    fileSize: 1024000,
    fileData: 'base64data...',
    professor: 'Dr. Smith',
    semester: 'Fall 2024',
    subjectId: 1
  }
});
```

## 🔧 Database Configuration

### Development (SQLite)
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### Production (PostgreSQL - Planned)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 📈 Performance Considerations

### Indexes
- Primary keys are automatically indexed
- Foreign keys should be indexed for better join performance
- Consider indexes on frequently queried fields

### File Storage
- Current: Base64 encoding in database
- Planned: File storage service (AWS S3, Cloudinary)
- Consider file size limits and compression

### Query Optimization
- Use Prisma's `select` to limit returned fields
- Implement pagination for large datasets
- Consider caching for frequently accessed data

## 🔗 Related Documents

- [[API Documentation]] - How the database is accessed via API
- [[Data Models]] - TypeScript interfaces for database models
- [[Migration Strategy]] - Database migration and versioning
- [[Development Setup]] - How to set up the database

## 📝 Notes

- SQLite used for development simplicity
- PostgreSQL planned for production
- File storage needs optimization for production
- Consider adding indexes for performance
- Implement soft deletes for data retention 