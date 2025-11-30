import React, { useState } from 'react';
import { Wifi, User, Lock, Mail, Hash } from 'lucide-react';
import { registerUser } from '../../services/api'; // Importa a nova função

interface RegisterProps {
  onNavigateToLogin: () => void; // Função para voltar ao login
}

const Register: React.FC<RegisterProps> = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    nome_completo: '',
    matricula: '',
    login: '',
    senha: '',
    confirmarSenha: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { nome_completo, matricula, login, senha, confirmarSenha } = formData;

    // Validação do frontend
    if (!nome_completo || !matricula || !login || !senha) {
      setError('Todos os campos são obrigatórios.');
      setLoading(false);
      return;
    }
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      // Chama a API de registro (só envia o necessário)
      const payload = { nome_completo, matricula, login, senha };
      const response = await registerUser(payload);

      setSuccess(response.msg + " Você já pode fazer o login."); // Mostra sucesso

      // Limpa o formulário e volta para o login após 2 segundos
      setTimeout(() => {
        onNavigateToLogin();
      }, 2000);

    } catch (err: any) {
      // Mostra o erro da API (ex: "Matrícula já cadastrada")
      setError(err.message || 'Erro desconhecido ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-lg">

        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <Wifi className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">ISP Manager</h1>
          <p className="text-lg text-gray-600 mt-2 font-medium">Crie sua conta de acesso</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 tracking-tight">Criar Conta</h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Nome Completo */}
            <div>
              <label htmlFor="nome_completo" className="block text-base font-bold text-gray-700 mb-1">Nome Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="nome_completo"
                  name="nome_completo"
                  type="text"
                  required
                  value={formData.nome_completo}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="pl-11 pr-4 py-3.5 w-full border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder-gray-400"
                />
              </div>
            </div>

            {/* Matrícula */}
            <div>
              <label htmlFor="matricula" className="block text-base font-bold text-gray-700 mb-1">Matrícula</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Hash className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="matricula"
                  name="matricula"
                  type="text"
                  required
                  value={formData.matricula}
                  onChange={handleChange}
                  placeholder="Sua matrícula (ex: 123456)"
                  className="pl-11 pr-4 py-3.5 w-full border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder-gray-400"
                />
              </div>
            </div>

            {/* Login */}
            <div>
              <label htmlFor="login" className="block text-base font-bold text-gray-700 mb-1">Login</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="login"
                  name="login"
                  type="text"
                  required
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="Seu login de acesso"
                  className="pl-11 pr-4 py-3.5 w-full border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder-gray-400"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="block text-base font-bold text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  required
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-11 pr-4 py-3.5 w-full border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder-gray-400"
                />
              </div>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmarSenha" className="block text-base font-bold text-gray-700 mb-1">Confirmar Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  required
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-11 pr-4 py-3.5 w-full border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder-gray-400"
                />
              </div>
            </div>

            {/* Mensagem de Erro ou Sucesso */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg text-sm font-medium">
                {success}
              </div>
            )}

            {/* Botão Cadastrar */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30
                text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none 
                focus:ring-4 focus:ring-blue-500/50 transition-all transform hover:-translate-y-0.5
                disabled:bg-blue-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </button>
            </div>
          </form>

          {/* Link Voltar */}
          <div className="text-center mt-8">
            <p className="text-base text-gray-600">
              Já tem uma conta?{' '}
              <button
                onClick={onNavigateToLogin}
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Faça o login
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-sm font-medium text-gray-500 mt-8">
          © 2025 ISP Manager. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default Register;