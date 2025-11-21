import React, { useState, useEffect } from "react";

export default function Controls({
  categories = [],
  selected,
  onCategoryChange,
  onNewQuote,
  onCopy,
  surprise,
  setSurprise,
  loading
}) {
  const [copied, setCopied] = useState(false);

  // copy handler shows a local toast
  function handleCopy() {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <aside className="controls w-full lg:w-80 space-y-4">
      <div className="flex items-center gap-3">
        <select
          className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-slate-800 dark:border-slate-700"
          value={selected}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          onClick={onNewQuote}
          disabled={loading}
          className="px-3 py-2 rounded-lg bg-primary text-white font-semibold"
        >
          New
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleCopy}
          disabled={!onCopy || loading}
          className="flex-1 px-4 py-2 rounded-lg border bg-slate-50 dark:bg-slate-700 dark:border-slate-600"
        >
          {copied ? "Copied!" : "Copy"}
        </button>

        <div className="flex items-center gap-2">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={surprise}
              onChange={(e) => setSurprise(e.target.checked)}
              className="hidden"
            />
            <span className="w-10 h-5 bg-slate-300 dark:bg-slate-600 rounded-full relative transition-colors">
              <span className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform ${surprise ? 'translate-x-5' : ''}`}></span>
            </span>
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-300">Auto</span>
          </label>
        </div>
      </div>
    </aside>
  );
}
