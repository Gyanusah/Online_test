import React, { useEffect, useState } from "react";

const STORAGE_KEY = "institute_vocabulary";

const Vocabulary = () => {
  const [items, setItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [search, setSearch] = useState("");
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

    const filtered = items.filter((it) => {
      if (!it) return false;
      if (!it.languageId && !it.languageName) return false;
      if (allowedIds.size === 0 && allowedNames.size === 0) return false;
      if (it.languageId && allowedIds.has(it.languageId)) return true;
      if (it.languageName && allowedNames.has(it.languageName)) return true;
      return false;
    });

    setVisibleItems(filtered);
  }, [items]);

  // compute languages for filter dropdown
  const languageOptions = Array.from(
    new Set(items.map((i) => i.languageName).filter(Boolean)),
  );

  const filteredItems = visibleItems
    .filter((it) => {
      if (langFilter && it.languageName !== langFilter) return false;
      if (alpha) {
        const first = (it.word || "").charAt(0).toUpperCase();
        if (first !== alpha) return false;
      }
      if (!search) return true;
      const q = search.trim().toLowerCase();
      return (
        (it.word || "").toLowerCase().includes(q) ||
        (it.meaning || "").toLowerCase().includes(q) ||
        (it.example || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (a.word || "").localeCompare(b.word || ""));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Vocabulary</h1>

      <div className="mb-4 space-y-2">
        <input
          placeholder="Search dictionary..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <div className="flex items-center gap-2">
          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All languages</option>
            {languageOptions.map((ln) => (
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

      {filteredItems.length === 0 ? (
        <p className="text-gray-600">
          No vocabulary available for your subscription.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {filteredItems.map((it) => (
            <div
              key={it.id}
              className="p-3 border rounded bg-white cursor-pointer"
              onClick={() => setDetail(it)}
            >
              <div className="  items-start">
                <div className="font-semibold text-xl">{it.word}</div>
                <div className="text-md text-gray-700">{it.meaning}</div>
                {it.example && (
                  <div className="col-span-2 text-sm mt-2">
                    Example: {it.example}
                  </div>
                )}
                {/* <div className="col-span-2 text-xs text-gray-500 mt-2">
                  {it.languageName}
                </div> */}
              </div>
            </div>
          ))}
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-lg w-full">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{detail.word}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {detail.languageName}
                </p>
              </div>
              <button onClick={() => setDetail(null)} className="text-gray-600">
                Close
              </button>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vocabulary;
