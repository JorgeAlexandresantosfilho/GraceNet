import { useState, useEffect } from 'react';
import type { TicketSuporte, Cliente } from '../types';
// Importa as APIs de Suporte e de Cliente
import { createSuporteTicket, getClientes } from '../services/api';

interface ModalAdicionarSuporteProps {
  onClose: () => void;
  onSave: (novoTicket: TicketSuporte) => void;
}

// O formulário agora usa os nomes exatos do backend
const estadoInicialForm = {
  titulo: "",
  descricao_problema: "", 
  status: "Aberto", // Padrão
  prioridade: "Baixa", // Padrão
  id_cliente: 0, // ID do cliente a ser selecionado
  inicio_desejado: "", // <<< --- NOVO CAMPO --- >>>
};

const ModalAdicionarSuporte: React.FC<ModalAdicionarSuporteProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState(estadoInicialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para carregar a lista de clientes
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);

  // Carrega todos os clientes da API quando o modal abre
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
    // Converte id_cliente para número
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

    // Validação
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
      // <<< --- CORREÇÃO AQUI --- >>>
      // Prepara o payload (id_tecnico é opcional no backend)
      const payload = {
          ...formData,
          // Garante que a data vazia seja enviada como null
          inicio_desejado: formData.inicio_desejado || null, 
          id_tecnico: null 
      };
      
      // O 'createSuporteTicket' do api.ts agora recebe o payload direto
      const novoTicket = await createSuporteTicket(payload);
      onSave(novoTicket); // Envia o novo ticket de volta para a lista
    } catch (err: any) {
      setError(err.message || "Falha ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Abrir Novo Chamado</h2>

        {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="id_cliente" className="block text-sm font-medium text-gray-700">Cliente*</label>
            {loadingClientes ? (
                <p className="text-sm text-gray-500">Carregando clientes...</p>
            ) : (
                <select 
                  name="id_cliente" 
                  value={formData.id_cliente} 
                  onChange={handleChange} 
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
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
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título*</label>
            <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          {/* <<< --- NOVO CAMPO DE DATA ADICIONADO AQUI --- >>> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status*</label>
                <select name="status" value={formData.status} onChange={handleChange} required
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" >
                  <option value="Aberto">Aberto</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Resolvido">Resolvido</option>
                </select>
              </div>
              <div>
                <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700">Prioridade*</label>
                <select name="prioridade" value={formData.prioridade} onChange={handleChange} required
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" >
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>
              <div>
                <label htmlFor="inicio_desejado" className="block text-sm font-medium text-gray-700">Início Desejado</label>
                <input type="date" name="inicio_desejado" value={formData.inicio_desejado} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
          </div>

          <div>
            <label htmlFor="descricao_problema" className="block text-sm font-medium text-gray-700">Descrição do Problema*</label>
            <textarea name="descricao_problema" value={formData.descricao_problema} onChange={handleChange} rows={4} required
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors disabled:opacity-50" >
              Cancelar
            </button>
            <button type="submit" disabled={loading || loadingClientes}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50" >
              {loading ? 'Salvando...' : 'Salvar Chamado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAdicionarSuporte;