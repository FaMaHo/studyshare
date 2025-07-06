import React, { useState, useEffect } from 'react';
import { addUniversity, addFaculty, addSubject, addNote, getUniversities } from '../api/api';
import type { University, Faculty, Subject, Note } from '../types';
import { UNIVERSITY_TYPES, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../types';

interface AddNoteModalProps {
  open: boolean;
  onClose: () => void;
  universities: University[];
  refreshUniversities: () => void;
  refreshNotes: () => void;
}





const AddNoteModal: React.FC<AddNoteModalProps> = ({ open, onClose, universities, refreshUniversities, refreshNotes }) => {
  const [localUniversities, setLocalUniversities] = useState<University[]>(universities);
  const [selectedUniId, setSelectedUniId] = useState<number | null>(null);
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [showAddUni, setShowAddUni] = useState(false);
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newUni, setNewUni] = useState({
    name: '',
    description: '',
    type: UNIVERSITY_TYPES[0],
  });
  const [newFaculty, setNewFaculty] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [professor, setProfessor] = useState('');
  const [semester, setSemester] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<{ name: string; size: number; type: string } | null>(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  // Refresh data when modal opens
  useEffect(() => {
    if (open) {
      getUniversities().then(setLocalUniversities);
    }
  }, [open]);

  if (!open) return null;

  // Find selected university and faculty objects
  const uniObj = localUniversities.find(u => u.id === selectedUniId);
  const facultyObj = uniObj?.faculties.find(f => f.id === selectedFacultyId);

  // Add new university (backend)
  const handleAddUni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUni.name.trim() || !newUni.description.trim()) {
      setError('Please fill in all university fields.');
      return;
    }
    if (localUniversities.some(u => u.name.trim().toLowerCase() === newUni.name.trim().toLowerCase())) {
      setError('This university already exists.');
      return;
    }
    try {
      await addUniversity({ name: newUni.name.trim(), description: newUni.description.trim(), type: newUni.type });
      // Refresh local universities and update parent
      const updatedUniversities = await getUniversities();
      setLocalUniversities(updatedUniversities);
      refreshUniversities();
      const newUniObj = updatedUniversities.find((u: University) => u.name === newUni.name);
      setSelectedUniId(newUniObj?.id || null);
      setNewUni({ name: '', description: '', type: UNIVERSITY_TYPES[0] });
      setShowAddUni(false);
      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add university');
    }
  };

  // Add new faculty (backend)
  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaculty.trim() || !uniObj) return;
    if (uniObj.faculties.some(f => f.name.trim().toLowerCase() === newFaculty.trim().toLowerCase())) {
      setError('This faculty already exists in this university.');
      return;
    }
    try {
      await addFaculty({ name: newFaculty.trim(), universityId: uniObj.id });
      // Refresh local universities and update parent
      const updatedUniversities = await getUniversities();
      setLocalUniversities(updatedUniversities);
      refreshUniversities();
      const updatedUni = updatedUniversities.find((u: University) => u.id === uniObj.id);
      const newFacultyObj = updatedUni?.faculties.find((f: Faculty) => f.name === newFaculty);
      setSelectedFacultyId(newFacultyObj?.id || null);
      setNewFaculty('');
      setShowAddFaculty(false);
      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add faculty');
    }
  };

  // Add new subject (backend)
  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !uniObj || !facultyObj) return;
    if (facultyObj.subjects.some(s => s.name.trim().toLowerCase() === newSubject.trim().toLowerCase())) {
      setError('This subject already exists in this faculty.');
      return;
    }
    try {
      await addSubject({ name: newSubject.trim(), facultyId: facultyObj.id });
      // Refresh local universities and update parent
      const updatedUniversities = await getUniversities();
      setLocalUniversities(updatedUniversities);
      refreshUniversities();
      const updatedUni = updatedUniversities.find((u: University) => u.id === uniObj.id);
      const updatedFaculty = updatedUni?.faculties.find((f: Faculty) => f.id === facultyObj.id);
      const newSubjectObj = updatedFaculty?.subjects.find((s: Subject) => s.name === newSubject);
      setSelectedSubjectId(newSubjectObj?.id || null);
      setNewSubject('');
      setShowAddSubject(false);
      setError('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add subject');
    }
  };

  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_FILE_TYPES.includes(f.type as any)) {
      setError('Invalid file type. Allowed: PDF, DOC, PPT, TXT.');
      setFile(null);
      setFilePreview(null);
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum allowed size is 10MB.');
      setFile(null);
      setFilePreview(null);
      return;
    }
    setFile(f);
    setFilePreview({ name: f.name, size: f.size, type: f.type });
    setError('');
  };

  // Note upload (backend)
  const handleNoteUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUniId || !selectedFacultyId || !selectedSubjectId || !professor.trim() || !semester.trim() || !file) {
      setError('Please fill in all fields and select a valid file.');
      return;
    }
    
    try {
      // Read file as base64
      const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('File read error'));
        reader.readAsDataURL(file);
      });
      
      // Find subjectId
      const uni = localUniversities.find(u => u.id === selectedUniId);
      const fac = uni?.faculties.find(f => f.id === selectedFacultyId);
      const subj = fac?.subjects.find(s => s.id === selectedSubjectId);
      if (!uni || !fac || !subj) {
        setError('Invalid university/faculty/subject selection.');
        return;
      }
      
      await addNote({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileData,
        professor: professor.trim(),
        semester: semester.trim(),
        subjectId: selectedSubjectId,
      });
      
      refreshNotes();
      setToast('Note uploaded successfully!');
      setSelectedUniId(null);
      setSelectedFacultyId(null);
      setSelectedSubjectId(null);
      setProfessor('');
      setSemester('');
      setFile(null);
      setFilePreview(null);
      setError('');
      setTimeout(() => setToast(''), 2000);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload note');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(36, 41, 70, 0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="glass-card" style={{ minWidth: 340, maxWidth: 480, padding: '2rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#232946' }} aria-label="Close">×</button>
        <h2 style={{ marginBottom: '1rem', fontWeight: 700, fontSize: '1.4rem', color: 'var(--primary)' }}>
          <span role="img" aria-label="add">➕</span> Add Note
        </h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleNoteUpload}>
          {/* University selection or add new */}
          {!showAddUni ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="university" style={{ fontWeight: 500 }}>University*</label>
              <select
                id="university"
                name="university"
                value={selectedUniId ?? ''}
                onChange={e => {
                  const id = e.target.value ? Number(e.target.value) : null;
                  setSelectedUniId(id);
                  setSelectedFacultyId(null);
                  setSelectedSubjectId(null);
                }}
                style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16 }}
                required
              >
                <option value="">Select university...</option>
                {localUniversities.map((u: University) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              <button type="button" style={{ background: 'none', color: 'var(--primary)', border: 'none', cursor: 'pointer', fontSize: 15, marginTop: 2 }} onClick={() => setShowAddUni(true)}>
                <span role="img" aria-label="add">➕</span> Add new university
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.03)', borderRadius: 8, padding: 8 }}>
              <label htmlFor="universityName">University Name*</label>
              <input
                id="universityName"
                name="name"
                type="text"
                placeholder="University Name*"
                value={newUni.name}
                onChange={e => setNewUni({ ...newUni, name: e.target.value })}
                style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 15 }}
                required
                autoComplete="organization"
              />
              <label htmlFor="universityDescription">Description*</label>
              <textarea
                id="universityDescription"
                name="description"
                placeholder="Description*"
                value={newUni.description}
                onChange={e => setNewUni({ ...newUni, description: e.target.value })}
                style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 15, resize: 'vertical', minHeight: 40 }}
                required
                autoComplete="off"
              />
              <label htmlFor="universityType">Type*</label>
              <select
                id="universityType"
                name="type"
                value={newUni.type}
                onChange={e => setNewUni({ ...newUni, type: e.target.value as any })}
                style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 15 }}
                autoComplete="off"
              >
                {UNIVERSITY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button type="button" style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 600, fontSize: 15, cursor: 'pointer' }} onClick={handleAddUni}>Add</button>
                <button type="button" style={{ background: 'none', color: '#e11d48', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 600, fontSize: 15, cursor: 'pointer' }} onClick={() => { setShowAddUni(false); setError(''); }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Faculty selection or add new */}
          {selectedUniId && !showAddFaculty && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="faculty" style={{ fontWeight: 500 }}>Faculty*</label>
              <select
                id="faculty"
                name="faculty"
                value={selectedFacultyId ?? ''}
                onChange={e => {
                  const id = e.target.value ? Number(e.target.value) : null;
                  setSelectedFacultyId(id);
                  setSelectedSubjectId(null);
                }}
                style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16 }}
                required
              >
                <option value="">Select faculty...</option>
                {uniObj?.faculties.map((f: Faculty) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <button type="button" style={{ background: 'none', color: 'var(--primary)', border: 'none', cursor: 'pointer', fontSize: 15, marginTop: 2 }} onClick={() => setShowAddFaculty(true)}>
                <span role="img" aria-label="add">➕</span> Add new faculty
              </button>
            </div>
          )}
          {selectedUniId && showAddFaculty && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.03)', borderRadius: 8, padding: 8 }}>
              <label htmlFor="facultyName">Faculty Name*</label>
              <input
                id="facultyName"
                name="faculty"
                type="text"
                placeholder="Faculty Name*"
                value={newFaculty}
                onChange={e => setNewFaculty(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 15 }}
                required
                autoComplete="off"
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button type="button" style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 600, fontSize: 15, cursor: 'pointer' }} onClick={handleAddFaculty}>Add</button>
                <button type="button" style={{ background: 'none', color: '#e11d48', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 600, fontSize: 15, cursor: 'pointer' }} onClick={() => { setShowAddFaculty(false); setError(''); }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Subject selection or add new */}
          {selectedFacultyId && !showAddSubject && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="subject" style={{ fontWeight: 500 }}>Subject*</label>
              <select
                id="subject"
                name="subject"
                value={selectedSubjectId ?? ''}
                onChange={e => setSelectedSubjectId(e.target.value ? Number(e.target.value) : null)}
                style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16 }}
                required
              >
                <option value="">Select subject...</option>
                {facultyObj?.subjects.map((s: Subject) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <button type="button" style={{ background: 'none', color: 'var(--primary)', border: 'none', cursor: 'pointer', fontSize: 15, marginTop: 2 }} onClick={() => setShowAddSubject(true)}>
                <span role="img" aria-label="add">➕</span> Add new subject
              </button>
            </div>
          )}
          {selectedFacultyId && showAddSubject && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.03)', borderRadius: 8, padding: 8 }}>
              <label htmlFor="subjectName">Subject Name*</label>
              <input
                id="subjectName"
                name="subject"
                type="text"
                placeholder="Subject Name*"
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 15 }}
                required
                autoComplete="off"
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button type="button" style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 600, fontSize: 15, cursor: 'pointer' }} onClick={handleAddSubject}>Add</button>
                <button type="button" style={{ background: 'none', color: '#e11d48', border: 'none', borderRadius: 6, padding: '0.5rem 1rem', fontWeight: 600, fontSize: 15, cursor: 'pointer' }} onClick={() => { setShowAddSubject(false); setError(''); }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Note fields (disabled if no subject selected) */}
          <label htmlFor="professor">Professor Name*</label>
          <input type="text" placeholder="Professor Name*" style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16 }} value={professor} onChange={e => setProfessor(e.target.value)} disabled={!selectedSubjectId} required />
          <label htmlFor="semester">Semester/Year*</label>
          <input type="text" placeholder="Semester/Year*" style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16 }} value={semester} onChange={e => setSemester(e.target.value)} disabled={!selectedSubjectId} required />
          <label htmlFor="noteFile">Upload File*</label>
          <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16 }} onChange={handleFileChange} disabled={!selectedSubjectId} required />
          {filePreview && (
            <div style={{ fontSize: 14, color: '#232946', background: 'rgba(0,0,0,0.04)', borderRadius: 6, padding: '0.5rem', marginTop: -8 }}>
              <span role="img" aria-label="file">📄</span> {filePreview.name} ({(filePreview.size / 1024).toFixed(1)} KB)
            </div>
          )}
          {error && <div style={{ color: '#e11d48', fontSize: 14 }}>{error}</div>}
          <button type="submit" style={{
            background: 'var(--primary)', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', borderRadius: 8, padding: '0.75rem', cursor: 'pointer', marginTop: 8,
          }} disabled={!selectedSubjectId}>
            <span role="img" aria-label="add">✅</span> Upload Note
          </button>
        </form>
        {toast && (
          <div style={{
            position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--primary)', color: '#fff', borderRadius: 8, padding: '0.75rem 1.5rem', fontWeight: 600, fontSize: 16, boxShadow: 'var(--shadow)',
            zIndex: 2000, transition: 'opacity 0.3s', opacity: toast ? 1 : 0
          }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNoteModal; 