import React, { useState } from 'react';
import { Wifi, User, Lock, Send } from 'lucide-react';
// Importa a função de login da API
import { loginUser } from '../../services/api';

interface LoginProps {
  onLogin: () => void;
  onNavigateToRegister: () => void;
  onNavigateToPublicTicket: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister, onNavigateToPublicTicket }) => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!login || !senha) {
      setError('Login e senha são obrigatórios.');
      setLoading(false);
      return;
    }
    try {
      await loginUser(login, senha);
      onLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="w-full max-w-md">

        <div className="flex flex-col items-center mb-6">
          <div className="p-4 bg-blue-600 rounded-full mb-3 shadow-lg shadow-blue-600/30">
            <Wifi className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">ISP Manager</h1>
          <p className="text-gray-600 dark:text-gray-400">Sistema de Gestão para Provedores</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-all">
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-1">Acesso do Administrador</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Use seu login e senha</p>

          <form onSubmit={handleLogin} className="space-y-6">

            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Login</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input id="login" name="login" type="text" autoComplete="username" required
                  value={login} onChange={(e) => setLogin(e.target.value)}
                  placeholder="Seu login de usuário"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Esqueceu sua senha?</a>
              </div>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input id="password" name="password" type="password" autoComplete="current-password" required
                  value={senha} onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-800">{error}</div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Lembrar de mim</label>
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20
                text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-all hover:scale-[1.02]"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          {/* Links de Navegação */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Não tem uma conta de admin?{' '}
              <button type="button" onClick={onNavigateToRegister}
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Cadastre-se
              </button>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              É cliente?{' '}
              <button
                type="button"
                onClick={onNavigateToPublicTicket}
                className="font-medium text-green-600 dark:text-green-400 hover:underline">
                Abrir um chamado de suporte
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;