import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Hash } from 'lucide-react';
// Importa a função de 'register' e a nova 'getPerfisAcesso'
import { registerUser, getPerfisAcesso } from '../services/api';
import type { PerfilAcesso } from '../types'; // Importa o novo tipo

interface ModalAdicionarUsuarioProps {
  onClose: () => void;
  onSave: () => void;
}

const ModalAdicionarUsuario: React.FC<ModalAdicionarUsuarioProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome_completo: '',
    matricula: '',
    login: '',
    senha: '',
    confirmarSenha: '',
    perfil_id: 0, // Inicia com 0
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [perfis, setPerfis] = useState<PerfilAcesso[]>([]);
  const [loadingPerfis, setLoadingPerfis] = useState(true);

  // Busca os perfis de acesso da API
  useEffect(() => {
    const carregarPerfis = async () => {
      try {
        setLoadingPerfis(true);
        const data = await getPerfisAcesso();
        setPerfis(data);
      } catch (err: any) {
        setError(err.message || "Falha ao carregar perfis.");
      } finally {
        setLoadingPerfis(false);
      }
    };
    carregarPerfis();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // Converte perfil_id para número
      [name]: name === 'perfil_id' ? (value ? parseInt(value) : 0) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { nome_completo, matricula, login, senha, confirmarSenha, perfil_id } = formData;

    if (!nome_completo || !matricula || !login || !senha) {
      setError('Campos (Nome, Matrícula, Login, Senha) são obrigatórios.');
      setLoading(false);
      return;
    }
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }
    if (!perfil_id || perfil_id === 0) {
      setError('Você precisa selecionar um Perfil.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        nome_completo,
        matricula,
        login,
        senha,
        perfil_id // Agora envia o ID selecionado
      };

      const response = await registerUser(payload);
      setSuccess(response.msg);

      setTimeout(() => {
        onSave();
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Erro desconhecido ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto border border-gray-200 dark:border-gray-700 transition-all">

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Criar Novo Usuário</h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label htmlFor="nome_completo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
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
                placeholder="Nome completo do técnico"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matrícula</label>
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
                  placeholder="Ex: 123456"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="perfil_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Perfil*</label>
              <select
                name="perfil_id"
                value={formData.perfil_id}
                onChange={handleChange}
                required
                disabled={loadingPerfis}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value={0} disabled>
                  {loadingPerfis ? 'Carregando...' : 'Selecione...'}
                </option>
                {perfis.map(perfil => (
                  <option key={perfil.perfil_id} value={perfil.perfil_id}>
                    {perfil.nome_perfil}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="login" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Login</label>
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
                placeholder="Login de acesso (ex: jorge.silva)"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="senha"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirmarSenha"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm border border-green-200 dark:border-green-800">
              {success}
            </div>
          )}

          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <button
              type="submit"
              disabled={loading || loadingPerfis}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-blue-600/20 
              text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none 
              focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              disabled:bg-blue-400 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
            >
              {loading ? 'Criando...' : 'Criar Usuário'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="mt-3 w-full flex justify-center py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 
              border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAdicionarUsuario;