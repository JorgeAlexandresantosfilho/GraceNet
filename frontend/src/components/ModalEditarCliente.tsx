import { useState, useEffect } from 'react';
import type { Cliente } from '../types';
// CORREÇÃO: Importa as funções corretas para Cliente
import { getClienteById, updateCliente } from '../services/api';

interface ModalEditarClienteProps {
  clienteId: number;
  onClose: () => void;
  onSave: (clienteAtualizado: Partial<Cliente>) => void; // Permite Partial<Cliente>
}

// <<< --- CORREÇÃO AQUI --- >>>
// Removemos React.FC e usamos exportação nomeada
export const ModalEditarCliente = ({ clienteId, onClose, onSave }: ModalEditarClienteProps) => {
  // Estado para o formulário (inicialmente Partial para permitir carregamento)
  const [formData, setFormData] = useState<Partial<Cliente>>({});
  const [loading, setLoading] = useState(true); // Começa carregando os dados
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false); // Loading de salvamento

  // 1. Busca os dados do cliente quando o modal abre
  useEffect(() => {
    const carregarDadosCliente = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getClienteById(clienteId);
        setFormData(data); // Preenche o formulário com os dados recebidos
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

  // 2. Função para lidar com mudanças no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Função para salvar (chama a API)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaveLoading(true);
    setError(null);
    try {
      // Chama a função de update da API, passando apenas os dados do formulário
      // O 'id' já está no clienteId prop
      await updateCliente(clienteId, formData);
      onSave(formData); // Avisa o componente pai com os dados atualizados localmente
    } catch (err: any) {
      setError(err.message || "Falha ao salvar. Tente novamente.");
      console.error("Erro ao salvar cliente:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  // --- Renderização do Modal ---

  // Estado de carregamento inicial
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">Carregando dados do cliente...</div>
      </div>
    );
  }

  // Estado de erro no carregamento
  if (error && !formData.id) { // Se deu erro e não temos ID
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={onClose} className="mt-4 bg-gray-300 px-4 py-2 rounded">Fechar</button>
        </div>
      </div>
    );
  }

  // Se, por algum motivo, não carregou os dados
  if (!formData.id) return null;

  return (
    // Fundo escuro do modal
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Conteúdo do Modal */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">
        {/* <<< --- CORREÇÃO AQUI --- >>> Título só renderiza se formData.nomeCompleto existir */}
        <h2 className="text-2xl font-bold mb-4">Editar Cliente: {formData.nomeCompleto || ''}</h2>

        {/* Mostra erro de SALVAMENTO */}
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

          {/* Adicione outros campos editáveis aqui (CEP, Rua, Numero, Plano) se necessário */}
           <div>
              <label htmlFor="plano" className="block text-sm font-medium text-gray-700">Plano</label>
              <input
                type="text" // Idealmente seria um <select> carregado da API de Planos
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

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saveLoading} // Usa loading de salvar
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saveLoading} // Usa loading de salvar
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

// <<< --- NÃO TEM MAIS EXPORT DEFAULT AQUI --- >>>