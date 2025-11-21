import React, { useState } from "react";

export default function SearchBar({ onSearch, placeholder = "Search..." }) {
  const [value, setValue] = useState("");

  function submit(e) {
    e?.preventDefault();
    const v = value.trim();
    onSearch(v || "Any");
  }

  return (
    <form onSubmit={submit} className="flex gap-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-primary text-white font-semibold"
      >
        Search
      </button>
    </form>
  );
}
