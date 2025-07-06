# StudyShare 📚

A modern web application for sharing and managing academic notes, built with React, TypeScript, Express.js, and Prisma.

## 🚀 Features

- **📖 Note Management**: Upload, view, edit, and delete academic notes
- **🎓 University Organization**: Hierarchical structure (University → Faculty → Subject → Notes)
- **🔍 Advanced Search**: Search notes by content, professor, subject, or university
- **📁 File Support**: Support for PDF, DOC, DOCX, PPT, PPTX, and TXT files
- **🎨 Modern UI**: Beautiful glass-morphism design with responsive layout
- **⚡ Real-time Updates**: Instant updates when adding/editing content
- **🔒 Data Validation**: Comprehensive input validation and error handling

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Modern ES6+** features

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Prisma ORM** for database management
- **SQLite** database (can be easily switched to PostgreSQL/MySQL)

### Development Tools
- **ESLint** for code linting
- **TypeScript** for type checking
- **Hot reload** for development

## 📁 Project Structure

```
StudyShare/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── AddNoteModal.tsx     # Note upload modal
│   │   ├── AddUniversityModal.tsx # University creation modal
│   │   └── ...
│   ├── api/                     # API utilities
│   │   └── api.ts              # API client functions
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions
│   ├── styles/                  # CSS and styling
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Application entry point
├── studyshare-backend/          # Backend source code
│   ├── src/
│   │   └── index.ts            # Express server
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── seed.ts             # Database seeding
│   │   └── migrations/         # Database migrations
│   └── generated/               # Prisma generated files
├── docs/                        # Documentation
├── scripts/                     # Build and deployment scripts
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/studyshare.git
   cd studyshare
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd studyshare-backend
   npm install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database with sample data
   npx prisma db seed
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1: Start backend server
   cd studyshare-backend
   npm run dev
   
   # Terminal 2: Start frontend server
   cd ..
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000
   - Database UI: http://localhost:5555 (Prisma Studio)

## 📚 API Documentation

### Universities
- `GET /api/universities` - Get all universities with faculties and subjects
- `POST /api/universities` - Create a new university

### Faculties
- `GET /api/faculties` - Get all faculties with university and subjects
- `POST /api/faculties` - Create a new faculty

### Subjects
- `GET /api/subjects` - Get all subjects with faculty and notes
- `POST /api/subjects` - Create a new subject

### Notes
- `GET /api/notes` - Get all notes with subject, faculty, and university info
- `POST /api/notes` - Upload a new note

## 🗄️ Database Schema

```sql
-- Universities table
CREATE TABLE University (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL
);

-- Faculties table
CREATE TABLE Faculty (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  universityId INTEGER NOT NULL,
  FOREIGN KEY (universityId) REFERENCES University(id)
);

-- Subjects table
CREATE TABLE Subject (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  facultyId INTEGER NOT NULL,
  FOREIGN KEY (facultyId) REFERENCES Faculty(id)
);

-- Notes table
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

## 🎯 Features in Detail

### Note Management
- **Upload**: Support for multiple file types (PDF, DOC, DOCX, PPT, PPTX, TXT)
- **Preview**: Built-in file preview for PDF and text files
- **Download**: Direct download links for all uploaded files
- **Edit**: Modify note metadata (filename, professor, semester)
- **Delete**: Remove notes with confirmation dialog

### Search & Filter
- **Global Search**: Search across all note fields
- **University Filter**: Filter by specific university
- **Faculty Filter**: Filter by faculty within university
- **Subject Filter**: Filter by subject within faculty
- **File Type Filter**: Filter by document type
- **Sort Options**: Sort by newest, oldest, A-Z, Z-A

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Glass Morphism**: Modern UI with glass-like effects
- **Breadcrumb Navigation**: Easy navigation through hierarchy
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 🛠️ Development

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend
```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript
npm run start        # Start production server
npm run prisma:studio # Open Prisma Studio
npm run db:seed      # Seed database
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL="file:./dev.db"
PORT=4000
NODE_ENV=development
```

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd studyshare-backend
npm test
```

## 📦 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Railway/Render)
```bash
npm run build
npm start
```

## 🤝 Contributing

This is a personal project developed with AI assistance. While contributions are welcome, please note that this project was primarily developed as a learning exercise and demonstration of modern web development practices.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## �� Acknowledgments

- **React team** for the amazing framework
- **Vite team** for the fast build tool
- **Prisma team** for the excellent ORM
- **Tailwind CSS** for the utility-first CSS framework
- **OpenAI/Cursor AI** for AI-powered development assistance
- **GitHub** for providing excellent tools for open source development

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ by Fateme Hosseini**

*This project was developed with the assistance of AI tools for educational and demonstration purposes.*
