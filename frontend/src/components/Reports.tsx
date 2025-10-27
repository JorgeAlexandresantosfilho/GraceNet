import { useState } from "react";
import { FileText, Download, TrendingUp } from "lucide-react";
import { relatorios } from "../data/reports";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const quickStats = [
    {
      label: "Receita Total (Dezembro)",
      value: "R$ 284.750",
      change: "+12%",
      trend: "up",
    },
    { label: "Novos Clientes", value: "87", change: "+23%", trend: "up" },
    { label: "Taxa de Churn", value: "2.3%", change: "-0.5%", trend: "down" },
    { label: "Uptime Médio", value: "99.2%", change: "+0.1%", trend: "up" },
  ];

  const recentReports = [
    {
      id: 1,
      name: "Relatório Financeiro - Novembro 2024",
      type: "Financeiro",
      generated: "01/12/2024",
      size: "2.3 MB",
    },
    {
      id: 2,
      name: "Performance da Rede - Q3 2024",
      type: "Técnico",
      generated: "30/11/2024",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "Análise de Clientes - Outubro 2024",
      type: "Comercial",
      generated: "31/10/2024",
      size: "1.2 MB",
    },
  ];

  const monthlyData = [
    { month: "Jan", revenue: 185000, customers: 1500, churn: 2.8 },
    { month: "Feb", revenue: 188500, customers: 1550, churn: 2.5 },
    { month: "Mar", revenue: 191800, customers: 1600, churn: 2.1 },
    { month: "Apr", revenue: 194600, customers: 1650, churn: 1.9 },
    { month: "Mai", revenue: 196900, customers: 1700, churn: 2.2 },
    { month: "Jun", revenue: 198700, customers: 1750, churn: 2.0 },
    { month: "Jul", revenue: 200200, customers: 1785, churn: 1.8 },
    { month: "Ago", revenue: 201600, customers: 1820, churn: 2.1 },
    { month: "Set", revenue: 202800, customers: 1850, churn: 2.4 },
    { month: "Out", revenue: 203700, customers: 1880, churn: 2.0 },
    { month: "Nov", revenue: 204500, customers: 1910, churn: 1.9 },
    { month: "Dez", revenue: 205305, customers: 1950, churn: 1.7 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Relatórios e Análises
          </h1>
          <p className="text-gray-600 mt-1">
            Análises detalhadas do seu negócio
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            title="Selecionar período"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="weekly">Última Semana</option>
            <option value="monthly">Último Mês</option>
            <option value="quarterly">Último Trimestre</option>
            <option value="yearly">Último Ano</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stat.value}
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp
                className={`w-4 h-4 mr-1 ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatorios.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div
                className={`p-3 rounded-lg bg-${report.color}-100 w-fit mb-4`}
              >
                <Icon className={`w-6 h-6 text-${report.color}-600`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {report.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{report.description}</p>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Gerar Relatório</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Evolução da Receita
          </h3>
          <div className="space-y-3">
            {monthlyData.slice(-6).map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{data.month}/2024</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(data.revenue / 300000) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20 text-right">
                    R$ {(data.revenue / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Growth */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Crescimento de Clientes
          </h3>
          <div className="space-y-3">
            {monthlyData.slice(-6).map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{data.month}/2024</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(data.customers / 3000) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {data.customers}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Relatórios Recentes
          </h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Ver Todos
          </button>
        </div>
        <div className="space-y-4">
          {recentReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-600">
                    {report.type} • {report.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {report.generated}
                </span>
                <button
                  title="download"
                  type="button"
                  className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
