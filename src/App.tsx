import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

const Draft = () => <h1 className="p-6">Draft</h1>;
const Profile = () => <h1 className="p-6">Profile</h1>;

function App() {
  const navItems = [
    { label: "Draft", path: "/draft" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <Router>
      <Navbar logo={<span>✍️ MyApp</span>} items={navItems} />

      <Routes>
        {/* Redirect / to /draft */}
        <Route path="/" element={<Navigate to="/draft" replace />} />

        <Route path="/draft" element={<Draft />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
