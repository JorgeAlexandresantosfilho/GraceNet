import { useState, useEffect } from "react";
import { Users, Wifi, AlertTriangle, Loader2 } from "lucide-react";
// Importa as funções da API e os tipos
import { getDashboardStats } from '../services/api';
import type { Cliente, Plano, TicketSuporte } from "../types";

// --- COMPONENTE DO CARD DE ESTATÍSTICA (SEM MUDANÇAS) ---
const StatCard: React.FC<{ titulo: string; valor: string | number; icone: React.ElementType; cor: "blue" | "purple" | "red"; loading?: boolean }> = ({
  titulo,
  valor,
  icone: Icon,
  cor,
  loading = false
}) => {
  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
  };
  const { bg, text } = colorClasses[cor] || {};

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{titulo}</p>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : valor}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${bg}`}>
          <Icon className={`w-6 h-6 ${text}`} />
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE DO DASHBOARD ---
const Dashboard = () => {
  // Estados para os dados da API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estatisticas, setEstatisticas] = useState({
    novosClientes: 90, // Fixo (mock)
    clientesAtivos: 0,
    planoMaisVendido: "...",
    chamadosAbertos: 0,
  });
  const [clientesRecentes, setClientesRecentes] = useState<Cliente[]>([]);

  // Dados falsos (mock) para o gráfico, pois não temos a coluna data_cadastro
  const dadosMensais = [
    { mes: "Mar", clientes: 1765 },
    { mes: "Abr", clientes: 1790 },
    { mes: "Mai", clientes: 1815 },
    { mes: "Jun", clientes: 1840 },
    { mes: "Jul", clientes: 1860 },
    { mes: "Ago", clientes: 1950 },
  ];

  // Hook para buscar os dados da API
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Busca todos os dados de uma vez
        const data = await getDashboardStats();

        // 2. Processa os dados para os cards
        const clientesAtivos = data.clientes.filter(c => c.status === "Ativo").length;
        const chamadosAbertos = data.tickets.filter(t => t.status === "Aberto").length;

        // 3. Processa o plano mais vendido
        let planoMaisVendido = "N/A";
        if (data.clientes.length > 0) {
          const contagemPlanos = data.clientes.reduce((acc, cliente) => {
            if (cliente.plano) { // Só conta se o cliente tiver um plano
              acc[cliente.plano] = (acc[cliente.plano] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>); // { "Fibra 100MB": 5, "Fibra 50MB": 2 }

          // Encontra o plano com a maior contagem
          const [plano] = Object.entries(contagemPlanos)
            .sort((a, b) => b[1] - a[1])[0] || ["N/A"];
          planoMaisVendido = plano;
        }

        // 4. Atualiza os estados
        setEstatisticas({
          novosClientes: 90, // Fixo (mock)
          clientesAtivos: clientesAtivos,
          planoMaisVendido: planoMaisVendido,
          chamadosAbertos: chamadosAbertos,
        });

        // 5. Atualiza a lista de clientes recentes
        // (Já vem ordenado por ID DESC do backend)
        setClientesRecentes(data.clientes.slice(0, 5));

      } catch (err: any) {
        setError(err.message || "Falha ao carregar dados do dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []); // Roda apenas uma vez

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Visão geral</p>
      </div>

      {/* Mostra erro no topo se houver */}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {/* Cards de Estatísticas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          titulo="Novos Clientes"
          valor={estatisticas.novosClientes}
          icone={Users}
          cor="blue"
          loading={loading}
        />
        <StatCard
          titulo="Clientes Ativos"
          valor={estatisticas.clientesAtivos}
          icone={Users}
          cor="blue"
          loading={loading}
        />
        <StatCard
          titulo="Plano Mais Vendido"
          valor={estatisticas.planoMaisVendido}
          icone={Wifi}
          cor="purple"
          loading={loading}
        />
        <StatCard
          titulo="Chamados Abertos"
          valor={estatisticas.chamadosAbertos}
          icone={AlertTriangle}
          cor="red"
          loading={loading}
        />
      </div>

      {/* Colunas de Clientes Recentes e Crescimento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Clientes Recentes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Clientes Recentes
          </h3>
          <div className="space-y-4">
            {loading && (
              <p className="text-sm text-gray-500">Carregando...</p>
            )}
            {!loading && clientesRecentes.length === 0 && (
              <p className="text-sm text-gray-500">Nenhum cliente recente encontrado.</p>
            )}

            {clientesRecentes.map((cliente) => (
              <div
                key={cliente.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{cliente.nomeCompleto}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{cliente.plano}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${cliente.status === "Ativo"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800" // Ajustado (sem Pendente)
                      }`}
                  >
                    {cliente.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {cliente.vencimento}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crescimento de Clientes (Mock) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Crescimento de Clientes (Dados Falsos)
          </h3>
          <div className="space-y-4">
            {dadosMensais.map((dado, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {dado.mes}/2025
                </span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(dado.clientes / 3000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-16 text-right">
                    {dado.clientes}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            *Estes dados são falsos. ainda sera adicionado um novo campo no nosso banco para torna-los reais.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;