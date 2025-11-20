import { useState } from 'react';
import type { Cliente } from '../types';
import { createCliente } from '../services/api';

interface ModalAdicionarClienteProps {
  onClose: () => void;
  onSave: (novoCliente: Cliente) => void;
}

// Define o estado inicial do formulário
const estadoInicialForm = {
  cpf: "",
  nome_completo: "",
  data_nascimento: "",
  rg: "",
  telefone: "",
  email: "",
  cep: "",
  rua: "",
  numero: "",
  plano: "",
  vencimento: "",
  status: 1, // Começa como Ativo (1)
};

const ModalAdicionarCliente: React.FC<ModalAdicionarClienteProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState(estadoInicialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Converte status para número se for o select
    const valorFinal = type === 'select-one' && name === 'status' ? parseInt(value) : value;

    setFormData(prev => ({
      ...prev,
      [name]: valorFinal,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // O formData já está no formato do backend (ex: nome_completo)
    try {
      const novoCliente = await createCliente(formData);
      onSave(novoCliente); // Envia o novo cliente de volta para a lista e fecha
    } catch (err: any) {
      // Mostra o erro de validação do backend (ex: "Campos obrigatórios...")
      setError(err.message || "Falha ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Adicionar Novo Cliente</h2>

        {error && <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg mb-4 border border-red-200 dark:border-red-800">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Inputs do Formulário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="nome_completo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo*</label>
              <input type="text" name="nome_completo" value={formData.nome_completo} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
            </div>
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CPF*</label>
              <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
            </div>
            <div>
              <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Nasc.*</label>
              <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
            </div>
            <div>
              <label htmlFor="rg" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RG (Opcional)</label>
              <input type="text" name="rg" value={formData.rg} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone*</label>
              <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email*</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
            </div>
            <div>
              <label htmlFor="plano" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plano*</label>
              <input type="text" name="plano" value={formData.plano} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
            </div>
            <div>
              <label htmlFor="vencimento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dia Vencimento*</label>
              <input type="number" name="vencimento" value={formData.vencimento} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status*</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" >
                <option value={1}>Ativo</option>
                <option value={0}>Inativo</option>
              </select>
            </div>

          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={onClose} disabled={loading}
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 font-medium" >
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium shadow-lg shadow-blue-600/20" >
              {loading ? 'Salvando...' : 'Salvar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAdicionarCliente;