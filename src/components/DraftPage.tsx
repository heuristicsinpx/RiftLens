import { useEffect, useState } from "react";

interface SummonerInfo {
  gameName: string;
  tagLine: string;
  puuid: string;
  platform: string;
  regionalGroup: string;
}

export default function DraftPage() {
  const [summoner, setSummoner] = useState<SummonerInfo | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("summonerInfo");
    if (saved) setSummoner(JSON.parse(saved));
  }, []);

  if (!summoner) return <p>Please search for your summoner first.</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Draft Page</h2>
      <p>
        Logged in as: <strong>{summoner.gameName}#{summoner.tagLine}</strong>
      </p>

      {/* Here you can start building champ pick UI */}
      <div className="mt-4">
        <p>Role selection and enemy/team champ input will go here.</p>
      </div>
    </div>
  );
}
