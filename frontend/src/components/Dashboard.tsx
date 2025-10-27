import { Users, Wifi, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
  };

  const estatisticas = [
    {
      titulo: "Novos Clientes",
      valor: "90",
      icone: Users,
      cor: "blue",
    },
    {
      titulo: "Clientes Ativos",
      valor: "1950",
      icone: Users,
      cor: "blue",
    },
    {
      titulo: "Plano Mais Vendido",
      valor: "Fibra Família",
      icone: Wifi,
      cor: "purple",
    },
    {
      titulo: "Chamados Abertos",
      valor: "15",
      icone: AlertTriangle,
      cor: "red",
    },
  ] as const;

  const clientesRecentes = [
    {
      id: 1,
      nome: "Jorge",
      plano: "Fibra Família",
      status: "Ativo",
      dataVencimento: "15/09/2025",
    },
    {
      id: 2,
      nome: "Anderson",
      plano: "Fibra Premium",
      status: "Pendente",
      dataVencimento: "10/08/2025",
    },
    {
      id: 3,
      nome: "Philipe",
      plano: "Fibra Básico",
      status: "Ativo",
      dataVencimento: "20/09/2025",
    },
    {
      id: 4,
      nome: "Gabriel",
      plano: "Fibra Ultra",
      status: "Inativo",
      dataVencimento: "05/08/2025",
    },
    {
      id: 5,
      nome: "Victor",
      plano: "Fibra Família",
      status: "Ativo",
      dataVencimento: "25/08/2025",
    },
  ];

  const dadosMensais = [
    { mes: "Mar", clientes: 1765 },
    { mes: "Abr", clientes: 1790 },
    { mes: "Mai", clientes: 1815 },
    { mes: "Jun", clientes: 1840 },
    { mes: "Jul", clientes: 1860 },
    { mes: "Ago", clientes: 1950 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {estatisticas.map((estatistica, index) => {
          const Icon = estatistica.icone;
          const { bg, text } = colorClasses[estatistica.cor] || {};
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {estatistica.titulo}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {estatistica.valor}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${bg}`}>
                  <Icon className={`w-6 h-6 ${text}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Clientes Recentes
          </h3>
          <div className="space-y-4">
            {clientesRecentes.map((cliente) => (
              <div
                key={cliente.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{cliente.nome}</p>
                  <p className="text-sm text-gray-600">{cliente.plano}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      cliente.status === "Ativo"
                        ? "bg-green-100 text-green-800"
                        : cliente.status === "Pendente"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {cliente.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {cliente.dataVencimento}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Crescimento de Clientes
          </h3>
          <div className="space-y-4">
            {dadosMensais.map((dado, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-900">
                  {dado.mes}/2025
                </span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(dado.clientes / 3000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {dado.clientes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
