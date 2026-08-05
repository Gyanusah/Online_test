import React, { useEffect, useState } from "react";
import { testAPI, noteAPI } from "../../utils/api";

const STORAGE_KEY = "institute_notes";

const NotesManager = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [languages, setLanguages] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedLanguageId, setSelectedLanguageId] = useState("");
  const [selectedLanguageName, setSelectedLanguageName] = useState("");

  useEffect(() => {
    // fetch available languages and institute notes from backend
    (async () => {
      try {
        const resp = await testAPI.getLanguages();
        const langs =
          resp?.data?.data?.languages || resp?.data?.languages || [];
        setLanguages(langs);
      } catch (e) {
        setLanguages([]);
      }

      try {
        const userRaw = localStorage.getItem("user");
        let instituteId = null;
        if (userRaw) {
          try {
            const u = JSON.parse(userRaw);
            instituteId = u._id || u.instituteId || null;
          } catch (e) {}
        }
        const notesResp = await noteAPI.getNotes({ instituteId });
        const data = notesResp?.data?.data || [];
        setNotes(data);
      } catch (err) {
        setNotes([]);
      }
    })();
  }, []);

  // note persistence handled by backend APIs

  const handleSubmit = (e) => {
    e.preventDefault();

    // require title and a PDF file and a language
    if (!title.trim() || !selectedFile || !selectedLanguageId) {
      setMessage({
        type: "error",
        text: "Please provide a title, choose a language and upload a PDF file.",
      });
      return;
    }

    (async () => {
      try {
        const form = new FormData();
        form.append("file", selectedFile);
        form.append("title", title);
        form.append("languageId", selectedLanguageId);
        form.append("languageName", selectedLanguageName || "");
        const userRaw = localStorage.getItem("user");
        if (userRaw) {
          try {
            const u = JSON.parse(userRaw);
            form.append("instituteId", u._id || u.instituteId || "");
          } catch (e) {}
        }

        const resp = await noteAPI.uploadNote(form);
        const saved = resp?.data?.data;
        if (saved) {
          setNotes((s) => [saved, ...s]);
          setMessage({ type: "success", text: "Note uploaded successfully." });
          setTitle("");
          setFileName("");
          setFileData(null);
          setSelectedFile(null);
          setSelectedLanguageId("");
          setSelectedLanguageName("");
        }
      } catch (err) {
        console.error(err);
        setMessage({
          type: "error",
          text: err?.response?.data?.message || "Failed to upload note",
        });
      }
    })();
  };

  const handleEdit = (note) => {
    // Editing is disabled; notes are immutable once created.
    return;
  };

  // Deletion disabled: notes are immutable after creation per requirement
  const handleDelete = (id) => {
    // no-op
    return;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Notes</h1>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <select
          value={selectedLanguageId}
          onChange={(e) => {
            const id = e.target.value;
            const sel = languages.find((l) => l._id === id) || {};
            setSelectedLanguageId(id);
            setSelectedLanguageName(sel.name || "");
          }}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select language for this note</option>
          {languages.map((l) => (
            <option key={l._id} value={l._id}>
              {l.name}
            </option>
          ))}
        </select>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="w-full border rounded px-3 py-2"
        />
        <div>
          <label className="block text-sm text-gray-700 mb-1">Upload PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const f = e.target.files && e.target.files[0];
              if (!f) return;
              // Enforce PDF only
              const isPdf =
                f.type === "application/pdf" ||
                f.name.toLowerCase().endsWith(".pdf");
              if (!isPdf) {
                setFileName("");
                setFileData(null);
                setMessage({
                  type: "error",
                  text: "Only PDF files are allowed. Please select a .pdf file.",
                });
                return;
              }
              setFileName(f.name);
              setSelectedFile(f);
              const reader = new FileReader();
              reader.onload = (ev) => {
                setFileData(ev.target.result);
                setMessage({ type: "", text: "" });
              };
              reader.onerror = (ev) => {
                console.error("FileReader error", ev);
                setMessage({
                  type: "error",
                  text: "Failed to read the selected PDF file.",
                });
              };
              try {
                reader.readAsDataURL(f);
              } catch (err) {
                console.error("FileReader exception", err);
                setMessage({
                  type: "error",
                  text: "Failed to process the selected file.",
                });
              }
            }}
            className="w-full"
          />
          {fileName && <p className="text-xs text-gray-500 mt-1">{fileName}</p>}
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Create Note
          </button>
        </div>
        {message.text && (
          <div
            className={`mt-2 rounded p-2 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-100"
                : "bg-red-50 text-red-700 border border-red-100"
            }`}
          >
            {message.text}
          </div>
        )}
      </form>

      <div className="space-y-4">
        {notes.length === 0 && <p className="text-gray-500">No notes yet.</p>}
        {notes.map((note) => (
          <div
            key={note._id || note.id}
            className="border rounded p-4 bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{note.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(note.createdAt || note.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-xs text-gray-400">
                  This note is immutable
                </span>
              </div>
            </div>
            {note.filePath ? (
              <div className="mt-3">
                <p className="text-sm text-gray-600">PDF uploaded.</p>
                <p className="text-xs text-gray-400">{note.fileName}</p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesManager;
