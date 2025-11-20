import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Wifi, Check, Zap } from "lucide-react";
import { getPlanos, deletePlano } from '../services/api';
import type { Plano } from '../types';
import { ModalEditarPlano } from './ModalEditarPlano';
import ModalAdicionarPlano from './ModalAdicionarPlano';

const Plans = () => {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalEditarAberto, setIsModalEditarAberto] = useState(false);
  const [isModalAdicionarAberto, setIsModalAdicionarAberto] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState<Plano | null>(null);

  useEffect(() => {
    carregarPlanos();
  }, []);

  const carregarPlanos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPlanos();
      setPlanos(data);
    } catch (err: any) {
      setError(err.message || "Falha ao carregar os planos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirPlano = async (id: number) => {
    if (window.confirm("Tem certeza que deseja INATIVAR este plano? Clientes podem estar usando ele.")) {
      try {
        await deletePlano(id);
        setPlanos(planosAtuais =>
          planosAtuais.map(p => p.id === id ? { ...p, status: 'Inativo' } : p)
        );
      } catch (err: any) {
        alert(err.message || "Erro ao inativar o plano.");
        console.error(err);
      }
    }
  };

  const handleAbrirModalEditar = (plano: Plano) => {
    setPlanoSelecionado(plano);
    setIsModalEditarAberto(true);
  };

  const handleFecharModalEditar = () => {
    setIsModalEditarAberto(false);
    setPlanoSelecionado(null);
  };

  const handleSalvarEdicao = (planoAtualizado: Plano) => {
    setPlanos(planosAtuais =>
      planosAtuais.map(p => (p.id === planoAtualizado.id ? planoAtualizado : p))
    );
    handleFecharModalEditar();
  };

  const handleAbrirModalAdicionar = () => {
    setIsModalAdicionarAberto(true);
  };

  const handleFecharModalAdicionar = () => {
    setIsModalAdicionarAberto(false);
  };

  const handleSalvarAdicao = (novoPlano: Plano) => {
    setPlanos(planosAtuais => [novoPlano, ...planosAtuais]);
    handleFecharModalAdicionar();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Planos de Internet
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gerencie seu catálogo de ofertas.
          </p>
        </div>
        <button
          onClick={handleAbrirModalAdicionar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Plano</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl">
          {error}
        </div>
      )}

      {/* Grid de Cards */}
      {planos.length === 0 && !loading ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <Wifi className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum plano cadastrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {planos.map((plano) => (
            <div
              key={plano.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col relative overflow-hidden"
            >
              {/* Gradiente decorativo no topo */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                  <Wifi className="w-6 h-6" />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${plano.status === 'Ativo'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                  {plano.status}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate" title={plano.nome}>
                {plano.nome}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 h-10">
                {plano.descricao}
              </p>

              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    R$ {plano.preco.toFixed(2)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">/mês</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold mt-1">
                  <Zap className="w-4 h-4" />
                  {plano.velocidade}
                </div>
              </div>

              <div className="flex-grow mb-6">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Incluso no plano
                </h4>
                <ul className="space-y-2">
                  {plano.features?.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="truncate">{feature}</span>
                    </li>
                  ))}
                  {(!plano.features || plano.features.length === 0) && (
                    <li className="text-sm text-gray-400 italic">Sem recursos listados</li>
                  )}
                </ul>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => handleAbrirModalEditar(plano)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => plano.status === 'Ativo' && handleExcluirPlano(plano.id)}
                  disabled={plano.status === 'Inativo'}
                  title={plano.status === 'Inativo' ? 'Plano já inativo' : 'Inativar Plano'}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all shadow-sm ${plano.status === 'Inativo'
                    ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:border-red-300 dark:hover:border-red-700'
                    }`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="font-medium hidden xl:inline">Inativar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabela Comparativa */}
      {planos.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Comparativo de Performance
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Velocidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clientes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receita Est.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {planos.map((plano) => (
                  <tr key={plano.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{plano.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{plano.velocidade}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white font-medium">R$ {plano.preco.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{plano.clientes}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                      R$ {(plano.preco * plano.clientes).toLocaleString('pt-br', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${plano.status === 'Ativo'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {plano.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalEditarAberto && planoSelecionado && (
        <ModalEditarPlano
          plano={planoSelecionado}
          onClose={handleFecharModalEditar}
          onSave={handleSalvarEdicao}
        />
      )}

      {isModalAdicionarAberto && (
        <ModalAdicionarPlano
          onClose={handleFecharModalAdicionar}
          onSave={handleSalvarAdicao}
        />
      )}
    </div>
  );
};

export default Plans;