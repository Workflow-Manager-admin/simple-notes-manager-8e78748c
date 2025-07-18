export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
};

/**
 * Read notes from localStorage, sorted by updatedAt descending.
 */
export function getAllNotes(): Note[] {
  const notes = JSON.parse(localStorage.getItem("astro-notes") || "[]") as Note[];
  return notes.sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Save notes to localStorage.
 */
function saveNotes(notes: Note[]) {
  localStorage.setItem("astro-notes", JSON.stringify(notes));
}

// PUBLIC_INTERFACE
export function createNote(title = "Untitled", content = ""): Note {
  const note: Note = {
    id: crypto.randomUUID(),
    title,
    content,
    updatedAt: Date.now(),
  };
  const notes = getAllNotes();
  notes.push(note);
  saveNotes(notes);
  return note;
}

// PUBLIC_INTERFACE
export function updateNote(id: string, fields: Partial<Omit<Note, "id" | "updatedAt">>): Note | null {
  const notes = getAllNotes();
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return null;
  notes[index] = {
    ...notes[index],
    ...fields,
    updatedAt: Date.now(),
  };
  saveNotes(notes);
  return notes[index];
}

// PUBLIC_INTERFACE
export function deleteNote(id: string): boolean {
  let notes = getAllNotes();
  const origLen = notes.length;
  notes = notes.filter((n) => n.id !== id);
  saveNotes(notes);
  return notes.length !== origLen;
}

// PUBLIC_INTERFACE
export function getNoteById(id: string): Note | undefined {
  return getAllNotes().find((n) => n.id === id);
}

// PUBLIC_INTERFACE
export function searchNotes(keyword: string): Note[] {
  const word = keyword.toLowerCase();
  return getAllNotes().filter(
    (n) =>
      n.title.toLowerCase().includes(word) ||
      n.content.toLowerCase().includes(word)
  );
}
