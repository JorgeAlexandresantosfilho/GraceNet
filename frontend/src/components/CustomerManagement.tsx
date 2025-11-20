import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, Filter, User, Phone, Mail, Calendar, CheckCircle, XCircle } from "lucide-react";
import { getClientes, deleteCliente } from '../services/api';
import type { Cliente } from "../types";
import ModalEditarCliente from './ModalEditarCliente';
import ModalAdicionarCliente from './ModalAdicionarCliente';

interface CustomerManagementProps {
  onSelecionarCliente: (id: number) => void;
}

const CustumerManagement: React.FC<CustomerManagementProps> = ({
  onSelecionarCliente,
}) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busca, definirBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const [isModalEditarAberto, setIsModalEditarAberto] = useState(false);
  const [isModalAdicionarAberto, setIsModalAdicionarAberto] = useState(false);
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState<number | null>(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const data = await getClientes();
      setClientes(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Falha ao carregar os clientes.");
    } finally {
      setLoading(false);
    }
  };

  const clientesFiltrados = clientes.filter((cliente) => {
    const nome = cliente.nomeCompleto || '';
    const email = cliente.email || '';
    const telefone = cliente.telefone || '';

    const buscaEncontrada =
      nome.toLowerCase().includes(busca.toLowerCase()) ||
      email.toLowerCase().includes(busca.toLowerCase()) ||
      telefone.includes(busca);

    const status = cliente.status || '';
    const statusFormatado = status.charAt(0).toUpperCase() + status.slice(1);
    const buscaStatus = filtro === "todos" || statusFormatado === filtro;

    return buscaEncontrada && buscaStatus;
  });

  const handleExcluirCliente = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja INATIVAR este cliente?")) {
      return;
    }
    try {
      await deleteCliente(id);
      setClientes(clientesAtuais =>
        clientesAtuais.map(c =>
          c.id === id ? { ...c, status: 'Inativo' } : c
        )
      );
    } catch (error: any) {
      alert(error.message || "Erro ao inativar o cliente. Tente novamente.");
      console.error(error);
    }
  };

  const handleAbrirModalEditar = (id: number) => {
    setClienteSelecionadoId(id);
    setIsModalEditarAberto(true);
  };

  const handleFecharModalEditar = () => {
    setIsModalEditarAberto(false);
    setClienteSelecionadoId(null);
  };

  const handleSalvarEdicao = (clienteAtualizado: Partial<Cliente>) => {
    setClientes(clientesAtuais =>
      clientesAtuais.map(c =>
        c.id === clienteSelecionadoId ? { ...c, ...clienteAtualizado } : c
      )
    );
    handleFecharModalEditar();
  };

  const handleAbrirModalAdicionar = () => {
    setIsModalAdicionarAberto(true);
  };

  const handleFecharModalAdicionar = () => {
    setIsModalAdicionarAberto(false);
  };

  const handleSalvarAdicao = (novoCliente: Cliente) => {
    setClientes(clientesAtuais => [novoCliente, ...clientesAtuais]);
    handleFecharModalAdicionar();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Gestão de Clientes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gerencie sua base de assinantes.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAbrirModalAdicionar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {/* Barra de Busca e Filtro */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou telefone..."
              value={busca}
              onChange={(elemento) => definirBusca(elemento.target.value)}
              className="pl-10 pr-4 py-2.5 w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <select
              title="filtro"
              value={filtro}
              onChange={(elemento) => setFiltro(elemento.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
            >
              <option value="todos" className="dark:bg-gray-800">Todos os Status</option>
              <option value="Ativo" className="dark:bg-gray-800">Ativo</option>
              <option value="Inativo" className="dark:bg-gray-800">Inativo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plano</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {cliente.nomeCompleto.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {cliente.nomeCompleto}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            CPF: {cliente.cpf}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                          {cliente.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                          {cliente.telefone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                        {cliente.plano}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cliente.status === 'Ativo'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800'
                        }`}>
                        {cliente.status === 'Ativo' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {cliente.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                        Dia {cliente.vencimento}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onSelecionarCliente(cliente.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Ver Detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAbrirModalEditar(cliente.id)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleExcluirCliente(cliente.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalEditarAberto && clienteSelecionadoId && (
        <ModalEditarCliente
          clienteId={clienteSelecionadoId}
          onClose={handleFecharModalEditar}
          onSave={handleSalvarEdicao}
        />
      )}

      {isModalAdicionarAberto && (
        <ModalAdicionarCliente
          onClose={handleFecharModalAdicionar}
          onSave={handleSalvarAdicao}
        />
      )}
    </div>
  );
};

export default CustumerManagement;