import React from 'react';

const Sidebar = ({ activeSection, onSectionChange, onLogout }) => {
  const menuItems = [
    {
      id: 'documentAnalysis',
      icon: 'fa-file-alt',
      label: 'Análise de Documentos',
    },
    {
      id: 'history',
      icon: 'fa-history',
      label: 'Histórico de Análises',
    },
  ];
  
  const username = JSON.parse(localStorage.getItem("userData")).name


  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-10">
      <div className="flex items-center justify-center h-16 px-4 gradient-bg">
        <img
          src="https://www.senac.br/images/senac_logo_branco.png"
          alt="Senac Logo"
          className="h-10"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg relative group">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
            <img
              id="sidebar-avatar"
              src=""
              alt="Avatar"
              className="w-full h-full object-cover hidden"
            />
            <i
              id="sidebar-avatar-placeholder"
              className="fas fa-user text-blue-600"
            ></i>
          </div>
          <div>
            <p className="font-medium text-gray-900">{username}</p>
            <p className="text-xs text-gray-500">Analista de Currículo</p>
          </div>
        </div>
      </div>

      <nav className="mt-2 px-2 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`sidebar-item w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeSection === item.id
                ? 'active text-gray-900'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <i
              className={`fas ${item.icon} w-5 mr-3 ${
                activeSection === item.id ? 'text-blue-600' : 'text-gray-500'
              }`}
            ></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <i className="fas fa-sign-out-alt mr-2 text-gray-500"></i>
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

