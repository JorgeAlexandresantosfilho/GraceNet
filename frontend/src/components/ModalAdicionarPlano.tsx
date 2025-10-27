import { useState } from 'react';
import type { Plano } from '../types';
import { createPlano } from '../services/api';

interface ModalAdicionarPlanoProps {
  onClose: () => void;
  onSave: (planoAtualizado: Plano) => void;
}

// Omitimos campos que são gerados (id) ou calculados (clientes, features)
type DadosNovoPlano = Omit<Plano, 'id' | 'clientes' | 'features'>;

const estadoInicial: DadosNovoPlano = {
  nome: "",
  velocidade: "",
  preco: 0.0,
  descricao: "",
  status: "Ativo", // Começa como Ativo por padrão
};

const ModalAdicionarPlano: React.FC<ModalAdicionarPlanoProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState<DadosNovoPlano>(estadoInicial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    let valorFinal: string | number = value;

    if (name === 'preco' && type === 'number') {
        const parsedValue = parseFloat(value);
        valorFinal = isNaN(parsedValue) ? 0 : parsedValue;
    }
    // Garante que status seja 'Ativo' ou 'Inativo'
    if (name === 'status' && (value === 'Ativo' || value === 'Inativo')) {
        valorFinal = value;
    }


    setFormData(prev => ({
      ...prev,
      [name]: valorFinal as any, // Usa 'as any' para simplificar a tipagem aqui
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação simples de preço
    if (formData.preco < 0) {
        setError("O preço não pode ser negativo.");
        setLoading(false);
        return;
    }

    try {
      const novoPlano = await createPlano(formData);
      onSave(novoPlano); // Envia o novo plano de volta para a lista
    } catch (err: any) {
      setError(err.message || "Falha ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Adicionar Novo Plano</h2>

        {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome do Plano*</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="velocidade" className="block text-sm font-medium text-gray-700">Velocidade* (ex: 100 Mbps)</label>
              <input type="text" name="velocidade" value={formData.velocidade} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="preco" className="block text-sm font-medium text-gray-700">Preço* (R$)</label>
              <input type="number" name="preco" value={formData.preco} onChange={handleChange} required
                step="0.01" min="0"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status*</label>
              <select name="status" value={formData.status} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição* (Usada para Features)</label>
            <textarea name="descricao" value={formData.descricao} onChange={handleChange} rows={3} required
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
            <p className="text-xs text-gray-500 mt-1">Separe as features por vírgula (ex: Download 50MB, Upload 25MB).</p>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors disabled:opacity-50" >
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50" >
              {loading ? 'Salvando...' : 'Salvar Plano'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAdicionarPlano; // Garante export default