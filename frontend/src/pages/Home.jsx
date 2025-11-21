import React, { useEffect, useState, useRef } from "react";
import SearchBar from "../components/SearchBar";
import QuickMoods from "../components/QuickMoods";
import QuoteCard from "../components/QuoteCard";
import { getFromStorage, saveToStorage } from "../utils/storage";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../config";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const DEFAULT_MOODS = ["Motivation", "Love", "Life", "Success", "Happiness", "Friendship"];

export default function Home() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(() =>
    getFromStorage("autoRefresh", false)
  );
  const [count, setCount] = useState(12);
  const intervalRef = useRef(null);
  const [favs, setFavs] = useState(() => getFromStorage("favQuotes", []));

  useEffect(() => {
    fetchManyQuotes(mood || "Any", count);
  }, []);

  useEffect(() => {
    saveToStorage("autoRefresh", autoRefresh);
    clearInterval(intervalRef.current);

    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchManyQuotes(mood || "Any", count);
      }, 10000);
    }

    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, mood, count]);

  // ---------------- COPY FEATURE ----------------
  function handleCopy(quote) {
    const text = `"${quote.text}" — ${quote.author}`;
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied!");
    });
  }

  // --------------- FETCH SINGLE ---------------
  async function fetchSingleQuote(category) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `
      Provide one short quote in JSON only:
      {
        "text": "...",
        "author": "...",
        "category": "..."
      }
      Category: ${category}
    `;

    try {
      const response = await model.generateContent(prompt);
      const output = response.response.text();

      const jsonStart = output.indexOf("{");
      const jsonEnd = output.lastIndexOf("}") + 1;
      const parsed = JSON.parse(output.substring(jsonStart, jsonEnd));

      return {
        id: `${parsed.text.slice(0, 40)}-${Math.random().toString(36).slice(2, 7)}`,
        text: parsed.text,
        author: parsed.author || "Unknown",
        category: parsed.category || category
      };
    } catch {
      return {
        id: `fallback-${Math.random().toString(36).slice(2, 7)}`,
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt",
        category
      };
    }
  }

  // --------------- FETCH MANY ---------------
  async function fetchManyQuotes(category, n = 10) {
    setLoading(true);
    const results = [];

    for (let i = 0; i < n; i++) {
      if (i > 0) await new Promise((r) => setTimeout(r, 120));
      const q = await fetchSingleQuote(category === "" ? "Any" : category);
      results.push(q);
    }

    setQuotes(results);
    setLoading(false);
  }

  function handleSearch(newMood) {
    setMood(newMood);
    fetchManyQuotes(newMood || "Any", count);
  }

  function toggleFav(quote) {
    const existing = getFromStorage("favQuotes", []);
    const updated = existing.some((f) => f.id === quote.id)
      ? existing.filter((f) => f.id !== quote.id)
      : [quote, ...existing];

    setFavs(updated);
    saveToStorage("favQuotes", updated);
  }

  function isFav(quote) {
    return getFromStorage("favQuotes", []).some((f) => f.id === quote.id);
  }

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto transition-colors duration-300">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Discover quotes</h2>
          <p className="text-sm text-slate-400">
            Search mood or pick a quick tag to get quotes
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="h-4 w-4"
          />
          <span>Auto (home)</span>
        </label>
      </div>

      {/* SEARCH BAR */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search mood (eg. motivation, love, life...)"
      />

      {/* QUICK TAGS */}
      <div className="mt-4">
        <QuickMoods
          moods={DEFAULT_MOODS}
          onChoose={(m) => {
            setMood(m);
            handleSearch(m);
          }}
        />
      </div>

      {/* QUOTE GRID */}
      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className="h-40 bg-white/10 dark:bg-white/5 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quotes.map((q) => (
              <QuoteCard
                key={q.id}
                quote={q}
                onToggleFav={() => toggleFav(q)}
                isFav={isFav(q)}
                onCopy={() => handleCopy(q)}   // ← ADDED HERE
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


