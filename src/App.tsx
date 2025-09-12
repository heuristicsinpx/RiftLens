import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import GameLookup from "./components/GameLookup";


const Draft = () => <h1 className="p-6">Draft Page</h1>;
const Profile = () => <h1 className="p-6">Profile Page</h1>;

function App() {
  const navItems = [
    { label: "Draft", path: "/draft" },
    { label: "Profile", path: "/profile" },
    { label: "Game Lookup", path: "/lookup" },
  ];

  return (
    <Router>
      <Navbar logo={<span>✍️ MyApp</span>} items={navItems} />
    
      <Routes>
        <Route path="/" element={<Navigate to="/draft" replace />} />
        <Route path="/draft" element={<Draft />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lookup" element={<GameLookup />} />
      </Routes>
    </Router>
  );
}

export default App;
