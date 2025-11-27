import React, { useEffect, useState } from 'react';

const SettingsModal = ({ isOpen, onClose, onSave }) => {
  const [settings, setSettings] = useState({
    language: 'pt',
    ttsEnabled: false,
  });

  useEffect(() => {
    if (isOpen) {
      // Carregar configurações do localStorage
      const savedLanguage = localStorage.getItem('language') || 'pt';
      const savedTTS = localStorage.getItem('ttsEnabled') === 'true';
      
      setSettings({
        language: savedLanguage,
        ttsEnabled: savedTTS,
      });
    }
  }, [isOpen]);

  const handleSettingChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('language', settings.language);
    localStorage.setItem('ttsEnabled', settings.ttsEnabled.toString());
    onSave(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Configurações do Sistema</h3>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Leitura de Mensagens
              </label>
              <button
                type="button"
                onClick={() => handleSettingChange('ttsEnabled', !settings.ttsEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.ttsEnabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className="sr-only">Ativar leitura de mensagens</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.ttsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 mr-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

