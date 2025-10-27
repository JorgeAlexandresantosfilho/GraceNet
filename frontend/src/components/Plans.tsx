import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Wifi } from "lucide-react";
import { getPlanos, deletePlano, createPlano } from '../services/api';
import type { Plano } from '../types';
// <<< --- CORREÇÃO AQUI --- >>>
// Importa usando chaves {} porque agora é uma exportação nomeada
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
    return <div className="p-6 text-center">Carregando planos...</div>;
  }

  if (error && planos.length === 0) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {error && planos.length > 0 && (
         <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Planos de Internet
          </h1>
          <p className="text-gray-600 mt-1">Gerencie os planos</p>
        </div>
        <button
          title="Adicionar Novo Plano"
          type="button"
          onClick={handleAbrirModalAdicionar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Plano</span>
        </button>
      </div>

      {planos.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-500">
          Nenhum plano encontrado.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {planos.map((plano) => (
          <div
            key={plano.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6
            hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Wifi className="w-6 h-6 text-purple-600" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                plano.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {plano.status}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate" title={plano.nome}>
              {plano.nome}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plano.descricao}</p>

            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  R$ {plano.preco.toFixed(2)}
                </span>
                <span className="text-gray-500 ml-1">/mês</span>
              </div>
              <div className="text-blue-600 font-medium text-lg mt-1">
                {plano.velocidade}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Recursos inclusos:
              </h4>
              <ul className="space-y-1">
                {plano.features?.slice(0, 3).map((feature, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 flex items-center"
                  >
                    <div className="w-1 h-1 bg-blue-600 rounded-full mr-2 flex-shrink-0"></div>
                    <span className="truncate">{feature}</span>
                  </li>
                ))}
                 {plano.features && plano.features.length > 3 && (
                    <li className="text-xs text-gray-400 mt-1">... e mais</li>
                 )}
                 {!plano.features || plano.features.length === 0 && (
                     <li className="text-xs text-gray-400">Nenhum recurso listado.</li>
                 )}
              </ul>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>{plano.clientes} cliente(s)</span>
            </div>

            <div className="flex-grow"></div>

            <div className="flex space-x-2">
              <button
                title="Editar Plano"
                onClick={() => handleAbrirModalEditar(plano)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2
                rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
              >
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
              <button
                title={plano.status === 'Ativo' ? "Inativar Plano" : "Plano já Inativo"}
                onClick={() => plano.status === 'Ativo' && handleExcluirPlano(plano.id)}
                type="button"
                disabled={plano.status === 'Inativo'}
                className={`p-2 rounded-lg transition-colors ${
                    plano.status === 'Inativo'
                    ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                    : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {planos.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Comparação de Planos
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Plano
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Velocidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Clientes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Receita Mensal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {planos.map((plano) => (
                    <tr
                      key={plano.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-900">
                        <span className="font-medium">{plano.nome}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{plano.velocidade}</td>
                      <td className="px-6 py-4 text-gray-900">R$ {plano.preco.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-900">{plano.clientes}</td>
                      <td className="px-6 py-4 text-gray-900">
                        R$ {(plano.preco * plano.clientes).toLocaleString('pt-br', {minimumFractionDigits: 2})}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          plano.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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

// Garante que a exportação default esteja na última linha e correta
export default Plans;