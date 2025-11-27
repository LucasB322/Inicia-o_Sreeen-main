import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegisterInputChange = (field, value) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (registerData.password !== registerData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (registerData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: `${registerData.firstName} ${registerData.lastName}`,
        email: registerData.email,
        password: registerData.password,
      };

      const response = await authService.register(userData);

      // Salvar token e dados do usuário
      localStorage.setItem(
        "authToken",
        response.token || response.access_token,
      );
      localStorage.setItem(
        "userData",
        JSON.stringify(response.user || response),
      );
      navigate("/main");
    } catch (err) {
      setError(err.error || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300">
        <div className="gradient-bg p-6 text-center">
          <img
            src="https://www.senac.br/images/senac_logo_branco.png"
            alt="Senac Logo"
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white">Criar nova conta</h1>
          <p className="text-blue-100 mt-2">
            Preencha seus dados para se registrar
          </p>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                id="register-first-name"
                placeholder=" "
                value={registerData.firstName}
                onChange={(e) =>
                  handleRegisterInputChange("firstName", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <label
                htmlFor="register-first-name"
                className="floating-label left-3 text-gray-500 pointer-events-none"
              >
                Nome
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                id="register-last-name"
                placeholder=" "
                value={registerData.lastName}
                onChange={(e) =>
                  handleRegisterInputChange("lastName", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <label
                htmlFor="register-last-name"
                className="floating-label left-3 text-gray-500 pointer-events-none"
              >
                Sobrenome
              </label>
            </div>
          </div>

          <div className="relative">
            <input
              type="email"
              id="register-email"
              placeholder=" "
              value={registerData.email}
              onChange={(e) =>
                handleRegisterInputChange("email", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <label
              htmlFor="register-email"
              className="floating-label left-3 text-gray-500 pointer-events-none"
            >
              E-mail institucional
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="register-password"
              placeholder=" "
              value={registerData.password}
              onChange={(e) =>
                handleRegisterInputChange("password", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <label
              htmlFor="register-password"
              className="floating-label left-3 text-gray-500 pointer-events-none"
            >
              Senha
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="register-confirm-password"
              placeholder=" "
              value={registerData.confirmPassword}
              onChange={(e) =>
                handleRegisterInputChange("confirmPassword", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <label
              htmlFor="register-confirm-password"
              className="floating-label left-3 text-gray-500 pointer-events-none"
            >
              Confirmar senha
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              Concordo com os{" "}
              <button
                type="button"
                onClick={() => {
                  // Implementar modal ou página de termos
                  console.log("Ver termos de serviço");
                }}
                className="text-blue-600 hover:text-blue-500 bg-transparent border-none cursor-pointer p-0 underline"
              >
                Termos de Serviço
              </button>{" "}
              e{" "}
              <button
                type="button"
                onClick={() => {
                  // Implementar modal ou página de política
                  console.log("Ver política de privacidade");
                }}
                className="text-blue-600 hover:text-blue-500 bg-transparent border-none cursor-pointer p-0 underline"
              >
                Política de Privacidade
              </button>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-bg text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                <span>Registrando...</span>
              </>
            ) : (
              <>
                <span>Registrar</span>
                <i className="fas fa-user-plus ml-2"></i>
              </>
            )}
          </button>

          <div className="text-center text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:text-blue-500"
            >
              Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
