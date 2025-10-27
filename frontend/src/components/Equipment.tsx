import { useState, useEffect } from 'react';
import { Plus, Router, Monitor, Settings, Edit, Trash2 } from 'lucide-react';
// Importa TODAS as funções da API necessárias
import { getEquipamentos, deleteEquipamento, createEquipamento, updateEquipamento, getEquipamentoBySerial } from '../services/api';
import type { Equipamento } from '../types';
// Importa os DOIS modais
import ModalAdicionarEquipamento from './ModalAdicionarEquipamento';
import ModalEditarEquipamento from './ModalEditarEquipamento';

const Equipment = () => {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('all');

  // --- Estados para Modais ---
  const [isModalAdicionarAberto, setIsModalAdicionarAberto] = useState(false);
  const [isModalEditarAberto, setIsModalEditarAberto] = useState(false);
  // Armazena o SERIAL NUMBER para edição
  const [equipamentoSelecionadoSerial, setEquipamentoSelecionadoSerial] = useState<string | null>(null);

  // Hook para carregar dados da API
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
      case 'Em uso': return 'bg-green-100 text-green-800';
      case 'Disponível': return 'bg-blue-100 text-blue-800';
      case 'Manutenção': return 'bg-yellow-100 text-yellow-800';
      case 'Defeito': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEquipment = equipamentos.filter(item => {
    if (filtro === 'all') return true;
    return item.status === filtro;
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

  // --- Funções para controlar os Modais ---
   const handleAbrirModalAdicionar = () => {
      setIsModalAdicionarAberto(true);
   };

   const handleAbrirModalEditar = (serialNumber: string) => {
      setEquipamentoSelecionadoSerial(serialNumber); // Guarda o serial
      setIsModalEditarAberto(true);
   };

   const handleAbrirDetalhes = (serialNumber: string) => {
       alert(`Funcionalidade 'Detalhes' para ${serialNumber} ainda não implementada.`);
   }

   const handleFecharModalAdicionar = () => setIsModalAdicionarAberto(false);
   const handleFecharModalEditar = () => { setIsModalEditarAberto(false); setEquipamentoSelecionadoSerial(null); };

   // Callback quando o modal Adicionar salva
   const handleSalvarAdicao = (novoEquip: Equipamento) => {
       setEquipamentos(prev => [novoEquip, ...prev]); // Adiciona no início
       handleFecharModalAdicionar();
   };

   // Callback quando o modal Editar salva
   const handleSalvarEdicao = (equipAtualizado: Equipamento) => {
       // Atualiza o item na lista pelo serialNumber
       setEquipamentos(prev => prev.map(e => e.serialNumber === equipAtualizado.serialNumber ? equipAtualizado : e));
       handleFecharModalEditar();
   };


  if (loading) {
    return <div className="p-6 text-center">Carregando equipamentos...</div>;
  }

  if (error && equipamentos.length === 0) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {error && equipamentos.length > 0 && (
         <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipamentos</h1>
          <p className="text-gray-600 mt-1">Gerencie todos os equipamentos de rede</p>
        </div>
        <button
            onClick={handleAbrirModalAdicionar} // Chama a função correta
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Novo Equipamento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltro('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {['Em uso', 'Disponível', 'Manutenção', 'Defeito'].map(status => (
             <button
                key={status}
                onClick={() => setFiltro(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtro === status ? `${getStatusColor(status).replace('text-', 'bg-').replace('-800', '-100').replace('-1000', '-700')} ${getStatusColor(status).replace('bg-', 'text-')}` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
               {status}
             </button>
          ))}
        </div>
      </div>

      {filteredEquipment.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-500">
          Nenhum equipamento encontrado{filtro !== 'all' ? ' com o filtro aplicado' : ''}.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => {
          const Icon = getIcon(item.type);
          return (
            <div key={item.serialNumber} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate" title={item.name}>{item.name || '(Sem Nome)'}</h3>
              <p className="text-gray-600 text-sm mb-2">{item.model || '(Sem Modelo)'}</p>
              <p className="text-gray-500 text-xs mb-4">S/N: {item.serialNumber || 'N/A'}</p>

              <div className="text-sm mb-4">
                  <span className="font-medium text-gray-700">Localização:</span>
                  <p className="text-gray-600">{item.location || 'N/A'}</p>
              </div>

              <div className="flex-grow"></div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                     onClick={() => handleAbrirModalEditar(item.serialNumber)} // Chama a função correta
                     className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
                     <Edit className="w-4 h-4" />
                     <span>Editar</span>
                  </button>
                   <button
                     onClick={() => handleAbrirDetalhes(item.serialNumber)} // Chama a função correta
                     className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                     Detalhes
                   </button>
                  <button
                    title="Excluir Equipamento"
                    onClick={() => handleExcluirEquipamento(item.serialNumber)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

       {/* --- Renderiza os Modais --- */}
       {isModalAdicionarAberto && (
            <ModalAdicionarEquipamento
                onClose={handleFecharModalAdicionar}
                onSave={handleSalvarAdicao}
            />
       )}
       {isModalEditarAberto && equipamentoSelecionadoSerial && (
            <ModalEditarEquipamento
                serialNumber={equipamentoSelecionadoSerial} // Passa o serial number
                onClose={handleFecharModalEditar}
                onSave={handleSalvarEdicao}
            />
       )}
    </div>
  );
};

export default Equipment;