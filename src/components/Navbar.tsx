import React from "react";
import { NavLink } from "react-router-dom";

type NavItem = {
  label: string;
  path: string;
};

type NavbarProps = {
  logo?: React.ReactNode;
  items: NavItem[];
};

const Navbar: React.FC<NavbarProps> = ({ logo, items }) => {
  return (
    <nav className="w-full bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="text-xl font-bold">
          {logo || <NavLink to="/draft">MyApp</NavLink>}
        </div>

        {/* Navigation Links */}
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
      </div>
    </nav>
  );
};

export default Navbar;
