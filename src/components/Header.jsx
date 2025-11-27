import React, { useEffect, useRef, useState } from 'react';

const Header = ({ onLogout, onShowProfile, onShowSettings }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

    const username = JSON.parse(localStorage.getItem("userData")).name

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleAvatarClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Análise de Equivalência Curricular
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              ref={buttonRef}
              id="user-menu-button"
              onClick={handleAvatarClick}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                <img
                  id="user-avatar"
                  src=""
                  alt="Avatar"
                  className="w-full h-full object-cover hidden"
                />
                <i
                  id="avatar-placeholder"
                  className="fas fa-user text-blue-600"
                ></i>
              </div>
              <span className="hidden md:inline-block font-medium">
                {username}
              </span>
              <i className="fas fa-chevron-down text-gray-500 text-xs"></i>
            </button>

            {/* User dropdown menu */}
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                id="user-dropdown"
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
              >
                <button
                  type="button"
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    onShowProfile();
                    setDropdownOpen(false);
                  }}
                >
                  <i className="fas fa-user-circle mr-2"></i> Meu Perfil
                </button>
                <button
                  type="button"
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    onShowSettings();
                    setDropdownOpen(false);
                  }}
                >
                  <i className="fas fa-cog mr-2"></i> Configurações
                </button>
                <button
                  type="button"
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    onLogout();
                    setDropdownOpen(false);
                  }}
                >
                  <i className="fas fa-sign-out-alt mr-2"></i> Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

