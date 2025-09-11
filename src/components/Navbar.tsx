import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core"; // ✅ Tauri v2 import

type NavItem = {
  label: string;
  path: string;
};

type NavbarProps = {
  logo?: React.ReactNode;
  items: NavItem[];
};

const Navbar: React.FC<NavbarProps> = ({ logo, items }) => {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result: string[] = await invoke("get_match_history", {
        gameName,
        tagLine,
        regionalGroup: "asia", // or "europe", "asia"
      });
      setMatches(result);
    } catch (err: any) {
      setError(err.toString());
    }
  };

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="text-xl font-bold">
          {logo || <NavLink to="/draft">MyApp</NavLink>}
        </div>

        {/* Links */}
        <ul className="flex space-x-6">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `transition-colors ${
                    isActive
                      ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                      : "text-gray-700 hover:text-blue-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center space-x-2 ml-6"
        >
          <input
            type="text"
            placeholder="Game Name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          <input
            type="text"
            placeholder="Tagline"
            value={tagLine}
            onChange={(e) => setTagLine(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Lookup
          </button>
        </form>
      </div>

      {/* Show match history */}
      {matches.length > 0 && (
        <div className="bg-gray-50 p-4 border-t">
          <h2 className="font-semibold mb-2">Match History (last {matches.length})</h2>
          <ul className="text-sm space-y-1">
            {matches.map((id) => (
              <li key={id} className="font-mono">
                {id}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-600 text-center py-2">{error}</div>
      )}
    </nav>
  );
};

export default Navbar;
