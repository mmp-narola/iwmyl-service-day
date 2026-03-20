import React from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="header-gradient fixed top-0 left-0 w-full z-50">
      <div className="mx-auto px-4">
        <div className="mb-[1.5rem]">
          <div className="mx-auto">
            <div className="flex items-center justify-between ">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <Link to="/" className="transition-transform hover:scale-105">
                  <img
                    src={logo}
                    alt="Volunteer Connect"
                    className="h-auto max-w-100"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
