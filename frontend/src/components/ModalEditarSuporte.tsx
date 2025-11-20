import { useState, useEffect } from 'react';
import type { TicketSuporte, Cliente, Tecnico } from '../types';
import { getSuporteTicketById, updateSuporteTicket, getClientes, getTecnicos } from '../services/api';

interface ModalEditarSuporteProps {
  ticketId: number;
  onClose: () => void;
  onSave: (ticketAtualizado: TicketSuporte) => void;
}

interface EstadoFormEditar {
  titulo: string;
  descricao_problema: string;
  status: string;
  prioridade: string;
  id_cliente: number;
  id_tecnico: number | null;
  inicio_desejado: string;
}

const ModalEditarSuporte: React.FC<ModalEditarSuporteProps> = ({ ticketId, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<EstadoFormEditar>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ticketData, clientesData, tecnicosData] = await Promise.all([
          getSuporteTicketById(ticketId),
          getClientes(),
          getTecnicos()
        ]);

        setClientes(clientesData);
        setTecnicos(tecnicosData);

        const clienteDoTicket = clientesData.find(c => c.nomeCompleto === ticketData.cliente);
        const idClienteOriginal = clienteDoTicket ? clienteDoTicket.id : 0;

        setFormData({
          titulo: ticketData.titulo,
          descricao_problema: ticketData.descricao,
          status: ticketData.status,
          prioridade: ticketData.prioridade,
          id_cliente: idClienteOriginal,
          id_tecnico: ticketData.id_tecnico || null,
          inicio_desejado: (ticketData as any).inicio_desejado_input || "",
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
    const valorFinal = (name === 'id_cliente' || name === 'id_tecnico') ? parseInt(value) || null : value;

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
      const payload = {
        ...formData,
        inicio_desejado: formData.inicio_desejado || null,
      };

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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-gray-900 dark:text-white">Carregando chamado...</div>
      </div>
    );
  }

  if (error && !formData.titulo) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={onClose} className="mt-4 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded">Fechar</button>
        </div>
      </div>
    );
  }

  if (!formData.titulo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Atualizar Chamado #{ticketId}</h2>

        {error && <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg mb-4 border border-red-200 dark:border-red-800">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label htmlFor="id_cliente" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente*</label>
            <select
              name="id_cliente"
              value={formData.id_cliente || 0}
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
          </div>

          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título*</label>
            <input type="text" name="titulo" value={formData.titulo || ''} onChange={handleChange} required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status*</label>
              <select name="status" value={formData.status || 'Aberto'} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" >
                <option value="Aberto">Aberto</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Resolvido">Resolvido</option>
              </select>
            </div>
            <div>
              <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridade*</label>
              <select name="prioridade" value={formData.prioridade || 'Baixa'} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="id_tecnico" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Atribuir Técnico</label>
              <select
                name="id_tecnico"
                value={formData.id_tecnico || 0}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value={0}>Nenhum técnico atribuído</option>
                {tecnicos.map(tec => (
                  <option key={tec.id_tecnico} value={tec.id_tecnico}>
                    {tec.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="inicio_desejado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Início Desejado</label>
              <input type="date" name="inicio_desejado" value={formData.inicio_desejado || ''} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
            </div>
          </div>

          <div>
            <label htmlFor="descricao_problema" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição do Problema*</label>
            <textarea name="descricao_problema" value={formData.descricao_problema || ''} onChange={handleChange} rows={4} required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={onClose} disabled={saveLoading}
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 font-medium" >
              Cancelar
            </button>
            <button type="submit" disabled={saveLoading}
              className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium shadow-lg shadow-blue-600/20" >
              {saveLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarSuporte;