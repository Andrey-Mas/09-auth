// app/(private routes)/notes/action/create/page.tsx
export default function CreateNotePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Create note</h1>
      {/* Тут підключай свою форму NoteForm; мінімальна заглушка — ок */}
      <form style={{ maxWidth: 480 }}>
        <div>
          <label>Title</label>
          <input type="text" required />
        </div>
        <div>
          <label>Content</label>
          <textarea required rows={4} />
        </div>
        <div>
          <label>Tag</label>
          <input type="text" placeholder="Work | Personal | ..." required />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Save</button>
        </div>
      </form>
    </main>
  );
}
