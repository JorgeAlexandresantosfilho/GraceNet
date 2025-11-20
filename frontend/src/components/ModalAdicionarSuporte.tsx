import { useState, useEffect } from 'react';
import type { TicketSuporte, Cliente } from '../types';
// Importa as APIs de Suporte e de Cliente
import { createSuporteTicket, getClientes } from '../services/api';

interface ModalAdicionarSuporteProps {
  onClose: () => void;
  onSave: (novoTicket: TicketSuporte) => void;
}

// O formulário usa os nomes exatos do backend
const estadoInicialForm = {
  titulo: "",
  descricao_problema: "",
  status: "Aberto", // Padrão
  prioridade: "Baixa", // Padrão
  id_cliente: 0, // ID do cliente a ser selecionado
  inicio_desejado: "",
};

const ModalAdicionarSuporte: React.FC<ModalAdicionarSuporteProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState(estadoInicialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);

  useEffect(() => {
    const carregarClientes = async () => {
      try {
        setLoadingClientes(true);
        const listaClientes = await getClientes();
        setClientes(listaClientes);
      } catch (err) {
        setError("Falha ao carregar a lista de clientes.");
      } finally {
        setLoadingClientes(false);
      }
    };
    carregarClientes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const valorFinal = name === 'id_cliente' ? parseInt(value) : value;

    setFormData(prev => ({
      ...prev,
      [name]: valorFinal,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.titulo || !formData.descricao_problema) {
      setError("Título e Descrição são obrigatórios.");
      setLoading(false);
      return;
    }
    if (formData.id_cliente === 0) {
      setError("Você precisa selecionar um cliente.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        inicio_desejado: formData.inicio_desejado || null,
        id_tecnico: null
      };

      const novoTicket = await createSuporteTicket(payload);
      onSave(novoTicket);
    } catch (err: any) {
      setError(err.message || "Falha ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Abrir Novo Chamado</h2>

        {error && <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg mb-4 border border-red-200 dark:border-red-800">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="id_cliente" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente*</label>
            {loadingClientes ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Carregando clientes...</p>
            ) : (
              <select
                name="id_cliente"
                value={formData.id_cliente}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value={0} disabled>Selecione um cliente...</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nomeCompleto} (CPF: {cliente.cpf})
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título*</label>
            <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status*</label>
              <select name="status" value={formData.status} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" >
                <option value="Aberto">Aberto</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Resolvido">Resolvido</option>
              </select>
            </div>
            <div>
              <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridade*</label>
              <select name="prioridade" value={formData.prioridade} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
            <div>
              <label htmlFor="inicio_desejado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Início Desejado</label>
              <input type="date" name="inicio_desejado" value={formData.inicio_desejado} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
            </div>
          </div>
          <div>
            <label htmlFor="descricao_problema" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição do Problema*</label>
            <textarea name="descricao_problema" value={formData.descricao_problema} onChange={handleChange} rows={4} required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={onClose} disabled={loading}
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 font-medium" >
              Cancelar
            </button>
            <button type="submit" disabled={loading || loadingClientes}
              className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium shadow-lg shadow-blue-600/20" >
              {loading ? 'Salvando...' : 'Salvar Chamado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAdicionarSuporte;