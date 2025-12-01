import { useState, useEffect } from "react";
import { Users, Wifi, AlertTriangle, Loader2, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getDashboardStats } from '../services/api';
import type { Cliente } from "../types";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// --- COMPONENTE DO CARD DE ESTATÍSTICA ---
const StatCard: React.FC<{
  titulo: string;
  valor: string | number;
  icone: React.ElementType;
  cor: "blue" | "purple" | "red" | "green";
  loading?: boolean;
  tendencia?: string; // Ex: "+12%"
}> = ({
  titulo,
  valor,
  icone: Icon,
  cor,
  loading = false,
  tendencia
}) => {
    const colorClasses = {
      blue: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400", border: "border-blue-100 dark:border-blue-800" },
      purple: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-600 dark:text-purple-400", border: "border-purple-100 dark:border-purple-800" },
      red: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400", border: "border-red-100 dark:border-red-800" },
      green: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-600 dark:text-green-400", border: "border-green-100 dark:border-green-800" },
    };
    const { bg, text, border } = colorClasses[cor] || colorClasses.blue;

    return (
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border ${border} transition-all duration-300 hover:shadow-md hover:scale-[1.02]`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${bg}`}>
            <Icon className={`w-6 h-6 ${text}`} />
          </div>
          {tendencia && (
            <div className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" />
              {tendencia}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{titulo}</p>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
            {loading ? <Loader2 className="w-8 h-8 animate-spin text-gray-300" /> : valor}
          </div>
        </div>
      </div>
    );
  };

// --- COMPONENTE DO DASHBOARD ---
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estatisticas, setEstatisticas] = useState({
    novosClientes: 0,
    clientesAtivos: 0,
    planoMaisVendido: "...",
    chamadosAbertos: 0,
  });
  const [clientesRecentes, setClientesRecentes] = useState<Cliente[]>([]);
  const [dadosPlanos, setDadosPlanos] = useState<{ name: string; value: number }[]>([]);
  const [dadosMensais, setDadosMensais] = useState<{ mes: string; clientes: number }[]>([]);

  // Cores para o gráfico de Pizza
  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getDashboardStats();

        setEstatisticas({
          novosClientes: data.novosClientes,
          clientesAtivos: data.clientesAtivos,
          planoMaisVendido: data.planoMaisVendido,
          chamadosAbertos: data.chamadosAbertos,
        });

        setClientesRecentes(data.clientesRecentes);
        setDadosPlanos(data.distribuicaoPlanos);
        setDadosMensais(data.crescimentoBase);

      } catch (err: any) {
        setError(err.message || "Falha ao carregar dados do dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header com Saudação */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Visão geral do seu provedor hoje.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg text-blue-700 dark:text-blue-300 text-sm font-medium">
          <Wifi className="w-4 h-4" />
          <span>Sistema Operacional</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          titulo="Novos Clientes (Mês)"
          valor={estatisticas.novosClientes}
          icone={Users}
          cor="blue"
          loading={loading}
          tendencia="+12%"
        />
        <StatCard
          titulo="Base Ativa"
          valor={estatisticas.clientesAtivos}
          icone={Wifi}
          cor="green"
          loading={loading}
          tendencia="+5%"
        />
        <StatCard
          titulo="Plano Top"
          valor={estatisticas.planoMaisVendido}
          icone={TrendingUp}
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

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Área - Crescimento */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Crescimento da Base</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dadosMensais}>
                <defs>
                  <linearGradient id="colorClientes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="mes"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="clientes"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorClientes)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza - Planos */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Distribuição de Planos</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            ) : dadosPlanos.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosPlanos}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dadosPlanos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-sm">Sem dados de planos</p>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Clientes Recentes */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Clientes Recentes</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Carregando...
                  </td>
                </tr>
              ) : clientesRecentes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Nenhum cliente encontrado.</td>
                </tr>
              ) : (
                clientesRecentes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                          {cliente.nomeCompleto.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{cliente.nomeCompleto}</p>
                          <p className="text-xs text-gray-500">{cliente.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {cliente.plano}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${cliente.status === "Ativo"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                        {cliente.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      Dia {cliente.vencimento}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;