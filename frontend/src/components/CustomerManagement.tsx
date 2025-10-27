import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, Filter } from "lucide-react";
// Importa TODAS as funções da API
import { getClientes, deleteCliente, createCliente, updateCliente, getClienteById } from '../services/api'; // Adiciona updateCliente e getClienteById
import type { Cliente } from "../types";

// Importa os DOIS modais
// <<< --- CORREÇÃO AQUI --- >>> Importa ModalEditarCliente com chaves {}
import { ModalEditarCliente } from './ModalEditarCliente';
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

  // --- ESTADOS PARA CONTROLAR OS MODAIS ---
  const [isModalEditarAberto, setIsModalEditarAberto] = useState(false);
  const [isModalAdicionarAberto, setIsModalAdicionarAberto] = useState(false);
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState<number | null>(null);

  // Hook para buscar os dados quando o componente carregar
  useEffect(() => {
    carregarClientes();
  }, []); // O array vazio [] faz com que isso execute apenas uma vez

  const carregarClientes = async () => {
    try {
      setLoading(true);
      setError(null); // Limpa erro anterior
      const data = await getClientes();
      setClientes(data);
    } catch (err: any) { // Captura como any para ler a mensagem
      setError(err.message || "Falha ao carregar os clientes.");
      console.error("Erro ao carregar clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  const clientesFiltrados = clientes.filter((cliente) => {
    // Adiciona checagens para evitar erros se campos forem null/undefined
    const nome = cliente.nomeCompleto || '';
    const email = cliente.email || '';
    const telefone = cliente.telefone || '';

    const buscaEncontrada =
      nome.toLowerCase().includes(busca.toLowerCase()) ||
      email.toLowerCase().includes(busca.toLowerCase()) ||
      telefone.includes(busca);

    // Garante que status não seja null/undefined antes de acessar charAt
    const status = cliente.status || '';
    const statusFormatado = status.charAt(0).toUpperCase() + status.slice(1);

    const buscaStatus = filtro === "todos" || statusFormatado === filtro;
    return buscaEncontrada && buscaStatus;
  });

  // --- FUNÇÕES DE CONTROLE ---
  const handleExcluirCliente = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja INATIVAR este cliente?")) {
      return;
    }
    try {
      await deleteCliente(id); // Isso faz o "Soft Delete" (UPDATE status = 0)
      setClientes(clientesAtuais =>
        clientesAtuais.map(c =>
          c.id === id ? { ...c, status: 'Inativo' } : c
        )
      );
    } catch (error: any) { // Captura como any
      alert(error.message || "Erro ao inativar o cliente. Tente novamente.");
      console.error("Erro ao inativar cliente:", error);
    }
  };

  // --- FUNÇÕES DO MODAL DE EDITAR ---
  const handleAbrirModalEditar = (id: number) => {
    setClienteSelecionadoId(id);
    setIsModalEditarAberto(true);
  };

  const handleFecharModalEditar = () => {
    setIsModalEditarAberto(false);
    setClienteSelecionadoId(null);
  };

  // Callback quando o ModalEditar salva
  const handleSalvarEdicao = (clienteAtualizadoLocal: Partial<Cliente>) => {
    setClientes(clientesAtuais =>
      clientesAtuais.map(c =>
        // Atualiza apenas os campos que vieram do modal (Partial<Cliente>)
        c.id === clienteSelecionadoId ? { ...c, ...clienteAtualizadoLocal } : c
      )
    );
    handleFecharModalEditar();
  };

  // --- FUNÇÕES DO MODAL DE ADICIONAR ---
  const handleAbrirModalAdicionar = () => {
    setIsModalAdicionarAberto(true);
  };

  const handleFecharModalAdicionar = () => {
    setIsModalAdicionarAberto(false);
  };

  // Callback quando o ModalAdicionar salva
  const handleSalvarAdicao = (novoCliente: Cliente) => {
    setClientes(clientesAtuais => [novoCliente, ...clientesAtuais]);
    handleFecharModalAdicionar();
  };

  // --- RESTO DO COMPONENTE ---
  const statusCor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800";
      case "Inativo":
        return "bg-red-100 text-red-800";
      default: // Inclui 'Pendente' ou qualquer outro
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Carregando clientes...</div>;
  }

  // Mostra erro apenas se a lista estiver vazia
  if (error && clientes.length === 0) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
       {/* Mostra erro no topo mesmo se a lista carregar parcialmente */}
       {error && clientes.length > 0 && (
         <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>
       )}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestão de Clientes
          </h1>
          <p className="text-gray-600 mt-1">Gerencie todos os clientes</p>
        </div>
        <button
          type="button"
          onClick={handleAbrirModalAdicionar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center
          space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou telefone"
              value={busca}
              onChange={(elemento) => definirBusca(elemento.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2
              focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              title="filtro"
              value={filtro}
              onChange={(elemento) => setFiltro(elemento.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos os Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              {/* Removido Pendente */}
            </select>
          </div>
        </div>
      </div>

       {/* Mensagem se não houver clientes */}
       {clientes.length === 0 && !loading && (
           <div className="text-center text-gray-500 py-10">Nenhum cliente encontrado.</div>
       )}

      {/* Tabela só renderiza se houver clientes */}
      {clientes.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plano
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientesFiltrados.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {cliente.nomeCompleto || '-'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cliente.email || '-'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cliente.telefone || '-'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cliente.plano || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${statusCor(
                            cliente.status || ''
                          )}`}
                        >
                          {cliente.status || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cliente.vencimento || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            title="Visualizar Detalhes"
                            type="button"
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                            onClick={() => onSelecionarCliente(cliente.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            title="Editar Cliente"
                            type="button"
                            className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                            onClick={() => handleAbrirModalEditar(cliente.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            title="Inativar Cliente"
                            type="button"
                             // Desabilita se já estiver inativo
                            disabled={cliente.status === 'Inativo'}
                            className={`p-1 rounded transition-colors ${
                               cliente.status === 'Inativo'
                               ? 'text-gray-400 cursor-not-allowed'
                               : 'text-red-600 hover:text-red-900 hover:bg-red-50' // Correção no hover
                            }`}
                            onClick={() => handleExcluirCliente(cliente.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      )}

      {/* --- RENDERIZA OS MODAIS SE ELES ESTIVEREM ABERTOS --- */}
      {isModalEditarAberto && clienteSelecionadoId && (
        <ModalEditarCliente
          clienteId={clienteSelecionadoId}
          onClose={handleFecharModalEditar}
          onSave={handleSalvarEdicao} // Passa a função correta
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