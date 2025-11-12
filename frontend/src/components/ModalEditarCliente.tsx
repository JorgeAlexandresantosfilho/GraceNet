import { useState, useEffect } from 'react';
// <<< --- CORREÇÃO AQUI --- >>>
// Garante que estamos importando os tipos e funções corretos
import type { Cliente } from '../types';
import { getClienteById, updateCliente } from '../services/api';

interface ModalEditarClienteProps {
  clienteId: number;
  onClose: () => void;
  // <<< --- CORREÇÃO AQUI --- >>>
  // Garante que o onSave espera um 'Cliente', não um 'Plano'
  onSave: (clienteAtualizado: Partial<Cliente>) => void;
}

const ModalEditarCliente: React.FC<ModalEditarClienteProps> = ({ clienteId, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Cliente>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const carregarDadosCliente = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getClienteById(clienteId);
        setFormData(data);
      } catch (err: any) {
        setError(err.message || "Falha ao carregar dados do cliente.");
        console.error("Erro ao carregar cliente:", err);
      } finally {
        setLoading(false);
      }
    };
    if (clienteId) {
       carregarDadosCliente();
    }
  }, [clienteId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaveLoading(true);
    setError(null);
    try {
      await updateCliente(clienteId, formData);
      onSave(formData);
    } catch (err: any) {
      setError(err.message || "Falha ao salvar. Tente novamente.");
      console.error("Erro ao salvar cliente:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">Carregando dados do cliente...</div>
      </div>
    );
  }

  if (error && !formData.id) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={onClose} className="mt-4 bg-gray-300 px-4 py-2 rounded">Fechar</button>
        </div>
      </div>
    );
  }

  if (!formData.id) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Editar Cliente: {formData.nomeCompleto || ''}</h2>

        {error && !loading && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              type="text"
              id="nomeCompleto"
              name="nomeCompleto"
              value={formData.nomeCompleto || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              value={formData.telefone || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
            />
          </div>
           <div>
              <label htmlFor="plano" className="block text-sm font-medium text-gray-700">Plano</label>
              <input
                type="text"
                id="plano"
                name="plano"
                value={formData.plano || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
              />
            </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status || 'Ativo'}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saveLoading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saveLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              {saveLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// <<< --- CORREÇÃO AQUI --- >>>
// Adiciona o export default que estava faltando
export default ModalEditarCliente;