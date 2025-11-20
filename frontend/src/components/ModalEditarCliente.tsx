import { useState, useEffect } from 'react';
// Importa o tipo e as funções corretas (de CLIENTE)
import type { Cliente } from '../types';
import { getClienteById, updateCliente } from '../services/api';

interface ModalEditarClienteProps {
  clienteId: number;
  onClose: () => void;
  onSave: (clienteAtualizado: Partial<Cliente>) => void;
}

const ModalEditarCliente: React.FC<ModalEditarClienteProps> = ({ clienteId, onClose, onSave }) => {
  // Estado para o formulário
  const [formData, setFormData] = useState<Partial<Cliente>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // 1. Busca os dados do CLIENTE quando o modal abre
  useEffect(() => {
    const carregarDadosCliente = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getClienteById(clienteId);
        setFormData(data); // Preenche o formulário com os dados recebidos
      } catch (err: any) {
        // A mensagem de erro agora é sobre "cliente"
        setError(err.message || "Falha ao carregar dados do CLIENTE.");
        console.error("Erro ao carregar cliente:", err);
      } finally {
        setLoading(false);
      }
    };
    if (clienteId) {
      carregarDadosCliente();
    }
  }, [clienteId]);

  // 2. Função para lidar com mudanças no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Função para salvar (chama a API de CLIENTE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaveLoading(true);
    setError(null);
    try {
      await updateCliente(clienteId, formData);
      onSave(formData); // Avisa o componente pai com os dados atualizados
    } catch (err: any) {
      setError(err.message || "Falha ao salvar. Tente novamente.");
      console.error("Erro ao salvar cliente:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  // --- Renderização do Modal ---

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">Carregando dados do cliente...</div>
      </div>
    );
  }

  // Mostra a mensagem de erro (agora correta)
  if (error && !formData.id) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={onClose} className="mt-4 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg">Fechar</button>
        </div>
      </div>
    );
  }

  if (!formData.id) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Editar Cliente: {formData.nomeCompleto || ''}</h2>

        {error && !loading && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
            <input
              type="text"
              id="nomeCompleto"
              name="nomeCompleto"
              value={formData.nomeCompleto || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone</label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              value={formData.telefone || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="plano" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plano</label>
            <input
              type="text"
              id="plano"
              name="plano"
              value={formData.plano || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status || 'Ativo'}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={saveLoading}
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saveLoading}
              className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium shadow-lg shadow-blue-600/20"
            >
              {saveLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarCliente;