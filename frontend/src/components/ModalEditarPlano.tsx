import { useState, useEffect } from 'react';
import type { Plano } from '../types';
import { updatePlano } from '../services/api';

interface ModalEditarPlanoProps {
  plano: Plano;
  onClose: () => void;
  onSave: (planoAtualizado: Plano) => void;
}

// <<< --- MUDANÇA DE ESTRATÉGIA --- >>>
// Exporta como 'const' (nomeada) para evitar erros de 'default'
export const ModalEditarPlano = ({ plano, onClose, onSave }: ModalEditarPlanoProps) => {
  const [formData, setFormData] = useState<Plano>(plano);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(plano);
  }, [plano]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // <<< --- CORREÇÃO AQUI --- >>>
    // Adicionado 'e.target.' antes de 'type'
    let valorFinal: string | number = value;
    if (name === 'preco' && e.target.type === 'number') {
       const parsedValue = parseFloat(value);
       valorFinal = isNaN(parsedValue) ? 0 : parsedValue;
    }
    if (name === 'status' && (value === 'Ativo' || value === 'Inativo')) {
        valorFinal = value;
    }
    // <<< --- FIM DA CORREÇÃO --- >>>

    setFormData(prev => ({
      ...prev,
      [name]: valorFinal as any,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.preco < 0) {
        setError("O preço não pode ser negativo.");
        setLoading(false);
        return;
    }

    try {
      const planoAtualizadoApi = await updatePlano(formData.id, formData);
      onSave(planoAtualizadoApi);
    } catch (err: any) {
      setError(err.message || "Falha ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Editar Plano: {plano.nome}</h2>
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

// Não há 'export default'