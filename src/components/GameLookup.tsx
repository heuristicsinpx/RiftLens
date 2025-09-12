import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

interface SummonerInfo {
  gameName: string;
  tagLine: string;
  puuid: string;
  platform: string;
  regionalGroup: string;
}

function GameLookup() {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [platform, setPlatform] = useState("sg2");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const result: string[] = await invoke("get_match_history", {
        gameName,
        tagLine,
        platform,
      });

      setMatches(result);

      // ⭐ Save summoner info locally
      const summonerInfo: SummonerInfo = {
        gameName,
        tagLine,
        puuid: "", // temporary; can fetch from Rust if returned
        platform,
        regionalGroup: platform, // or compute via Rust
      };
      localStorage.setItem("summonerInfo", JSON.stringify(summonerInfo));
      console.log("Saved summoner info locally:", summonerInfo);
    } catch (err: any) {
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
          <option value="na1">NA1</option>
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
        <ul className="mt-4">
          {matches.map((id) => (
            <li key={id}>{id}</li>
          ))}
        </ul>
      )}

      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}

export default GameLookup;
