import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
} from "lucide-react";
// Importa a função da API e o tipo
import { getSuporteTickets } from "../services/api";
import type { TicketSuporte } from "../types";
// --- IMPORTA OS MODAIS ---
import ModalAdicionarSuporte from './ModalAdicionarSuporte';
import ModalEditarSuporte from './ModalEditarSuporte';

const Support = () => {
  // --- Estados da API ---
  const [tickets, setTickets] = useState<TicketSuporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Estados de Filtro ---
  const [busca, definirBusca] = useState("");
  const [filtroStatus, definirtStatusFiltro] = useState("todos");
  const [filtroPrioridade, definirPrioridadeFiltro] = useState("todos");

  // --- Estados dos Modais ---
  const [isModalAdicionarAberto, setIsModalAdicionarAberto] = useState(false);
  const [isModalEditarAberto, setIsModalEditarAberto] = useState(false);
  const [ticketSelecionadoId, setTicketSelecionadoId] = useState<number | null>(null);


  // Hook para carregar os dados da API
  useEffect(() => {
    carregarTickets();
  }, []);

  const carregarTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSuporteTickets();
      setTickets(data);
    } catch (err: any) {
      setError(err.message || "Falha ao carregar chamados.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Funções de ajuda (cores, ícones) ---
  const pegarStatusIcone = (status: string) => {
    switch (status) {
      case "Aberto": return AlertCircle;
      case "Em andamento": return Clock;
      case "Resolvido": return CheckCircle;
      default: return MessageSquare;
    }
  };

  const pegarStatusCor = (status: string) => {
    switch (status) {
      case "Aberto": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Em andamento": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Resolvido": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const pegarPrioridadeCor = (prioridade: string) => {
    switch (prioridade) {
      case "Alta": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Média": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Baixa": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // --- Estatísticas (calculadas a partir dos dados da API) ---
  const estatisticas = [
    {
      rotulo: "Tickets Abertos",
      valor: tickets.filter((ticket) => ticket.status === "Aberto").length,
    },
    {
      rotulo: "Em Andamento",
      valor: tickets.filter((ticket) => ticket.status === "Em andamento").length,
    },
    {
      rotulo: "Resolvidos",
      valor: tickets.filter((ticket) => ticket.status === "Resolvido").length,
    },
    { rotulo: "Total", valor: tickets.length },
  ];

  // --- Filtragem (baseada nos dados da API) ---
  const ticketsFiltrados = tickets.filter((ticket) => {
    const buscaEncontrada =
      (ticket.titulo || '').toLowerCase().includes(busca.toLowerCase()) ||
      (ticket.cliente || '').toLowerCase().includes(busca.toLowerCase()) ||
      (ticket.telefone || '').includes(busca) ||
      (ticket.id.toString()).includes(busca);

    const statusIgual =
      filtroStatus === "todos" || ticket.status === filtroStatus;
    const prioridadeIgual =
      filtroPrioridade === "todos" || ticket.prioridade === filtroPrioridade;

    return buscaEncontrada && statusIgual && prioridadeIgual;
  });

  // --- Funções de Ação (Modais) ---
  const handleAbrirModalAdicionar = () => {
    setIsModalAdicionarAberto(true);
  };
  const handleFecharModalAdicionar = () => {
    setIsModalAdicionarAberto(false);
  };
  const handleSalvarAdicao = (novoTicket: TicketSuporte) => {
    setTickets(ticketsAtuais => [novoTicket, ...ticketsAtuais]);
    handleFecharModalAdicionar();
  };

  const handleAbrirModalEditar = (id: number) => {
    setTicketSelecionadoId(id);
    setIsModalEditarAberto(true);
  };
  const handleFecharModalEditar = () => {
    setIsModalEditarAberto(false);
    setTicketSelecionadoId(null);
  };
  const handleSalvarEdicao = (ticketAtualizado: TicketSuporte) => {
    setTickets(ticketsAtuais =>
      ticketsAtuais.map(t => (t.id === ticketAtualizado.id ? ticketAtualizado : t))
    );
    handleFecharModalEditar();
  };

  // O botão "Ver Detalhes" agora também abre o modal de edição
  const handleVerDetalhes = (id: number) => {
    handleAbrirModalEditar(id);
  };

  // --- Renderização ---
  if (loading) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Carregando chamados...</div>;
  }

  if (error && tickets.length === 0) {
    return <div className="p-6 text-center text-red-500 dark:text-red-400">{error}</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {error && tickets.length > 0 && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">{error}</div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Central de Suporte
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie todos os chamados e solicitações
          </p>
        </div>
        <button
          onClick={handleAbrirModalAdicionar} // <-- Conectado
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center 
          space-x-2 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Chamado</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {estatisticas.map((estatistica, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <p className="text-sm text-gray-600 dark:text-gray-400">{estatistica.rotulo}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{estatistica.valor}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por ID, título, cliente ou telefone..."
              value={busca}
              onChange={(elemento) => definirBusca(elemento.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 
              focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <select
              title="Filtrar por status"
              value={filtroStatus}
              onChange={(elemento) => definirtStatusFiltro(elemento.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              <option value="todos">Todos os Status</option>
              <option value="Aberto">Aberto</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Resolvido">Resolvido</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              title="Filtrar por prioridade"
              value={filtroPrioridade}
              onChange={(elemento) => definirPrioridadeFiltro(elemento.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              <option value="todos">Todas as Prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {ticketsFiltrados.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            Nenhum chamado encontrado{busca || filtroStatus !== 'todos' || filtroPrioridade !== 'todos' ? ' com os filtros aplicados' : ''}.
          </div>
        )}

        {ticketsFiltrados.map((ticket) => {
          const StatusIcon = pegarStatusIcone(ticket.status);
          return (
            <div key={ticket.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <StatusIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">#{ticket.id} - {ticket.titulo}</h3>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>Cliente: <strong>{ticket.cliente}</strong></span>
                      <span>Telefone: {ticket.telefone}</span>
                      <span>Plano: {ticket.plano}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${pegarPrioridadeCor(ticket.prioridade)}`}>
                    {ticket.prioridade}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${pegarStatusCor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">{ticket.descricao}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Categoria:</span>
                  <p className="text-gray-900 dark:text-white">{ticket.categoria}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Início Desejado (Criado):</span>
                  <p className="text-gray-900 dark:text-white">{ticket.criado}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Conclusão Desejada (Atualizado): {ticket.atualizado}
                </span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleVerDetalhes(ticket.id)} // <-- Conectado
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg transition-colors">
                    Ver Detalhes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAbrirModalEditar(ticket.id)} // <-- Conectado
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-sm rounded-lg transition-colors">
                    Atualizar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Renderização dos Modais --- */}
      {isModalAdicionarAberto && (
        <ModalAdicionarSuporte
          onClose={handleFecharModalAdicionar}
          onSave={handleSalvarAdicao}
        />
      )}
      {isModalEditarAberto && ticketSelecionadoId && (
        <ModalEditarSuporte
          ticketId={ticketSelecionadoId}
          onClose={handleFecharModalEditar}
          onSave={handleSalvarEdicao}
        />
      )}

    </div>
  );
};

export default Support;