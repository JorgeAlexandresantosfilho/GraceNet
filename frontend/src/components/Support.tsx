import { useState } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
} from "lucide-react";
import { ticketsSuporte } from "../data/support";

const Support = () => {
  const [busca, definirBusca] = useState("");
  const [filtroStatus, definirtStatusFiltro] = useState("todos");
  const [filtroPrioridade, definirPrioridadeFiltro] = useState("todos");

  const estatisticas = [
    {
      rotulo: "Tickets Abertos",
      valor: ticketsSuporte.filter((ticket) => ticket.status === "Aberto").length,
    },
    {
      rotulo: "Em Andamento",
      valor: ticketsSuporte.filter((ticket) => ticket.status === "Em andamento").length,
    },
    {
      rotulo: "Resolvidos",
      valor: ticketsSuporte.filter((ticket) => ticket.status === "Resolvido").length,
    },
    { rotulo: "Tempo Médio", valor: "2h 15min" },
  ];

  const pegarStatusIcone = (status: string) => {
    switch (status) {
      case "Aberto":
        return AlertCircle;
      case "Em andamento":
        return Clock;
      case "Resolvido":
        return CheckCircle;
      default:
        return MessageSquare;
    }
  };

  const pegarStatusCor = (status: string) => {
    switch (status) {
      case "Aberto":
        return "bg-red-100 text-red-800";
      case "Em andamento":
        return "bg-yellow-100 text-yellow-800";
      case "Resolvido":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const pegarPrioridadeCor = (prioridade: string) => {
    switch (prioridade) {
      case "Alta":
        return "bg-red-100 text-red-800";
      case "Média":
        return "bg-yellow-100 text-yellow-800";
      case "Baixa":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const ticketsFiltrados = ticketsSuporte.filter((ticket) => {
    const buscaEncontrada =
      ticket.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      ticket.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      ticket.telefone.includes(busca);
    const statusIgual =
      filtroStatus === "todos" || ticket.status === filtroStatus;
    const prioridadeIgual =
      filtroPrioridade === "todos" || ticket.prioridade === filtroPrioridade;
    return buscaEncontrada && statusIgual && prioridadeIgual;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Central de Suporte
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie todos os chamados e solicitações
          </p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center 
        space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Chamado</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {estatisticas.map((estatistica, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">{estatistica.rotulo}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{estatistica.valor}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar"
              value={busca}
              onChange={(elemento) => definirBusca(elemento.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 
              focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              title="Filtrar por status"
              value={filtroStatus}
              onChange={(elemento) => definirtStatusFiltro(elemento.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
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
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as Prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {ticketsFiltrados.map((ticket) => {
          const StatusIcon = pegarStatusIcone(ticket.status);
          return (
            <div key={ticket.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <StatusIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">#{ticket.id} - {ticket.titulo}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>Cliente: <strong>{ticket.cliente}</strong></span>
                      <span>Telefone: {ticket.telefone}</span>
                      <span>Plano: {ticket.plano}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${pegarPrioridadeCor(ticket.prioridade)}`}>
                    {ticket.prioridade}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${pegarStatusCor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{ticket.descricao}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Categoria:</span>
                  <p className="text-gray-900">{ticket.categoria}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Criado em:</span>
                  <p className="text-gray-900">{ticket.criado}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  Última atualização: {ticket.atualizado}
                </span>
                <div className="flex space-x-2">
                  <button type="button" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors">
                    Ver Detalhes
                  </button>
                  <button type="button" className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-lg transition-colors">
                    Atualizar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {ticketsFiltrados.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum chamado encontrado com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
};

export default Support;
