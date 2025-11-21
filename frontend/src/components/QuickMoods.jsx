import React from "react";

export default function QuickMoods({ moods = [], onChoose }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {moods.map((m) => (
        <button
          key={m}
          onClick={() => onChoose(m)}
          className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-sm whitespace-nowrap"
        >
          {m}
        </button>
      ))}
    </div>
  );
}
