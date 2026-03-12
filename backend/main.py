from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

app = FastAPI(title="DnD Campaign Notes API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
notes_db: dict = {}


class NoteCreate(BaseModel):
    title: str
    campaign: str
    session_number: Optional[int] = None
    category: str
    content: str
    tags: Optional[str] = ""  # comma-separated tags


# Note
class Note(NoteCreate):
    id: str
    created_at: str


@app.get("/")
def root():
    return {"message": "DnD Notes API is running"}


@app.get("/notes", response_model=list[Note])
def get_notes():
    return list(notes_db.values())


@app.get("/notes/{note_id}", response_model=Note)
def get_note(note_id: str):
    if note_id not in notes_db:
        raise HTTPException(status_code=404, detail="Note not found")
    return notes_db[note_id]


@app.post("/notes", response_model=Note)
def create_note(note: NoteCreate):
    note_id = str(uuid.uuid4())
    new_note = Note(
        id=note_id,
        created_at=datetime.now().strftime("%b %d, %Y – %I:%M %p"),
        **note.dict()
    )
    notes_db[note_id] = new_note
    return new_note


@app.delete("/notes/{note_id}")
def delete_note(note_id: str):
    if note_id not in notes_db:
        raise HTTPException(status_code=404, detail="Note not found")
    del notes_db[note_id]
    return {"message": "Note deleted"}
