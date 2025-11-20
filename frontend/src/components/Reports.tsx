import React from 'react';
import {
  DollarSign,
  UserPlus,
  TrendingDown,
  CheckCircle,
  Wifi,
  TrendingUp,
  Download,
  Users
} from 'lucide-react';

// URL da sua API (onde o backend está rodando)
const API_URL = 'http://localhost:3000';

// Componente para os cards do topo (KPIs)
const StatCard: React.FC<{ title: string; value: string; change: string; icon: React.ElementType; changeColor: string }> = ({
  title,
  value,
  change,
  icon: Icon,
  changeColor,
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</span>
      <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
    <p className={`text-sm mt-1 ${changeColor}`}>
      {change}
    </p>
  </div>
);

// Componente para os cards de Relatório (botões)
const ReportCard: React.FC<{ title: string; description: string; icon: React.ElementType; href?: string; disabled?: boolean }> = ({
  title,
  description,
  icon: Icon,
  href,
  disabled = false
}) => {
  const buttonClasses = `
    mt-4 w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2
    ${disabled
      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
    }
  `;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col transition-colors">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <div className="flex-grow"></div>

      {href && !disabled ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses}
          download
        >
          <Download className="w-4 h-4" />
          <span>Gerar Relatório</span>
        </a>
      ) : (
        <button
          className={buttonClasses}
          disabled={disabled}
        >
          <Download className="w-4 h-4" />
          <span>Gerar Relatório</span>
        </button>
      )}
    </div>
  );
};

const Reports = () => {
  // --- DADOS FALSOS (MOCK) ---
  const kpiData = [
    { title: 'Receita Total (Dezembro)', value: 'R$ 284.750', change: '+12%', icon: DollarSign, changeColor: 'text-green-600 dark:text-green-400' },
    { title: 'Novos Clientes', value: '87', change: '+23%', icon: UserPlus, changeColor: 'text-green-600 dark:text-green-400' },
    { title: 'Taxa de Churn', value: '2.3%', change: '-0.5%', icon: TrendingDown, changeColor: 'text-red-600 dark:text-red-400' },
    { title: 'Uptime Médio', value: '99.2%', change: '+0.1%', icon: CheckCircle, changeColor: 'text-green-600 dark:text-green-400' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Relatórios e Análises
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Análises detalhadas do seu negócio</p>
        </div>
        <select
          title="filtro-tempo"
          defaultValue="ultimo-mes"
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
        >
          <option value="hoje">Hoje</option>
          <option value="ultima-semana">Últimos 7 dias</option>
          <option value="ultimo-mes">Último Mês</option>
          <option value="ultimo-ano">Último Ano</option>
        </select>
      </div>

      {/* Cards de KPIs (Estatísticas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            change={item.change}
            icon={item.icon}
            changeColor={item.changeColor}
          />
        ))}
      </div>

      {/* Cards de Botões de Relatório */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* --- AGORA HABILITADO --- */}
        <ReportCard
          title="Relatório Financeiro"
          description="Receita potencial por plano (clientes ativos)"
          icon={DollarSign}
          href={`${API_URL}/export/financials`}
        />

        {/* --- FUNCIONANDO --- */}
        <ReportCard
          title="Relatório de Clientes"
          description="Base de clientes e crescimento"
          icon={Users}
          href={`${API_URL}/export/clients`}
        />

        {/* --- AGORA HABILITADO --- */}
        <ReportCard
          title="Performance da Rede"
          description="Total de chamados por título"
          icon={Wifi}
          href={`${API_URL}/export/network`}
        />

        {/* --- AGORA HABILITADO --- */}
        <ReportCard
          title="Crescimento do Negócio"
          description="Novos clientes por mês (data de instalação)"
          icon={TrendingUp}
          href={`${API_URL}/export/growth`}
        />
      </div>
    </div>
  );
};

export default Reports;