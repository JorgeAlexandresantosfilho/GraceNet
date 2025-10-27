// Em: src/components/ModalAdicionarCliente.tsx
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Adicionar Novo Cliente</h2>
        
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Inputs do Formulário */}
          {/* Note que os 'name' dos inputs são os nomes das colunas do backend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nome_completo" className="block text-sm font-medium text-gray-700">Nome Completo*</label>
              <input type="text" name="nome_completo" value={formData.nome_completo} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF*</label>
              <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700">Data Nasc.* (AAAA-MM-DD)</label>
              <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="rg" className="block text-sm font-medium text-gray-700">RG (Opcional)</label>
              <input type="text" name="rg" value={formData.rg} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone*</label>
              <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email*</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="plano" className="block text-sm font-medium text-gray-700">Plano*</label>
              <input type="text" name="plano" value={formData.plano} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="vencimento" className="block text-sm font-medium text-gray-700">Dia Vencimento* (ex: 10)</label>
              <input type="number" name="vencimento" value={formData.vencimento} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status*</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2" >
                <option value={1}>Ativo</option>
                <option value={0}>Inativo</option>
              </select>
            </div>
            
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg" >
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" >
              {loading ? 'Salvando...' : 'Salvar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAdicionarCliente;