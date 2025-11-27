import React, { useEffect, useState } from "react";
import { profileService } from "../services/api";

const ProfileModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    try {
      // Tentar carregar do backend
      try {
        const profile = await profileService.getProfile();
        setFormData({
          name: profile.user.name || "",
          email: profile.user.email || "",
        });
        setAvatar("https://cdn-icons-png.flaticon.com/512/1/1247.png");
      } catch (backendError) {
        console.warn(
          "Erro ao carregar do backend, usando localStorage:",
          backendError,
        );
        const savedName =
          localStorage.getItem("userName") || "Funcionário Senac";
        const savedEmail = localStorage.getItem("userEmail") || "";

        setFormData({
          name: savedName,
          email: savedEmail,
        });
      }
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setError("As senhas não coincidem!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar dados para enviar
      const profileData = {
        name: formData.name,
        email: formData.email,
      };

      // Adicionar senha se fornecida
      if (formData.newPassword) {
        profileData.password = formData.newPassword;
      }

      // Atualizar no backend
      await profileService.updateProfile(profileData);

      // Atualizar localStorage como fallback
      localStorage.setItem("userName", formData.name);
      localStorage.setItem("userEmail", formData.email);

      onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || "Erro ao salvar perfil");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">
            Configurações do Perfil
          </h3>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mx-auto">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="fas fa-user text-gray-400 text-4xl w-full h-full flex items-center justify-center"></i>
                )}
              </div>
            </div>
            <h4 className="text-lg font-medium text-gray-900">
              {formData.name}
            </h4>
            <p className="text-sm text-gray-500">Analista de Currículo</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={formData.email}
                disabled="true"
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-red-400 rounded-md hover:bg-red-700 mr-2"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
