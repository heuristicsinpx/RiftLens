import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

function GameLookup() {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [platform, setPlatform] = useState("sg2"); // default to SG2
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // ⭐️ LOG: Show parameters before sending
    console.log("Calling get_match_history with:", { gameName, tagLine, platform });

    try {
      const result: string[] = await invoke("get_match_history", {
        gameName,  // must match Rust param
        tagLine,   // must match Rust param
        platform,  // must match Rust param
      });

      // ⭐️ LOG: Show returned match IDs
      console.log("Result from Rust:", result);

      setMatches(result);
    } catch (err: any) {
      console.error("Error from Tauri invoke:", err);
      setError(err.toString());
    }
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2 w-80">
        <input
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="Game Name"
          className="border px-2 py-1 rounded"
        />
        <input
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
          placeholder="Tagline"
          className="border px-2 py-1 rounded"
        />
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {/* Americas */}
          <option value="na1">NA1</option>
          <option value="br1">BR1</option>
          <option value="la1">LAN (LA1)</option>
          <option value="la2">LAS (LA2)</option>
          <option value="oc1">OCE (OC1)</option>

          {/* Europe */}
          <option value="euw1">EUW1</option>
          <option value="eun1">EUN1</option>
          <option value="tr1">TR1</option>
          <option value="ru">RU</option>

          {/* Asia */}
          <option value="kr">KR</option>
          <option value="jp1">JP1</option>

          {/* SEA (APAC) */}
          <option value="sg2">SG2</option>
          <option value="ph2">PH2</option>
          <option value="th2">TH2</option>
          <option value="tw2">TW2</option>
          <option value="vn2">VN2</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {matches.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Match History (last {matches.length})</h2>
          <ul>
            {matches.map((id) => (
              <li key={id} className="font-mono text-sm">
                {id}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}

export default GameLookup;
