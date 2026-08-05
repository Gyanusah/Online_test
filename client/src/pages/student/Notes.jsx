import React, { useEffect, useState } from "react";
import { noteAPI } from "../../utils/api";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [visibleNotes, setVisibleNotes] = useState([]);

  useEffect(() => {
    // fetch notes from backend
    (async () => {
      try {
        const resp = await noteAPI.getNotes();
        const data = resp?.data?.data || [];
        setNotes(data);
      } catch (err) {
        setNotes([]);
      }
    })();
  }, []);

  useEffect(() => {
    // determine user's subscribed languages
    let user = null;
    try {
      user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
    } catch (e) {
      user = null;
    }

    const allowedIds = new Set();
    const allowedNames = new Set();

    if (user) {
      if (Array.isArray(user.subscribedLanguages)) {
        user.subscribedLanguages.forEach((sub) => {
          if (!sub) return;
          if (sub.status && sub.status !== "active") return;
          if (sub.expiryDate && new Date(sub.expiryDate) <= new Date()) return;
          if (sub.languageId) allowedIds.add(sub.languageId);
          if (sub.language) allowedNames.add(sub.language);
          if (sub.languageName) allowedNames.add(sub.languageName);
          if (sub.name) allowedNames.add(sub.name);
        });
      }
      if (user.preferredLanguage) allowedNames.add(user.preferredLanguage);
      if (user.preferredLanguageId) allowedIds.add(user.preferredLanguageId);
    }

    const isPdf = (note) => {
      const name = (note.fileName || note.filePath || "").toLowerCase();
      if (!name) return false;
      if (note.mimeType && note.mimeType.toLowerCase().includes("pdf"))
        return true;
      return name.endsWith(".pdf");
    };

    const filtered = notes.filter((note) => {
      if (!note) return false;
      if (!note.languageId && !note.languageName) return false;
      if (allowedIds.size === 0 && allowedNames.size === 0) return false;
      if (note.languageId && allowedIds.has(note.languageId)) {
        return isPdf(note);
      }
      if (note.languageName && allowedNames.has(note.languageName)) {
        return isPdf(note);
      }
      return false;
    });

    setVisibleNotes(filtered);
  }, [notes]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notes</h1>
      {visibleNotes.length === 0 ? (
        <p className="text-gray-600">
          No notes available for your subscription.
        </p>
      ) : (
        <div className="space-y-4">
          {visibleNotes.map((note) => (
            <div
              key={note._id || note.id}
              className="border rounded p-4 bg-white"
            >
              <h3 className="font-semibold">{note.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(note.createdAt || note.createdAt).toLocaleString()}
              </p>
              {note.filePath ? (
                <div className="mt-2">
                  <a
                    href={note.filePath}
                    download={note.fileName || "note.pdf"}
                    className="text-blue-600"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Download {note.fileName || "PDF"}
                  </a>
                </div>
              ) : (
                <p className="mt-2 text-sm text-red-600">
                  PDF not available for this note.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
