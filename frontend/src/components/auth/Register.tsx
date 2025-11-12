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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        
        <div className="flex flex-col items-center mb-6">
          <div className="p-4 bg-blue-600 rounded-full mb-3">
            <Wifi className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">ISP Manager</h1>
          <p className="text-gray-600">Crie sua conta de acesso</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Criar Conta</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nome Completo */}
            <div>
              <label htmlFor="nome_completo" className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Matrícula */}
            <div>
              <label htmlFor="matricula" className="block text-sm font-medium text-gray-700">Matrícula</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Login */}
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-700">Login</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="login"
                  name="login"
                  type="text"
                  required
                  value={formData.login}
                  onChange={handleChange}
                  placeholder="Seu login de acesso (ex: jorge.silva)"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha"
                className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative mt-1">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmarSenha"
                className="block text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <div className="relative mt-1">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Mensagem de Erro ou Sucesso */}
            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                    {success}
                </div>
            )}

            {/* Botão Cadastrar */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm 
                text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </div>
          </form>

          {/* Link Voltar */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <button
                onClick={onNavigateToLogin}
                className="font-medium text-blue-600 hover:underline"
              >
                Faça o login
              </button>
            </p>
          </div>
        </div>
        
        <p className="text-center text-xs text-gray-500 mt-8">
            © 2025 ISP Manager. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default Register;