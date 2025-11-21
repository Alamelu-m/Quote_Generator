import React, { useEffect, useState } from "react";
import QuoteCard from "../components/QuoteCard";
import { getFromStorage, saveToStorage } from "../utils/storage";

export default function Favourites() {
  const [favs, setFavs] = useState(() => getFromStorage("favQuotes", []));

  useEffect(() => {
    setFavs(getFromStorage("favQuotes", []));
  }, []);

  function removeFav(id) {
    const updated = favs.filter((f) => f.id !== id);
    setFavs(updated);
    saveToStorage("favQuotes", updated);
  }

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <header className="mb-6">
        <h2 className="text-3xl font-bold">Favourites</h2>
        <p className="text-sm text-slate-400">Your saved quotes appear here</p>
      </header>

      {favs.length === 0 ? (
        <div className="py-20 text-center text-slate-500">No favourites yet. Click on a quote to save it.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favs.map((q) => (
            <QuoteCard
              key={q.id}
              quote={q}
              onToggleFav={() => removeFav(q.id)}
              isFav={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
