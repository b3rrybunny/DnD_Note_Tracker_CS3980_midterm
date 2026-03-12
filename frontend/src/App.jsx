import { useState, useEffect } from 'react';

const API = "http://localhost:8000";

const CATEGORIES = ["NPC", "Location", "Quest", "Lore", "Combat", "Item", "Other"];

const CATEGORY_VARIANTS = {
  NPC: { bg: "danger", icon: "🧙" },
  Location: { bg: "success", icon: "🗺️" },
  Quest: { bg: "warning", icon: "📜" },
  Lore: { bg: "info", icon: "📖" },
  Combat: { bg: "dark", icon: "⚔️" },
  Item: { bg: "primary", icon: "💎" },
  Other: { bg: "secondary", icon: "📝" },
};

const emptyForm = {
  title: "",
  campaign: "",
  session_number: "",
  category: "Quest",
  content: "",
  tags: "",
};

export default function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API}/notes`);
      const data = await res.json();
      setNotes(data.reverse());
    } catch {
      setError("Could not connect to the API. Is the backend running?");
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        ...form,
        session_number: form.session_number ? parseInt(form.session_number) : null,
      };
      const res = await fetch(`${API}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save note");
      setSuccess("Note saved.");
      setForm(emptyForm);
      fetchNotes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this note?")) return;
    await fetch(`${API}/notes/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  const handleSearch = (e) => {
    if (e.target.value === "") {
      setSearch("");
      setFilteredNotes(notes);
      return;
    };
    setSearch(e.target.value);
    const q = e.target.value.toLowerCase();
    setFilteredNotes(notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.tags.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q)
    ));
  };

  useEffect(() => {
    if (search === "") {
      setFilteredNotes(notes);
    }
  }, [notes]);

  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand fw-bold">Campaign Notes</span>
          <span className="navbar-text">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </span>
        </div>
      </nav>

      <div className="container py-4" style={{ maxWidth: "960px" }}>

        {/* ADD NOTE FORM */}
        <div className="card mb-4">
          <div className="card-header">
            <strong>📜 New Campaign Note</strong>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Note Title *</label>
                  <input
                    className="form-control"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. The Dragon of Ashveil"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Campaign Name *</label>
                  <input
                    className="form-control"
                    name="campaign"
                    value={form.campaign}
                    onChange={handleChange}
                    placeholder="e.g. Curse of Strahd"
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Session #</label>
                  <input
                    className="form-control"
                    name="session_number"
                    type="number"
                    min="1"
                    value={form.session_number}
                    onChange={handleChange}
                    placeholder="7"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Category *</label>
                  <select className="form-select" name="category" value={form.category} onChange={handleChange} required>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{CATEGORY_VARIANTS[c].icon} {c}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="form-label">
                    Tags <span className="text-muted">(comma-separated)</span>
                  </label>
                  <input
                    className="form-control"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="e.g. villain, undead, Barovia"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Note Content *</label>
                  <textarea
                    className="form-control"
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe what happened, who you met, what you discovered..."
                    required
                  />
                </div>

                <div className="col-12 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setForm(emptyForm)}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="btn btn-dark px-4"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Note"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* NOTES LIST */}

        <div className="card mb-4">
          <div className="card-body">
            <input
              className="form-control"
              placeholder="Search notes by title, tag, or type..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: "3rem" }}>📜</div>
            <p className="mt-2">No notes found.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {filteredNotes.map((note) => {
              const { bg, icon } = CATEGORY_VARIANTS[note.category] || CATEGORY_VARIANTS.Other;
              const isExpanded = expandedId === note.id;
              const tags = note.tags ? note.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

              return (
                <div key={note.id} className="card">
                  <div
                    className="card-body"
                    style={{ cursor: "pointer" }}
                    onClick={() => setExpandedId(isExpanded ? null : note.id)}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className={`badge text-bg-${bg}`}>{icon} {note.category}</span>
                        <strong>{note.title}</strong>
                        <span className="text-muted small">
                          — {note.campaign}
                          {note.session_number ? ` · Session ${note.session_number}` : ""}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-muted small d-none d-md-inline">{note.created_at}</span>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                          title="Delete note"
                        >
                          🗑
                        </button>
                        <span className="text-muted">{isExpanded ? "▲" : "▼"}</span>
                      </div>
                    </div>

                    {!isExpanded && (
                      <p className="text-muted small mt-2 mb-0 text-truncate">
                        {note.content}
                      </p>
                    )}

                    {isExpanded && (
                      <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                        <hr className="my-2" />
                        <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.7" }}>{note.content}</p>
                        {tags.length > 0 && (
                          <div className="mt-2">
                            {tags.map((tag) => (
                              <span key={tag} className="badge text-bg-light border me-1">#{tag}</span>
                            ))}
                          </div>
                        )}
                        <div className="text-muted small mt-2">📅 {note.created_at}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}