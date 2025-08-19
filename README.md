# RiftLens

RiftLens is a desktop companion app for **League of Legends** built with **React, TypeScript, Tailwind CSS, and Tauri (Rust)**.  
It provides actionable insights into player performance, champion matchups, and improvement tips to help players climb the ladder.

---

## 🚀 Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend / App Shell**: Tauri (Rust)
- **Language**: TypeScript & Rust
- **Package Manager**: npm

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
git clone https://github.com/heuristicsinpx/RiftLens
cd RiftLens

### 2. Install Dependencies
npm install

### 3. Setup Tailwind CSS
(Tailwind is already configured in this repo — nothing extra needed!)

### 4. Run the App in Development
npm run tauri dev

This will launch the React UI inside a native Tauri desktop window.

---

## 🔑 Riot API Key Setup

To access live League of Legends data, you’ll need a Riot Games API Key.

### 1. Go to the Riot Developer Portal
### 2. Log in with your Riot account.
### 3. Generate a development API key (⚠️ note: dev keys expire every 24 hours).
### 4. Create a .env file in the root directory and add your key:
VITE_RIOT_API_KEY=your-api-key-here

### 5. Restart the dev server:
npm run tauri dev

👉 In code, always access it via:

const apiKey = import.meta.env.VITE_RIOT_API_KEY;


** ⚠️ Never commit your .env file — it’s already ignored in .gitignore.**

---

## 🏗️ Build for Production
npm run tauri build

This creates a desktop app binary under src-tauri/target/release.

## 📂 Project Structure
RiftLens/
│── src/              # React frontend (TypeScript + Tailwind)
│── src-tauri/        # Tauri backend (Rust)
│── public/           # Static assets
│── package.json      # Frontend dependencies
│── Cargo.toml        # Rust dependencies
│── tailwind.config.js
│── postcss.config.js
│── README.md


## 🤝 Contributing
1. Fork the repo

2. Create a new branch: git checkout -b feature/my-feature

3. Commit your changes: git commit -m "Add my feature"

4. Push to your fork: git push origin feature/my-feature

5. Open a Pull Request

## 🧑‍💻 Maintainers
- @heuristicsinpx (Pooja) – UX Design & Development

- @fufuqt30 (Steve) - Backend Development