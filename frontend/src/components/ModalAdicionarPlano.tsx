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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Adicionar Novo Plano</h2>

        {error && <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg mb-4 border border-red-200 dark:border-red-800">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Plano*</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ex: Fibra 500 Mega" />
            </div>
            <div>
              <label htmlFor="velocidade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Velocidade*</label>
              <input type="text" name="velocidade" value={formData.velocidade} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ex: 500 Mbps" />
            </div>
            <div>
              <label htmlFor="preco" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preço* (R$)</label>
              <input type="number" name="preco" value={formData.preco} onChange={handleChange} required
                step="0.01" min="0"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status*</label>
              <select name="status" value={formData.status} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição* (Features)</label>
            <textarea name="descricao" value={formData.descricao} onChange={handleChange} rows={3} required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Separe as features por vírgula..." />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ex: Download 500MB, Upload 250MB, Wi-Fi 6 Grátis</p>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={onClose} disabled={loading}
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 font-medium" >
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium shadow-lg shadow-blue-600/20" >
              {loading ? 'Salvando...' : 'Salvar Plano'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAdicionarPlano;