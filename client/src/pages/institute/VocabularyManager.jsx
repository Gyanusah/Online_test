import React, { useEffect, useState } from "react";
import { testAPI } from "../../utils/api";

const STORAGE_KEY = "institute_vocabulary";

const VocabularyManager = () => {
  const [items, setItems] = useState([]);
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState("");
  const [selectedLanguageName, setSelectedLanguageName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [alpha, setAlpha] = useState("");
  const [langFilter, setLangFilter] = useState("");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setItems(raw ? JSON.parse(raw) : []);
    } catch (err) {
      setItems([]);
    }

    (async () => {
      try {
        const resp = await testAPI.getLanguages();
        const langs =
          resp?.data?.data?.languages || resp?.data?.languages || [];
        setLanguages(langs);
      } catch (e) {
        setLanguages([]);
      }
    })();
  }, []);

  const save = (arr) => {
    setItems(arr);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch (err) {
      console.error("Failed to save vocabulary", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!word.trim() || !meaning.trim() || !selectedLanguageId) return;

    if (editingId) {
      const updated = items.map((it) =>
        it.id === editingId
          ? {
              ...it,
              word,
              meaning,
              example,
              languageId: selectedLanguageId,
              languageName: selectedLanguageName,
              updatedAt: Date.now(),
            }
          : it,
      );
      save(updated);
    } else {
      const entry = {
        id: Date.now().toString(),
        word,
        meaning,
        example,
        languageId: selectedLanguageId,
        languageName: selectedLanguageName,
        createdAt: Date.now(),
      };
      save([entry, ...items]);
    }

    setWord("");
    setMeaning("");
    setExample("");
    setEditingId(null);
    setSelectedLanguageId("");
    setSelectedLanguageName("");
    setSearchTerm("");
  };

  const handleEdit = (it) => {
    setEditingId(it.id);
    setWord(it.word);
    setMeaning(it.meaning);
    setExample(it.example || "");
    setSelectedLanguageId(it.languageId || "");
    setSelectedLanguageName(it.languageName || "");
  };

  const handleDelete = (id) => save(items.filter((i) => i.id !== id));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Vocabulary</h1>

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
          <option value="">Select language</option>
          {languages.map((l) => (
            <option key={l._id} value={l._id}>
              {l.name}
            </option>
          ))}
        </select>

        <input
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Word"
          className="w-full border rounded px-3 py-2"
        />
        <input
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          placeholder="Meaning"
          className="w-full border rounded px-3 py-2"
        />
        <input
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="Example (optional)"
          className="w-full border rounded px-3 py-2"
        />
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setWord("");
                setMeaning("");
                setExample("");
                setSelectedLanguageId("");
                setSelectedLanguageName("");
              }}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        <div className="mb-3">
          <input
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-2"
          />

          <div className="flex items-center gap-2">
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">All languages</option>
              {Array.from(
                new Set(items.map((i) => i.languageName).filter(Boolean)),
              ).map((ln) => (
                <option key={ln} value={ln}>
                  {ln}
                </option>
              ))}
            </select>

            <div className="flex gap-1 flex-wrap">
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((ch) => (
                <button
                  key={ch}
                  onClick={() => setAlpha(ch)}
                  className={`px-2 py-1 rounded text-sm ${alpha === ch ? "bg-blue-600 text-white" : "border"}`}
                >
                  {ch}
                </button>
              ))}
              <button
                onClick={() => setAlpha("")}
                className="px-2 py-1 rounded border text-sm"
              >
                All
              </button>
            </div>
          </div>
        </div>

        {items.length === 0 && (
          <p className="text-gray-500">No vocabulary yet.</p>
        )}

        {items
          .filter((it) => {
            if (langFilter && it.languageName !== langFilter) return false;
            if (alpha) {
              const first = (it.word || "").charAt(0).toUpperCase();
              if (first !== alpha) return false;
            }
            if (!searchTerm) return true;
            const q = searchTerm.trim().toLowerCase();
            return (
              (it.word || "").toLowerCase().includes(q) ||
              (it.meaning || "").toLowerCase().includes(q) ||
              (it.example || "").toLowerCase().includes(q)
            );
          })
          .sort((a, b) => (a.word || "").localeCompare(b.word || ""))
          .map((it) => (
            <div
              key={it.id}
              className="p-3 border rounded w-20 grid grid-cols-3 bg-red-100 cursor-pointer"
              onClick={() => setDetail(it)}
            >
              <div className="   items-start">
                <div className="font-semibold text-xl">{it.word}</div>
                <div className="text-sm text-gray-700">{it.meaning}</div>
                {it.example && (
                  <div className="col-span-2 mt-2 text-sm text-gray-700">
                    Example: {it.example}
                  </div>
                )}
                <div className="col-span-2 text-xs text-gray-500 mt-2">
                  {it.languageName}
                </div>
                {/* <div className="col-span-2 flex gap-2 justify-end mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(it);
                    }}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(it.id);
                    }}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div> */}
              </div>
            </div>
          ))}

        {detail && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white  rounded max-w-lg w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{detail.word}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {detail.languageName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setDetail(null);
                    }}
                    className="text-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-semibold">Meaning</p>
                <p className="mt-1">{detail.meaning}</p>
                {detail.example && (
                  <>
                    <p className="font-semibold mt-4">Example</p>
                    <p className="mt-1">{detail.example}</p>
                  </>
                )}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      handleEdit(detail);
                      setDetail(null);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(detail.id);
                      setDetail(null);
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyManager;
