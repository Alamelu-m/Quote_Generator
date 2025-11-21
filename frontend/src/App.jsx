import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Favourites from "./pages/Favourites";
import { getFromStorage, saveToStorage } from "./utils/storage";

export default function App() {
  const [theme, setTheme] = useState(() => getFromStorage("theme", "light"));

  // Apply theme globally
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    saveToStorage("theme", theme);
  }, [theme]);

  return (
    <Router>
      <div
        className={`min-h-screen transition-colors duration-300 
        ${theme === "light"
            ? "bg-slate-50 text-slate-900"
            : "bg-slate-900 text-slate-100"
        }`}
      >

        {/* NAVBAR */}
        <nav
          className={`w-full py-5 px-6 flex items-center justify-between border-b transition-colors duration-300
          ${theme === "dark"
              ? "border-slate-700 bg-slate-900"
              : "border-slate-300 bg-slate-50"
          }`}
        >
          <h1 className="text-2xl font-bold">Random Quote Generator</h1>

          <div className="flex items-center gap-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/favourites" className="hover:underline">Favourites</Link>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 transition"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favourites" element={<Favourites />} />
        </Routes>
      </div>
    </Router>
  );
}

