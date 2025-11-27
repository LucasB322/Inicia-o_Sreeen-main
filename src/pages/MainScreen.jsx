import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DocumentAnalysis from '../components/DocumentAnalysis';
import Header from '../components/Header';
import History from '../components/History';
import ProfileModal from '../components/ProfileModal';
import SettingsModal from '../components/SettingsModal';
import Sidebar from '../components/Sidebar';
import apiServices from '../services/api';

const MainScreen = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('documentAnalysis');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);


  const handleLogout = () => {
    apiServices.authService.logout();
    navigate('/login');
  };

  const handleShowProfile = () => {
    setShowProfileModal(true);
  };

  const handleShowSettings = () => {
    setShowSettingsModal(true);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleProfileSave = async (profileData) => {
    console.log('Perfil salvo:', profileData);
    // Atualizar dados no localStorage
    if (profileData.name) {
      localStorage.setItem('userName', profileData.name);
    }
    if (profileData.email) {
      localStorage.setItem('userEmail', profileData.email);
    }
    // Recarregar para atualizar avatar e dados do usuário
    window.location.reload();
  };

  const handleSettingsSave = (settings) => {
    console.log('Configurações salvas:', settings);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onLogout={handleLogout}
      />
      <div className="ml-64 flex flex-col min-h-screen">
        <Header
          onLogout={handleLogout}
          onShowProfile={handleShowProfile}
          onShowSettings={handleShowSettings}
        />
        <main className="flex-1 p-6 bg-gray-50">
          {activeSection === 'documentAnalysis' && <DocumentAnalysis />}
          {activeSection === 'history' && <History />}
        </main>
      </div>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSave={handleProfileSave}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onSave={handleSettingsSave}
      />
    </div>
  );
};

export default MainScreen;

