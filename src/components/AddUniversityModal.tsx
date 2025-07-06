import React, { useState } from 'react';

interface AddUniversityModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (university: {
    name: string;
    description: string;
    type: string;
  }) => void;
}

const universityTypes = [
  'Technical',
  'Medical',
  'Economic',
  'Arts',
  'Law',
  'Other',
];

const AddUniversityModal: React.FC<AddUniversityModalProps> = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: universityTypes[0],
  });
  const [error, setError] = useState('');

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!form.name.trim() || !form.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    onAdd({
      name: form.name.trim(),
      description: form.description.trim(),
      type: form.type,
    });
    setForm({ name: '', description: '', type: universityTypes[0] });
    setError('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(36, 41, 70, 0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="glass-card" style={{ minWidth: 340, maxWidth: 400, padding: '2rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#232946' }} aria-label="Close">×</button>
        <h2 style={{ marginBottom: '1rem', fontWeight: 700, fontSize: '1.4rem', color: 'var(--primary)' }}>
          <span role="img" aria-label="add">➕</span> Add University
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            name="name"
            type="text"
            placeholder="University Name*"
            value={form.name}
            onChange={handleChange}
            style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16 }}
            required
          />
          <textarea
            name="description"
            placeholder="Description*"
            value={form.description}
            onChange={handleChange}
            style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16, resize: 'vertical', minHeight: 60 }}
            required
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 16 }}
          >
            {universityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {error && <div style={{ color: '#e11d48', fontSize: 14 }}>{error}</div>}
          <button type="submit" style={{
            background: 'var(--primary)', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', borderRadius: 8, padding: '0.75rem', cursor: 'pointer', marginTop: 8,
          }}>
            <span role="img" aria-label="add">✅</span> Add University
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUniversityModal; 