const API_URL = 'https://studyshare-cebt.onrender.com';

export async function getUniversities() {
  try {
    const res = await fetch(`${API_URL}/universities`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching universities:', error);
    throw new Error('Failed to fetch universities');
  }
}

export async function addUniversity(data: { name: string; description: string; type: string }) {
  try {
    const res = await fetch(`${API_URL}/universities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error adding university:', error);
    throw error;
  }
}

export async function getFaculties() {
  try {
    const res = await fetch(`${API_URL}/faculties`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching faculties:', error);
    throw new Error('Failed to fetch faculties');
  }
}

export async function addFaculty(data: { name: string; universityId: number }) {
  try {
    const res = await fetch(`${API_URL}/faculties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error adding faculty:', error);
    throw error;
  }
}

export async function getSubjects() {
  try {
    const res = await fetch(`${API_URL}/subjects`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw new Error('Failed to fetch subjects');
  }
}

export async function addSubject(data: { name: string; facultyId: number }) {
  try {
    const res = await fetch(`${API_URL}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error adding subject:', error);
    throw error;
  }
}

export async function getNotes() {
  try {
    const res = await fetch(`${API_URL}/notes`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw new Error('Failed to fetch notes');
  }
}

export async function addNote(data: any) {
  try {
    const res = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
} 