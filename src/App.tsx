import "./App.css";

import Header from "./components/Header";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        title="RiftLens" 
        subtitle="Your AI League Companion"
      />
      <main className="p-6">
        <p className="text-gray-800">
          🚀 Welcome to RiftLens. This will be your performance dashboard.
        </p>
      </main>
    </div>
  );
}

export default App;