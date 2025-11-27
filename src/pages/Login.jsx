import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      
      // Salvar token e dados do usuário
      localStorage.setItem('authToken', response.token || response.access_token);
      localStorage.setItem('userData', JSON.stringify(response.user || response));
      localStorage.setItem('isAuthenticated', 'true')

      navigate('/main');
    } catch (err) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
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
          <h1 className="text-2xl font-bold text-white">
            Análise de Equivalência Curricular
          </h1>
          <p className="text-blue-100 mt-2">Acesse sua conta para continuar</p>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleLogin}>
          <div className="relative">
            <input
              type="email"
              id="login-email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <label
              htmlFor="login-email"
              className="floating-label left-3 text-gray-500 pointer-events-none"
            >
              E-mail institucional
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="login-password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <label
              htmlFor="login-password"
              className="floating-label left-3 text-gray-500 pointer-events-none"
            >
              Senha
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Lembrar-me
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                // Implementar funcionalidade de recuperação de senha
                console.log('Recuperar senha');
              }}
              className="text-sm text-blue-600 hover:text-blue-500 bg-transparent border-none cursor-pointer p-0"
            >
              Esqueceu sua senha?
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-bg text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <span>Entrar</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </>
            )}
          </button>

          <div className="text-center text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:text-blue-500">
              Cadastre-se
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
