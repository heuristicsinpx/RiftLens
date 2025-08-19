import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string; // optional
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="bg-gray-900 text-white shadow-md p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && (
        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
      )}
    </header>
  );
};

export default Header;
