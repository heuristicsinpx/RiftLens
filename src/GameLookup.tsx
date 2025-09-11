import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

function GameLookup() {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [matches, setMatches] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result: string[] = await invoke("get_match_history", {
        gameName,
        tagLine,
        regionalGroup: "asia", // change to your region
      });
      setMatches(result);
    } catch (err) {
      console.error("Error:", err);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={gameName} onChange={(e) => setGameName(e.target.value)} placeholder="Game Name" />
        <input value={tagLine} onChange={(e) => setTagLine(e.target.value)} placeholder="Tagline" />
        <button type="submit">Search</button>
      </form>

      <ul>
        {matches.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    </div>
  );
}

export default GameLookup;
