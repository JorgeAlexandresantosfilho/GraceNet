import { useState, useEffect } from 'react';
import { Plus, Router, Monitor, Settings, Edit, Trash2, Search } from 'lucide-react';
import { getEquipamentos, deleteEquipamento } from '../services/api';
import type { Equipamento } from '../types';
// Importa os modais
import ModalAdicionarEquipamento from './ModalAdicionarEquipamento';
import ModalEditarEquipamento from './ModalEditarEquipamento';

const Equipment = () => {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('all');
  const [busca, setBusca] = useState("");
  const [isModalAdicionarAberto, setIsModalAdicionarAberto] = useState(false);
  const [isModalEditarAberto, setIsModalEditarAberto] = useState(false);
  const [equipamentoSelecionadoSerial, setEquipamentoSelecionadoSerial] = useState<string | null>(null);

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  const carregarEquipamentos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEquipamentos();
      setEquipamentos(data);
    } catch (err: any) {
      setError(err.message || "Falha ao carregar equipamentos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'router': return Router;
      case 'ont': return Monitor;
      case 'switch': return Settings;
      default: return Router;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em uso': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Disponível': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Manutenção': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Defeito': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredEquipment = equipamentos.filter(item => {
    const statusMatch = filtro === 'all' || item.status === filtro;
    if (!statusMatch) return false;
    const buscaLower = busca.toLowerCase();
    const nome = item.name || '';
    const modelo = item.model || '';
    const serial = item.serialNumber || '';
    const buscaMatch =
      nome.toLowerCase().includes(buscaLower) ||
      modelo.toLowerCase().includes(buscaLower) ||
      serial.toLowerCase().includes(buscaLower);
    return buscaMatch;
  });

  const stats = [
    { label: 'Total', value: equipamentos.length },
    { label: 'Em Uso', value: equipamentos.filter(e => e.status === 'Em uso').length },
    { label: 'Disponível', value: equipamentos.filter(e => e.status === 'Disponível').length },
    { label: 'Manutenção', value: equipamentos.filter(e => e.status === 'Manutenção').length },
    { label: 'Defeito', value: equipamentos.filter(e => e.status === 'Defeito').length },
  ];

  const handleExcluirEquipamento = async (serialNumber: string) => {
    if (window.confirm(`Tem certeza que deseja EXCLUIR o equipamento S/N: ${serialNumber}? Esta ação pode falhar se ele estiver em uso.`)) {
      try {
        await deleteEquipamento(serialNumber);
        setEquipamentos(equipamentosAtuais =>
          equipamentosAtuais.filter(e => e.serialNumber !== serialNumber)
        );
      } catch (err: any) {
        alert(err.message || "Erro ao excluir o equipamento.");
        console.error(err);
      }
    }
  };

  const handleAbrirModalAdicionar = () => {
    setIsModalAdicionarAberto(true);
  };

  const handleAbrirModalEditar = (serialNumber: string) => {
    setEquipamentoSelecionadoSerial(serialNumber);
    setIsModalEditarAberto(true);
  };

  const handleAbrirDetalhes = (serialNumber: string) => {
    alert(`Funcionalidade 'Detalhes' para ${serialNumber} ainda não implementada.`);
  }

  const handleFecharModalAdicionar = () => setIsModalAdicionarAberto(false);
  const handleFecharModalEditar = () => { setIsModalEditarAberto(false); setEquipamentoSelecionadoSerial(null); };

  const handleSalvarAdicao = (novoEquip: Equipamento) => {
    setEquipamentos(prev => [novoEquip, ...prev]);
    handleFecharModalAdicionar();
  };

  const handleSalvarEdicao = (equipAtualizado: Equipamento) => {
    setEquipamentos(prev => prev.map(e => e.serialNumber === equipAtualizado.serialNumber ? equipAtualizado : e));
    handleFecharModalEditar();
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Carregando equipamentos...</div>;
  }

  if (error && equipamentos.length === 0) {
    return <div className="p-6 text-center text-red-500 dark:text-red-400">{error}</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {error && equipamentos.length > 0 && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">{error}</div>
      )}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Equipamentos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie todos os equipamentos de rede</p>
        </div>
        <button
          onClick={handleAbrirModalAdicionar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" />
          <span>Novo Equipamento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 transition-colors">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, modelo ou S/N..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 
              focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltro('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filtro === 'all'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            Todos
          </button>
          {['Em uso', 'Disponível', 'Manutenção', 'Defeito'].map(status => (
            <button
              key={status}
              onClick={() => setFiltro(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filtro === status
                  ? getStatusColor(status)
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredEquipment.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Nenhum equipamento encontrado{filtro !== 'all' || busca ? ' com os filtros aplicados' : ''}.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => {
          const Icon = getIcon(item.type);
          return (
            <div key={item.serialNumber} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate" title={item.name}>{item.name || '(Sem Nome)'}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{item.model || '(Sem Modelo)'}</p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mb-4">S/N: {item.serialNumber || 'N/A'}</p>

              <div className="text-sm mb-4">
                <span className="font-medium text-gray-700 dark:text-gray-300">Localização:</span>
                <p className="text-gray-600 dark:text-gray-400">{item.location || 'N/A'}</p>
              </div>

              <div className="flex-grow"></div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAbrirModalEditar(item.serialNumber)}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleAbrirDetalhes(item.serialNumber)}
                    className="flex-1 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    Detalhes
                  </button>
                  <button
                    title="Excluir Equipamento"
                    onClick={() => handleExcluirEquipamento(item.serialNumber)}
                    className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalAdicionarAberto && (
        <ModalAdicionarEquipamento
          onClose={handleFecharModalAdicionar}
          onSave={handleSalvarAdicao}
        />
      )}
      {isModalEditarAberto && equipamentoSelecionadoSerial && (
        <ModalEditarEquipamento
          serialNumber={equipamentoSelecionadoSerial}
          onClose={handleFecharModalEditar}
          onSave={handleSalvarEdicao}
        />
      )}
    </div>
  );
};

export default Equipment;