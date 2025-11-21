import React from "react";
import { FaHeart, FaRegHeart, FaCopy } from "react-icons/fa";

export default function QuoteCard({ quote, onToggleFav, isFav, onCopy }) {
  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition relative">

      {/* Quote Text */}
      <p className="text-lg font-medium">"{quote.text}"</p>

      {/* Author */}
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
        — {quote.author}
      </p>

      {/* Buttons */}
      <div className="flex items-center justify-between mt-4">

        {/* Favourite Button */}
        <button onClick={onToggleFav} className="text-red-500 text-xl">
          {isFav ? <FaHeart /> : <FaRegHeart />}
        </button>

        {/* Copy Button */}
        <button
          onClick={() => onCopy(quote)}
          className="text-blue-500 text-xl hover:scale-110 transition"
        >
          <FaCopy />
        </button>
      </div>
    </div>
  );
}


