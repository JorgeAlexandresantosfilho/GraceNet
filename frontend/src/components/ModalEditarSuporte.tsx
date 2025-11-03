import { useState, useEffect } from 'react';
import type { TicketSuporte, Cliente } from '../types';
import { getSuporteTicketById, updateSuporteTicket, getClientes } from '../services/api';

interface ModalEditarSuporteProps {
  ticketId: number;
  onClose: () => void;
  onSave: (ticketAtualizado: TicketSuporte) => void;
}

// O estado do formulário agora usa os nomes do backend
interface EstadoFormEditar {
  titulo: string;
  descricao_problema: string;
  status: string;
  prioridade: string;
  id_cliente: number;
  inicio_desejado: string; // Formato YYYY-MM-DD
}

const ModalEditarSuporte: React.FC<ModalEditarSuporteProps> = ({ ticketId, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<EstadoFormEditar>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  
  // Carrega o ticket e a lista de clientes
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ticketData, clientesData] = await Promise.all([
          getSuporteTicketById(ticketId),
          getClientes()
        ]);
        
        setClientes(clientesData);
        
        // Encontra o ID do cliente
        const clienteDoTicket = clientesData.find(c => c.nomeCompleto === ticketData.cliente);
        const idClienteOriginal = clienteDoTicket ? clienteDoTicket.id : 0;
        
        // Preenche o formulário com os nomes do backend
        setFormData({
            titulo: ticketData.titulo,
            descricao_problema: ticketData.descricao, // 'descricao' (frontend) -> 'descricao_problema' (form)
            status: ticketData.status,
            prioridade: ticketData.prioridade,
            id_cliente: idClienteOriginal,
            inicio_desejado: (ticketData as any).inicio_desejado_input || "", // Pega o campo YYYY-MM-DD
        });

      } catch (err: any) {
        setError(err.message || "Falha ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, [ticketId]);

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
    if (!formData.id_cliente || formData.id_cliente === 0) {
        setError("Não foi possível salvar, dados do cliente faltando.");
        return;
    }

    setSaveLoading(true);
    setError(null);

    try {
       // <<< --- CORREÇÃO AQUI --- >>>
       // O payload já está no formato do backend
       const payload = {
           ...formData,
           inicio_desejado: formData.inicio_desejado || null, // Garante null se vazio
           id_tecnico: null // Backend aceita null
       };
        
       // O api.ts agora espera o payload direto
       const ticketAtualizado = await updateSuporteTicket(ticketId, payload);
       onSave(ticketAtualizado);

    } catch (err: any) {
      setError(err.message || "Falha ao salvar. Tente novamente.");
    } finally {
      setSaveLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">Carregando chamado...</div>
      </div>
    );
  }

  if (error && !formData.titulo) { // Se deu erro e não carregou
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={onClose} className="mt-4 bg-gray-300 px-4 py-2 rounded">Fechar</button>
        </div>
      </div>
    );
  }
  
  if (!formData.titulo) return null; // Se não tiver dados, não renderiza

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Atualizar Chamado #{ticketId}</h2>

        {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="id_cliente" className="block text-sm font-medium text-gray-700">Cliente*</label>
            <select 
              name="id_cliente" 
              value={formData.id_cliente || 0} // Usa o estado do ID
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
          </div>

          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título*</label>
            <input type="text" name="titulo" value={formData.titulo || ''} onChange={handleChange} required
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          {/* <<< --- CAMPO DE DATA ADICIONADO AQUI --- >>> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status*</label>
                <select name="status" value={formData.status || 'Aberto'} onChange={handleChange} required
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" >
                  <option value="Aberto">Aberto</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Resolvido">Resolvido</option>
                </select>
              </div>
              <div>
                <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700">Prioridade*</label>
                <select name="prioridade" value={formData.prioridade || 'Baixa'} onChange={handleChange} required
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" >
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>
              <div>
                <label htmlFor="inicio_desejado" className="block text-sm font-medium text-gray-700">Início Desejado</label>
                <input type="date" name="inicio_desejado" value={formData.inicio_desejado || ''} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
          </div>

          <div>
            <label htmlFor="descricao_problema" className="block text-sm font-medium text-gray-700">Descrição do Problema*</label>
            <textarea name="descricao_problema" value={formData.descricao_problema || ''} onChange={handleChange} rows={4} required
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} disabled={saveLoading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors disabled:opacity-50" >
              Cancelar
            </button>
            <button type="submit" disabled={saveLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50" >
              {saveLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarSuporte;