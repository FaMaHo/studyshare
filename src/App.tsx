import React, { useState, useEffect } from "react";
import "./App.css";
import AddNoteModal from "./components/AddNoteModal";
import { getUniversities, getNotes, addUniversity, addFaculty, addSubject, addNote } from "./api/api";

// Define Note type for notes state
interface Note {
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
}

interface Subject { id: number; name: string; }
interface Faculty { id: number; name: string; subjects: Subject[]; }
interface University {
  id: number;
  name: string;
  description: string;
  type: string;
  faculties: Faculty[];
}

type Page =
  | { name: 'main' }
  | { name: 'university', university: University }
  | { name: 'faculty', university: University, faculty: Faculty }
  | { name: 'subject', university: University, faculty: Faculty, subject: Subject }
  | { name: 'note', note: Note }

function getFileTypeBadge(fileType: string) {
  if (fileType.includes('pdf')) return <span style={{ background: '#f3d6db', color: '#b91c1c', borderRadius: 3, padding: '1px 6px', fontSize: 11, fontWeight: 500, marginRight: 6, display: 'inline-block', letterSpacing: 0.5 }}>PDF</span>;
  if (fileType.includes('word')) return <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 3, padding: '1px 6px', fontSize: 11, fontWeight: 500, marginRight: 6, display: 'inline-block', letterSpacing: 0.5 }}>DOC</span>;
  if (fileType.includes('presentation')) return <span style={{ background: '#fef3c7', color: '#b45309', borderRadius: 3, padding: '1px 6px', fontSize: 11, fontWeight: 500, marginRight: 6, display: 'inline-block', letterSpacing: 0.5 }}>PPT</span>;
  if (fileType.includes('text')) return <span style={{ background: '#d1fae5', color: '#047857', borderRadius: 3, padding: '1px 6px', fontSize: 11, fontWeight: 500, marginRight: 6, display: 'inline-block', letterSpacing: 0.5 }}>TXT</span>;
  return <span style={{ background: '#e5e7eb', color: '#374151', borderRadius: 3, padding: '1px 6px', fontSize: 11, fontWeight: 500, marginRight: 6, display: 'inline-block', letterSpacing: 0.5 }}>FILE</span>;
}

function getFileNameWithoutExtension(fileName: string) {
  const lastDot = fileName.lastIndexOf('.')
  if (lastDot === -1) return fileName
  return fileName.slice(0, lastDot)
}

// Helper to check file type
function getFilePreview(note: Note) {
  if (note.fileType.includes('pdf')) {
    return (
      <iframe
        src={note.fileData}
        title="PDF Preview"
        style={{ width: '100%', minHeight: 480, border: '1px solid #e2e8f0', borderRadius: 8, margin: '1rem 0' }}
        aria-label="PDF preview"
      />
    )
  }
  if (note.fileType.includes('text')) {
    // Decode base64 dataURL with TextDecoder
    try {
      const base64 = note.fileData.split(',')[1]
      if (!base64) {
        return <div style={{ color: '#e11d48', margin: '1rem 0' }}>Invalid file data.</div>
      }
      const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
      const text = new TextDecoder('utf-8').decode(bytes)
      return (
        <pre style={{ background: '#f3f4f6', color: '#232946', borderRadius: 8, padding: '1rem', margin: '1rem 0', fontSize: 15, maxHeight: 320, overflow: 'auto' }} aria-label="Text file preview">{text}</pre>
      )
    } catch (error) {
      console.error('Error decoding text file:', error)
      return <div style={{ color: '#e11d48', margin: '1rem 0' }}>Could not preview this text file.</div>
    }
  }
  if (note.fileType.includes('word')) {
    return <div style={{ color: '#555', margin: '1rem 0' }}>DOC/DOCX preview is not supported in browser. Please download to view.</div>
  }
  if (note.fileType.includes('presentation')) {
    return <div style={{ color: '#555', margin: '1rem 0' }}>PPT/PPTX preview is not supported in browser. Please download to view.</div>
  }
  return <div style={{ color: '#888', margin: '1rem 0' }}>Preview not available for this file type.</div>
}

function App() {
  const [universities, setUniversities] = useState<University[]>([])
  const [addNoteOpen, setAddNoteOpen] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [notesTab, setNotesTab] = useState('recent')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState<Page>({ name: 'main' })

  // Filter state
  const [filterUniversity, setFilterUniversity] = useState<string>('')
  const [filterFaculty, setFilterFaculty] = useState<string>('')
  const [filterSubject, setFilterSubject] = useState<string>('')
  const [filterFileType, setFilterFileType] = useState<string>('')

  // Sort state
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest')

  // Edit/Delete Note state
  const [editNote, setEditNote] = useState<Note | null>(null)
  const [editForm, setEditForm] = useState<any>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Note | null>(null)

  // Get available faculties and subjects for current filter
  const availableFaculties = filterUniversity
    ? universities.find(u => u.name === filterUniversity)?.faculties || []
    : universities.flatMap(u => u.faculties)
  const availableSubjects = filterFaculty
    ? availableFaculties.find(f => f.name === filterFaculty)?.subjects || []
    : availableFaculties.flatMap(f => f.subjects)
  const availableFileTypes = Array.from(new Set(notes.map(n => n.fileType))).filter(Boolean)

  // Filtered notes for search and filters
  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.fileName.toLowerCase().includes(search.toLowerCase()) ||
      note.professor.toLowerCase().includes(search.toLowerCase()) ||
      note.subject.toLowerCase().includes(search.toLowerCase()) ||
      note.university.toLowerCase().includes(search.toLowerCase()) ||
      note.faculty.toLowerCase().includes(search.toLowerCase())
    const matchesUniversity = !filterUniversity || note.university === filterUniversity
    const matchesFaculty = !filterFaculty || note.faculty === filterFaculty
    const matchesSubject = !filterSubject || note.subject === filterSubject
    const matchesFileType = !filterFileType || note.fileType === filterFileType
    return matchesSearch && matchesUniversity && matchesFaculty && matchesSubject && matchesFileType
  })

  // Sort filtered notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'newest') return b.uploadedAt - a.uploadedAt
    if (sortBy === 'oldest') return a.uploadedAt - b.uploadedAt
    if (sortBy === 'az') return a.fileName.localeCompare(b.fileName)
    if (sortBy === 'za') return b.fileName.localeCompare(a.fileName)
    return 0
  })

  // Clear filters
  const clearFilters = () => {
    setFilterUniversity('')
    setFilterFaculty('')
    setFilterSubject('')
    setFilterFileType('')
    setSearch('')
  }

  // Fetch data from backend on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [universitiesData, notesData] = await Promise.all([
          getUniversities(),
          getNotes()
        ]);
        setUniversities(universitiesData);
        setNotes(notesData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        // You could add a toast notification here instead of alert
      }
    };
    
    fetchData();
  }, []);

  // Group notes by university
  const notesByUniversity = universities.map(uni => ({
    ...uni,
    notes: filteredNotes.filter(note => note.university === uni.name)
  }))

  // Handlers for navigation
  const handleUniversityClick = (uni: University) => setPage({ name: 'university', university: uni })
  const handleFacultyClick = (uni: University, faculty: Faculty) => setPage({ name: 'faculty', university: uni, faculty })
  const handleSubjectClick = (uni: University, faculty: Faculty, subject: Subject) => setPage({ name: 'subject', university: uni, faculty, subject })
  const handleNoteClick = (note: Note) => setPage({ name: 'note', note })
  const goBack = () => setPage({ name: 'main' })

  // Edit Note handler
  const handleEditNote = (note: Note) => {
    setEditNote(note)
    setEditForm({
      fileName: note.fileName,
      professor: note.professor,
      semester: note.semester,
    })
  }
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }
  const handleEditFormSave = () => {
    if (!editNote || !editForm) return
    
    // Check for duplicate (ignore the note being edited)
    const wouldDuplicate = notes.some(n =>
      n.university === editNote.university &&
      n.faculty === editNote.faculty &&
      n.subject === editNote.subject &&
      n.professor.trim().toLowerCase() === editForm.professor.trim().toLowerCase() &&
      n.semester.trim().toLowerCase() === editForm.semester.trim().toLowerCase() &&
      n.fileName.trim().toLowerCase() === editForm.fileName.trim().toLowerCase() &&
      n.uploadedAt !== editNote.uploadedAt
    )
    
    if (wouldDuplicate) {
      alert('A note with the same details and file name already exists.');
      return;
    }
    
    const updatedNotes = notes.map(n =>
      n.uploadedAt === editNote.uploadedAt && n.fileName === editNote.fileName
        ? { ...n, ...editForm }
        : n
    )
    
    setNotes(updatedNotes)
    setEditNote(null)
    setEditForm(null)
  }
  const handleDeleteNote = (note: Note) => {
    setShowDeleteConfirm(note)
  }
  const confirmDeleteNote = () => {
    if (!showDeleteConfirm) return
    
    const updatedNotes = notes.filter(n => !(n.uploadedAt === showDeleteConfirm.uploadedAt && n.fileName === showDeleteConfirm.fileName))
    setNotes(updatedNotes)
    setShowDeleteConfirm(null)
  }
  const cancelDeleteNote = () => setShowDeleteConfirm(null)

  // Breadcrumbs
  const renderBreadcrumbs = () => {
    if (page.name === 'main') return null
    const crumbs = []
    crumbs.push(<span key="main" style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setPage({ name: 'main' })}>Home</span>)
    if (page.name === 'university' || page.name === 'faculty' || page.name === 'subject' || page.name === 'note') {
      const uni = page.name === 'university' ? page.university : page.name === 'faculty' ? page.university : page.name === 'subject' ? page.university : page.name === 'note' ? universities.find(u => u.name === page.note.university) : undefined;
      if (uni) {
        crumbs.push(<span key="sep1"> / </span>)
        crumbs.push(<span key="uni" style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setPage({ name: 'university', university: uni })}>{uni.name}</span>)
      }
    }
    if (page.name === 'faculty' || page.name === 'subject' || page.name === 'note') {
      const fac = page.name === 'faculty' ? page.faculty : page.name === 'subject' ? page.faculty : page.name === 'note' ? universities.find(u => u.name === page.note.university)?.faculties.find(f => f.name === page.note.faculty) : undefined;
      if (fac && (page.name === 'faculty' || page.name === 'subject' || page.name === 'note')) {
        crumbs.push(<span key="sep2"> / </span>)
        crumbs.push(<span key="fac" style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setPage({ name: 'faculty', university: (page.name === 'faculty' || page.name === 'subject') ? page.university : universities.find(u => u.name === page.note.university)!, faculty: fac })}>{fac.name}</span>)
      }
    }
    if (page.name === 'subject' || page.name === 'note') {
      const subj = page.name === 'subject' ? page.subject : page.name === 'note' ? universities.find(u => u.name === page.note.university)?.faculties.find(f => f.name === page.note.faculty)?.subjects.find(s => s.name === page.note.subject) : undefined;
      if (subj && (page.name === 'subject' || page.name === 'note')) {
        crumbs.push(<span key="sep3"> / </span>)
        crumbs.push(<span key="subj" style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setPage({ name: 'subject', university: (page.name === 'subject') ? page.university : universities.find(u => u.name === page.note.university)!, faculty: (page.name === 'subject') ? page.faculty : universities.find(u => u.name === page.note.university)?.faculties.find(f => f.name === page.note.faculty)!, subject: subj })}>{subj.name}</span>)
      }
    }
    if (page.name === 'note') {
      crumbs.push(<span key="sep4"> / </span>)
      crumbs.push(<span key="note" style={{ color: 'var(--primary)' }}>{page.note.fileName}</span>)
    }
    return <div style={{ margin: '1rem 0', fontSize: '1.05rem', fontWeight: 500 }}>{crumbs}</div>
  }

  // University detail page
  const renderUniversityDetail = (uni: University) => (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
      {renderBreadcrumbs()}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: 8 }}><span role="img" aria-label="university">🎓</span> {uni.name}</h2>
        <div style={{ color: '#555', marginBottom: 8 }}>{uni.description}</div>
        <div style={{ color: '#4f46e5', fontWeight: 500, marginBottom: 16 }}><span role="img" aria-label="type">🏷️</span> {uni.type}</div>
        <h3 style={{ fontWeight: 600, fontSize: '1.2rem', margin: '1.5rem 0 0.5rem 0' }}>Faculties</h3>
        {uni.faculties.length === 0 ? (
          <div style={{ color: '#888', fontSize: '1rem' }}>No faculties yet.</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            {uni.faculties.map(fac => (
              <div
                key={fac.name}
                className="glass-card"
                style={{ minWidth: 220, padding: '1rem', cursor: 'pointer', transition: 'box-shadow 0.2s', border: '2px solid transparent' }}
                onClick={() => handleFacultyClick(uni, fac)}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${fac.name} faculty`}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleFacultyClick(uni, fac) }}
              >
                <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--primary)' }}><span role="img" aria-label="faculty">🏫</span> {fac.name}</div>
                <div style={{ color: '#888', fontSize: '0.98rem' }}>{fac.subjects.length} subjects</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button onClick={goBack} style={{ background: 'none', color: 'var(--primary)', border: 'none', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: 8 }}>&larr; Back</button>
    </div>
  )

  // Faculty detail page
  const renderFacultyDetail = (uni: University, faculty: Faculty) => (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
      {renderBreadcrumbs()}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 8 }}><span role="img" aria-label="faculty">🏫</span> {faculty.name}</h2>
        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', margin: '1.5rem 0 0.5rem 0' }}>Subjects</h3>
        {faculty.subjects.length === 0 ? (
          <div style={{ color: '#888', fontSize: '1rem' }}>No subjects yet.</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            {faculty.subjects.map(subj => (
              <div
                key={subj.name}
                className="glass-card"
                style={{ minWidth: 180, padding: '1rem', cursor: 'pointer', transition: 'box-shadow 0.2s', border: '2px solid transparent' }}
                onClick={() => handleSubjectClick(uni, faculty, subj)}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${subj.name} subject`}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSubjectClick(uni, faculty, subj) }}
              >
                <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--primary)' }}><span role="img" aria-label="subject">📚</span> {subj.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button onClick={() => setPage({ name: 'university', university: uni })} style={{ background: 'none', color: 'var(--primary)', border: 'none', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: 8 }}>&larr; Back</button>
    </div>
  )

  // Subject detail page (shows notes for this subject only)
  const renderSubjectDetail = (uni: University, faculty: Faculty, subject: Subject) => {
    const subjectNotes = notes.filter(n => n.university === uni.name && n.faculty === faculty.name && n.subject === subject.name)
  return (
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
        {renderBreadcrumbs()}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 8 }}><span role="img" aria-label="subject">📚</span> {subject.name}</h2>
          <h3 style={{ fontWeight: 600, fontSize: '1.1rem', margin: '1.5rem 0 0.5rem 0' }}>Notes</h3>
          {subjectNotes.length === 0 ? (
            <div style={{ color: '#888', fontSize: '1rem' }}>No notes for this subject yet.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {subjectNotes.slice().reverse().map(note => (
                <div
                  className="glass-card"
                  key={note.uploadedAt + note.fileName}
                  style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', cursor: 'pointer' }}
                  onClick={() => handleNoteClick(note)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for note ${note.fileName}`}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleNoteClick(note) }}
                >
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--primary)' }}>
                    {getFileTypeBadge(note.fileType)}
                    {getFileNameWithoutExtension(note.fileName)}
                  </div>
                  <div style={{ color: '#232946', fontSize: '1rem' }}>
                    <span role="img" aria-label="prof">👨‍🏫</span> {note.professor} &nbsp;|&nbsp;
                    <span role="img" aria-label="semester">🗓️</span> {note.semester}
                  </div>
                  <div style={{ color: '#888', fontSize: '0.95rem' }}>
                    Uploaded: {new Date(note.uploadedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setPage({ name: 'faculty', university: uni, faculty })} style={{ background: 'none', color: 'var(--primary)', border: 'none', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: 8 }}>&larr; Back</button>
      </div>
    )
  }

  // Note detail page
  const renderNoteDetail = (note: Note) => (
    <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      {renderBreadcrumbs()}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}><span role="img" aria-label="file">📄</span> {note.fileName}</h2>
        <div style={{ color: '#232946', fontSize: '1rem', marginBottom: 8 }}>
          <span role="img" aria-label="university">🎓</span> {note.university} &nbsp;|&nbsp;
          <span role="img" aria-label="faculty">🏫</span> {note.faculty} &nbsp;|&nbsp;
          <span role="img" aria-label="subject">📚</span> {note.subject}
        </div>
        <div style={{ color: '#555', fontSize: '0.98rem', marginBottom: 8 }}>
          <span role="img" aria-label="prof">👨‍🏫</span> {note.professor} &nbsp;|&nbsp;
          <span role="img" aria-label="semester">🗓️</span> {note.semester}
        </div>
        <div style={{ color: '#888', fontSize: '0.95rem', marginBottom: 8 }}>
          Uploaded: {new Date(note.uploadedAt).toLocaleString()}<br />
          Size: {(note.fileSize / 1024).toFixed(1)} KB
        </div>
        {/* File preview here */}
        {getFilePreview(note)}
        <a href={note.fileData} download={note.fileName} style={{ color: 'var(--secondary)', fontWeight: 500, marginTop: 4, textDecoration: 'underline', fontSize: '1rem' }}>
          Download Note
        </a>
      </div>
      <button onClick={() => {
        // Go back to subject if possible, else to main
        const uni = universities.find(u => u.name === note.university)
        const fac = uni?.faculties.find(f => f.name === note.faculty)
        const subj = fac?.subjects.find(s => s.name === note.subject)
        if (uni && fac && subj) setPage({ name: 'subject', university: uni, faculty: fac, subject: subj })
        else setPage({ name: 'main' })
      }} style={{ background: 'none', color: 'var(--primary)', border: 'none', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: 8 }} aria-label="Back to previous page">&larr; Back</button>
    </div>
  )

  // When adding a university
  const handleAddUniversity = async (data: any) => {
    try {
      await addUniversity(data)
      const updatedUniversities = await getUniversities()
      setUniversities(updatedUniversities)
    } catch (error) {
      console.error('Error adding university:', error)
      // You could add a toast notification here
    }
  }
  // When adding a faculty
  const handleAddFaculty = async (data: any) => {
    try {
      await addFaculty(data)
      const updatedUniversities = await getUniversities()
      setUniversities(updatedUniversities)
    } catch (error) {
      console.error('Error adding faculty:', error)
      // You could add a toast notification here
    }
  }
  // When adding a subject
  const handleAddSubject = async (data: any) => {
    try {
      await addSubject(data)
      const updatedUniversities = await getUniversities()
      setUniversities(updatedUniversities)
    } catch (error) {
      console.error('Error adding subject:', error)
      // You could add a toast notification here
    }
  }
  // When adding a note
  const handleAddNote = async (data: any) => {
    try {
      await addNote(data)
      const updatedNotes = await getNotes()
      setNotes(updatedNotes)
    } catch (error) {
      console.error('Error adding note:', error)
      // You could add a toast notification here
    }
  }

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2rem 2rem 1rem 2rem' }}>
        <h1
          style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--primary)', userSelect: 'none' }}
          onClick={() => setPage({ name: 'main' })}
          title="Go to Home"
        >
          <span role="img" aria-label="graduation">🎓</span> StudyShare
        </h1>
        <div style={{ flex: 1, margin: '0 2rem' }}>
          <input
            type="text"
            placeholder="Search notes, subjects, professors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '2rem',
              border: 'none',
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(8px)',
              fontSize: '1rem',
              boxShadow: 'var(--shadow)',
              outline: 'none',
              transition: 'box-shadow var(--transition)'
            }}
          />
        </div>
        <button
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '2rem',
            border: 'none',
            background: 'var(--primary)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: 'var(--shadow)',
            cursor: 'pointer',
            transition: 'background var(--transition), box-shadow var(--transition)'
          }}
          onClick={() => setAddNoteOpen(true)}
        >
          <span role="img" aria-label="add">➕</span> Add Note
        </button>
      </header>

      {/* Main Content: Routing */}
      <main style={{ flex: 1, width: '100%', padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Breadcrumbs always visible and styled */}
        <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', marginBottom: '1.5rem', minHeight: 32 }}>
          {renderBreadcrumbs()}
        </div>
        {page.name === 'main' && (
          <>
            {/* Filters UI - at the top */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2.5rem', marginTop: '0', width: '100%', maxWidth: 1200 }}>
              <select value={filterUniversity} onChange={e => { setFilterUniversity(e.target.value); setFilterFaculty(''); setFilterSubject(''); }} style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16, minWidth: 160 }}>
                <option value="">All Universities</option>
                {universities.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
              </select>
              <select value={filterFaculty} onChange={e => { setFilterFaculty(e.target.value); setFilterSubject(''); }} style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16, minWidth: 140 }} disabled={!filterUniversity && availableFaculties.length === 0}>
                <option value="">All Faculties</option>
                {availableFaculties.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
              </select>
              <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16, minWidth: 140 }} disabled={!filterFaculty && availableSubjects.length === 0}>
                <option value="">All Subjects</option>
                {availableSubjects.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
              <select value={filterFileType} onChange={e => setFilterFileType(e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16, minWidth: 120 }}>
                <option value="">All File Types</option>
                {availableFileTypes.map(ft => <option key={ft} value={ft}>{ft.split('/').pop()?.toUpperCase() || ft}</option>)}
              </select>
              <button onClick={clearFilters} style={{ padding: '0.5rem 1.2rem', borderRadius: 8, border: 'none', background: 'var(--secondary)', color: '#fff', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginLeft: 8 }}>Clear Filters</button>
            </div>
            {/* Notes Section */}
            <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto 3rem auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--primary)', letterSpacing: '-0.5px', margin: 0 }}>
                  <span role="img" aria-label="notes">📚</span> Notes
                </h2>
                <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16, minWidth: 120 }}>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="az">A–Z</option>
                  <option value="za">Z–A</option>
                </select>
              </div>
              {sortedNotes.length === 0 ? (
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                  No notes found. Try adjusting your filters or search.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {sortedNotes.map(note => (
                    <div
                      className="glass-card"
                      key={note.uploadedAt + note.fileName}
                      style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', cursor: 'pointer', position: 'relative' }}
                      onClick={() => handleNoteClick(note)}
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for note ${note.fileName}`}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleNoteClick(note) }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--primary)' }}>
                        {getFileTypeBadge(note.fileType)}
                        {getFileNameWithoutExtension(note.fileName)}
                      </div>
                      <div style={{ color: '#232946', fontSize: '1rem' }}>
                        <span role="img" aria-label="university">🎓</span> {note.university} &nbsp;|&nbsp;
                        <span role="img" aria-label="faculty">🏫</span> {note.faculty} &nbsp;|&nbsp;
                        <span role="img" aria-label="subject">📚</span> {note.subject}
                      </div>
                      <div style={{ color: '#555', fontSize: '0.98rem' }}>
                        <span role="img" aria-label="prof">👨‍🏫</span> {note.professor} &nbsp;|&nbsp;
                        <span role="img" aria-label="semester">🗓️</span> {note.semester}
                      </div>
                      <div style={{ color: '#888', fontSize: '0.95rem' }}>
                        Uploaded: {new Date(note.uploadedAt).toLocaleString()}
                      </div>
                      <div style={{ color: '#888', fontSize: '0.95rem' }}>
                        Size: {(note.fileSize / 1024).toFixed(1)} KB
                      </div>
                      <a href={note.fileData} download={note.fileName} style={{ color: 'var(--secondary)', fontWeight: 500, marginTop: 4, textDecoration: 'underline', fontSize: '1rem' }}>
                        Download
                      </a>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button
                          onClick={e => { e.stopPropagation(); handleEditNote(note) }}
                          style={{
                            background: 'none',
                            color: '#888',
                            border: 'none',
                            borderRadius: 4,
                            padding: '0.2rem 0.5rem',
                            fontWeight: 500,
                            fontSize: 13,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            transition: 'color 0.2s',
                          }}
                          onMouseOver={e => (e.currentTarget.style.color = 'var(--primary)')}
                          onMouseOut={e => (e.currentTarget.style.color = '#888')}
                          aria-label={`Edit note ${note.fileName}`}
                        >Edit</button>
                        <button
                          onClick={e => { e.stopPropagation(); handleDeleteNote(note) }}
                          style={{
                            background: 'none',
                            color: '#bbb',
                            border: 'none',
                            borderRadius: 4,
                            padding: '0.2rem 0.5rem',
                            fontWeight: 500,
                            fontSize: 13,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            transition: 'color 0.2s',
                          }}
                          onMouseOver={e => (e.currentTarget.style.color = '#e11d48')}
                          onMouseOut={e => (e.currentTarget.style.color = '#bbb')}
                          aria-label={`Delete note ${note.fileName}`}
                        >Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Edit Note Modal/Inline Form */}
              {editNote && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(36,41,70,0.18)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="glass-card" style={{ minWidth: 340, maxWidth: 400, padding: '2rem', position: 'relative' }}>
                    <button onClick={() => setEditNote(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#232946' }} aria-label="Close edit note modal">×</button>
                    <h2 style={{ marginBottom: '1rem', fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>
                      <span role="img" aria-label="edit">✏️</span> Edit Note
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <label htmlFor="editFileName">File Name</label>
                      <input id="editFileName" name="fileName" type="text" value={editForm.fileName} onChange={handleEditFormChange} style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16 }} />
                      <label htmlFor="editProfessor">Professor</label>
                      <input id="editProfessor" name="professor" type="text" value={editForm.professor} onChange={handleEditFormChange} style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16 }} />
                      <label htmlFor="editSemester">Semester/Year</label>
                      <input id="editSemester" name="semester" type="text" value={editForm.semester} onChange={handleEditFormChange} style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16 }} />
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button onClick={handleEditFormSave} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Save</button>
                        <button onClick={() => setEditNote(null)} style={{ background: '#e11d48', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Delete Confirmation Modal */}
              {showDeleteConfirm && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(36,41,70,0.18)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="glass-card" style={{ minWidth: 320, maxWidth: 380, padding: '2rem', position: 'relative', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '1rem', fontWeight: 700, fontSize: '1.2rem', color: '#e11d48' }}>
                      <span role="img" aria-label="delete">🗑️</span> Delete Note
                    </h2>
                    <div style={{ marginBottom: '1.5rem' }}>Are you sure you want to delete <b>{showDeleteConfirm.fileName}</b>?</div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button onClick={confirmDeleteNote} style={{ background: '#e11d48', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Delete</button>
                      <button onClick={cancelDeleteNote} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
                    </div>
                    <button onClick={cancelDeleteNote} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#232946' }} aria-label="Close delete confirmation modal">×</button>
                  </div>
                </div>
              )}
            </div>
            {/* Section heading for universities */}
            <h2 style={{ width: '100%', maxWidth: 1200, margin: '0 auto 1.5rem auto', fontWeight: 700, fontSize: '1.5rem', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
              <span role="img" aria-label="university">🎓</span> Universities
            </h2>
            {/* University Grid - below notes and filters */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              width: '100%',
              maxWidth: '1200px',
            }}>
              {universities.map((uni, idx) => (
                <div
                  key={uni.name}
                  className="glass-card"
                  style={{ padding: '2rem', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
                  onClick={() => handleUniversityClick(uni)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${uni.name}`}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleUniversityClick(uni) }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2rem' }} role="img" aria-label="university">🎓</span>
                    <span style={{ fontWeight: 600, fontSize: '1.25rem' }}>{uni.name}</span>
                  </div>
                  <div style={{ color: '#555', fontSize: '1rem', marginBottom: '1rem' }}>{uni.description}</div>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '1rem', color: '#4f46e5', alignItems: 'center' }}>
                    <span title="Type"><span role="img" aria-label="type">🏷️</span> {uni.type}</span>
                  </div>
                </div>
              ))}
      </div>
          </>
        )}
        {page.name === 'university' && renderUniversityDetail(page.university)}
        {page.name === 'faculty' && renderFacultyDetail(page.university, page.faculty)}
        {page.name === 'subject' && renderSubjectDetail(page.university, page.faculty, page.subject)}
        {page.name === 'note' && renderNoteDetail(page.note)}
      </main>

      {/* Add Note Modal */}
      <AddNoteModal
        open={addNoteOpen}
        onClose={() => setAddNoteOpen(false)}
        universities={universities}
        refreshUniversities={() => getUniversities().then(setUniversities)}
        refreshNotes={() => getNotes().then(setNotes)}
      />

      {/* Footer */}
      <footer style={{ padding: '1.5rem 2rem', textAlign: 'center', color: '#232946', opacity: 0.85 }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <span role="img" aria-label="books">📚</span> Total Notes: <b>{notes.length}</b> &nbsp;|&nbsp;
          <span role="img" aria-label="university">🎓</span> Universities: <b>{universities.length}</b> &nbsp;|&nbsp;
          <span role="img" aria-label="users">👥</span> Active Users: <b>0</b>
        </div>
        <div style={{ fontSize: '0.95rem' }}>
          &copy; {new Date().getFullYear()} StudyShare &mdash; <span role="img" aria-label="email">💌</span> Contact: info@studyshare.com
        </div>
      </footer>
    </div>
  )
}

export default App
