import { useState, useEffect } from 'react';
import { User, Edit, Trash2, UserCheck, UserX, Search } from 'lucide-react';
// Importa as novas funções da API e o tipo
import { getAllUsersForAdmin, deleteUser } from '../services/api';
import type { Usuario } from '../types';
// Importa os modais de Edição e Adição
import ModalEditarUsuario from './ModalEditarUsuario';
import ModalAdicionarUsuario from './ModalAdicionarUsuario';

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  // Estados para os modais
  const [isModalEditarAberto, setIsModalEditarAberto] = useState(false);
  const [isModalAdicionarAberto, setIsModalAdicionarAberto] = useState(false);
  const [usuarioSelecionadoId, setUsuarioSelecionadoId] = useState<number | null>(null);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsersForAdmin();
      setUsuarios(data);
    } catch (err: any) {
      setError(err.message || "Falha ao carregar usuários.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Funções de Ação
  const handleInativarUsuario = async (id: number) => {
    if (window.confirm("Tem certeza que deseja INATIVAR este usuário? Ele não poderá mais acessar o sistema.")) {
      try {
        await deleteUser(id);
        // Atualiza a lista na tela
        setUsuarios(usuariosAtuais =>
          usuariosAtuais.map(u =>
            u.usuario_id === id ? { ...u, status_usuario: 'Inativo' } : u
          )
        );
      } catch (err: any) {
        alert(err.message || "Erro ao inativar o usuário.");
        console.error(err);
      }
    }
  };

  // --- Funções do Modal de Edição ---
  const handleAbrirModalEditar = (id: number) => {
    setUsuarioSelecionadoId(id);
    setIsModalEditarAberto(true);
  };
  const handleFecharModalEditar = () => {
    setIsModalEditarAberto(false);
    setUsuarioSelecionadoId(null);
  };
  const handleSalvarEdicao = (usuarioAtualizado: Usuario) => {
    setUsuarios(usuariosAtuais =>
      usuariosAtuais.map(u => (u.usuario_id === usuarioAtualizado.usuario_id ? usuarioAtualizado : u))
    );
    handleFecharModalEditar();
  };

  // --- Funções do Modal de Adicionar ---
  const handleAbrirModalAdicionar = () => {
    setIsModalAdicionarAberto(true);
  };
  const handleFecharModalAdicionar = () => {
    setIsModalAdicionarAberto(false);
  };
  const handleSalvarAdicao = () => {
    // Apenas fecha o modal e recarrega a lista
    handleFecharModalAdicionar();
    carregarUsuarios(); // Recarrega a lista inteira para ver o novo usuário
  };

  // Funções de UI
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Inativo': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Bloqueado': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativo': return <UserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'Inativo': return <UserX className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'Bloqueado': return <UserX className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      default: return <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
  }

  // Filtragem
  const usuariosFiltrados = usuarios.filter((user) => {
    const buscaLower = busca.toLowerCase();
    return (
      user.nome_completo.toLowerCase().includes(buscaLower) ||
      user.matricula.toLowerCase().includes(buscaLower) ||
      user.login.toLowerCase().includes(buscaLower)
    );
  });

  // Renderização
  if (loading) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Carregando usuários...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-500 dark:text-red-400">{error}</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestão de Usuários</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie os técnicos e administradores</p>
        </div>

        <button
          type="button"
          onClick={handleAbrirModalAdicionar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-lg shadow-blue-600/20"
        >
          <User className="w-4 h-4" />
          <span>Novo Usuário</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, matrícula ou login..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 
            focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Matrícula</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Perfil</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {usuariosFiltrados.map((user) => (
                <tr key={user.usuario_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user.nome_completo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{user.matricula}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{user.login}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {user.perfil_id ? `ID ${user.perfil_id}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status_usuario)}`}>
                      {user.status_usuario}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        title="Editar"
                        type="button"
                        onClick={() => handleAbrirModalEditar(user.usuario_id)}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        title="Inativar"
                        type="button"
                        disabled={user.status_usuario === 'Inativo'}
                        onClick={() => handleInativarUsuario(user.usuario_id)}
                        className={`p-1 rounded transition-colors ${user.status_usuario === 'Inativo'
                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20'
                          }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renderiza o modal de edição */}
      {isModalEditarAberto && usuarioSelecionadoId && (
        <ModalEditarUsuario
          usuarioId={usuarioSelecionadoId}
          onClose={handleFecharModalEditar}
          onSave={handleSalvarEdicao}
        />
      )}

      {/* Renderiza o modal de adição */}
      {isModalAdicionarAberto && (
        <ModalAdicionarUsuario
          onClose={handleFecharModalAdicionar}
          onSave={handleSalvarAdicao}
        />
      )}
    </div>
  );
};

export default UserManagement;