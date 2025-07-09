import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated/prisma';
import compression from 'compression';
import helmet from 'helmet';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: '15mb' })); // allow large file uploads
app.use(compression());
app.use(helmet());
// Add custom CSP, COOP, and XFO headers
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self' https://studyshare-api.onrender.com https://studyshare.app; img-src * data:; script-src 'self' 'unsafe-inline' https://studyshare-api.onrender.com; style-src 'self' 'unsafe-inline';");
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Health check
// @ts-expect-error false positive on route handler types
app.get('/', (req, res) => res.send('StudyShare backend running!'));

// Get all universities (with faculties and subjects)
app.get('/api/universities', async (req: Request, res: Response) => {
  try {
    const universities = await prisma.university.findMany({
      include: { 
        faculties: { 
          include: { 
            subjects: {
              select: {
                id: true,
                name: true
              }
            } 
          } 
        } 
      }
    });
    res.json(universities);
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
});

// Add a university
app.post('/api/universities', async (req: Request, res: Response) => {
  const { name, description, type } = req.body;
  
  if (!name || !description || !type) {
    res.status(400).json({ error: 'Missing required fields: name, description, type' });
    return;
  }
  
  try {
    const uni = await prisma.university.create({ data: { name, description, type } });
    res.json(uni);
  } catch (e) {
    console.error('Error creating university:', e);
    if (e instanceof Error && e.message.includes('Unique constraint')) {
      res.status(400).json({ error: 'University already exists.' });
    } else {
      res.status(500).json({ error: 'Failed to create university.' });
    }
  }
});

// Get all notes (with subject, faculty, university info)
app.get('/api/notes', async (req: Request, res: Response) => {
  const notes = await prisma.note.findMany({
    include: {
      subject: {
        include: {
          faculty: {
            include: { university: true }
          }
        }
      }
    }
  });
  
  // Transform the data to match frontend expectations
  const transformedNotes = notes.map(note => ({
    id: note.id,
    fileName: note.fileName,
    fileType: note.fileType,
    fileSize: note.fileSize,
    fileData: note.fileData,
    professor: note.professor,
    semester: note.semester,
    uploadedAt: note.uploadedAt.getTime(), // Convert to timestamp
    university: note.subject.faculty.university.name,
    faculty: note.subject.faculty.name,
    subject: note.subject.name,
    subjectId: note.subjectId
  }));
  
  res.json(transformedNotes);
});

// Upload a note
app.post('/api/notes', async (req: Request, res: Response) => {
  const { fileName, fileType, fileSize, fileData, professor, semester, subjectId } = req.body;
  
  if (!fileName || !fileType || !fileSize || !fileData || !professor || !semester || !subjectId) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  
  try {
    const note = await prisma.note.create({
      data: { fileName, fileType, fileSize, fileData, professor, semester, subjectId }
    });
    res.json(note);
  } catch (e) {
    console.error('Error creating note:', e);
    if (e instanceof Error && e.message.includes('Foreign key constraint')) {
      res.status(400).json({ error: 'Invalid subject ID.' });
    } else {
      res.status(500).json({ error: 'Failed to create note.' });
    }
  }
});

// Faculties endpoints
// Get all faculties (with university and subjects)
app.get('/api/faculties', async (req: Request, res: Response) => {
  const faculties = await prisma.faculty.findMany({
    include: { university: true, subjects: true }
  });
  res.json(faculties);
});

// Add a faculty
app.post('/api/faculties', async (req: Request, res: Response) => {
  const { name, universityId } = req.body;
  
  if (!name || !universityId) {
    res.status(400).json({ error: 'Missing required fields: name, universityId' });
    return;
  }
  
  try {
    const faculty = await prisma.faculty.create({ data: { name, universityId } });
    res.json(faculty);
  } catch (e) {
    console.error('Error creating faculty:', e);
    if (e instanceof Error && e.message.includes('Foreign key constraint')) {
      res.status(400).json({ error: 'Invalid university ID.' });
    } else {
      res.status(500).json({ error: 'Failed to create faculty.' });
    }
  }
});

// Subjects endpoints
// Get all subjects (with faculty and notes)
app.get('/api/subjects', async (req: Request, res: Response) => {
  const subjects = await prisma.subject.findMany({
    include: { faculty: { include: { university: true } }, notes: true }
  });
  res.json(subjects);
});

// Add a subject
app.post('/api/subjects', async (req: Request, res: Response) => {
  const { name, facultyId } = req.body;
  
  if (!name || !facultyId) {
    res.status(400).json({ error: 'Missing required fields: name, facultyId' });
    return;
  }
  
  try {
    const subject = await prisma.subject.create({ data: { name, facultyId } });
    res.json(subject);
  } catch (e) {
    console.error('Error creating subject:', e);
    if (e instanceof Error && e.message.includes('Foreign key constraint')) {
      res.status(400).json({ error: 'Invalid faculty ID.' });
    } else {
      res.status(500).json({ error: 'Failed to create subject.' });
    }
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 