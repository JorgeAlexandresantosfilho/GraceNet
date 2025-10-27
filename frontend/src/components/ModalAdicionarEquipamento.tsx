import { useState } from 'react';
import type { Equipamento } from '../types'; // Importa o tipo
import { createEquipamento } from '../services/api'; // Importa a função da API

interface ModalAdicionarEquipamentoProps {
  onClose: () => void;
  onSave: (novoEquip: Equipamento) => void; // Callback para atualizar a lista
}

// Define o estado inicial (precisa bater com os campos do backend)
// Os campos da interface Equipamento são 'name', 'type', 'model', 'serialNumber', 'status', 'location'
// Os campos do backend são 'tipo', 'modelo', 'fabricante', 'numero_serie', 'mac_adress', 'ip_gerenciado', 'firmware', 'status', 'localizacao'
const estadoInicialForm = {
    tipo: "",
    modelo: "",
    fabricante: "", // Campo do backend
    numero_serie: "", // Campo do backend (identificador principal!)
    mac_adress: "", // Campo do backend (opcional?)
    ip_gerenciado: "", // Campo do backend (opcional?)
    firmware: "", // Campo do backend (opcional?)
    status: "Disponível", // Começa como Disponível
    localizacao: "", // Campo do backend
};

const ModalAdicionarEquipamento: React.FC<ModalAdicionarEquipamentoProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState(estadoInicialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação simples (Número de Série é crucial)
    if (!formData.numero_serie) {
        setError("O Número de Série é obrigatório.");
        setLoading(false);
        return;
    }
     if (!formData.tipo || !formData.modelo || !formData.status || !formData.localizacao) {
        setError("Campos Tipo, Modelo, Status e Localização são obrigatórios.");
        setLoading(false);
        return;
     }


    try {
      // O formData já está no formato que o backend espera
      const novoEquipamento = await createEquipamento(formData);
      onSave(novoEquipamento); // Envia o novo equipamento (retornado pela API) para a lista
    } catch (err: any) {
      setError(err.message || "Falha ao salvar. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl max-h-screen overflow-y-auto"> {/* Aumentei max-w-xl */}
        <h2 className="text-2xl font-bold mb-4">Adicionar Novo Equipamento</h2>

        {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Linha 1: Tipo, Modelo, Fabricante */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo*</label>
                <input type="text" name="tipo" value={formData.tipo} onChange={handleChange} required
                 className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
             </div>
             <div>
               <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">Modelo*</label>
               <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} required
                 className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
             </div>
             <div>
                <label htmlFor="fabricante" className="block text-sm font-medium text-gray-700">Fabricante</label>
                <input type="text" name="fabricante" value={formData.fabricante} onChange={handleChange}
                 className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
             </div>
          </div>

           {/* Linha 2: Número Série, MAC Address, IP Gerenciado */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="numero_serie" className="block text-sm font-medium text-gray-700">Número de Série*</label>
                <input type="text" name="numero_serie" value={formData.numero_serie} onChange={handleChange} required
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="mac_adress" className="block text-sm font-medium text-gray-700">MAC Address</label>
                <input type="text" name="mac_adress" value={formData.mac_adress} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="ip_gerenciado" className="block text-sm font-medium text-gray-700">IP Gerenciado</label>
                <input type="text" name="ip_gerenciado" value={formData.ip_gerenciado} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
           </div>

           {/* Linha 3: Firmware, Status, Localização */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label htmlFor="firmware" className="block text-sm font-medium text-gray-700">Firmware</label>
                    <input type="text" name="firmware" value={formData.firmware} onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                 </div>
                 <div>
                   <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status*</label>
                   <select name="status" value={formData.status} onChange={handleChange} required
                     className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" >
                     <option value="Disponível">Disponível</option>
                     <option value="Em uso">Em uso</option>
                     <option value="Manutenção">Manutenção</option>
                     <option value="Defeito">Defeito</option>
                   </select>
                 </div>
                  <div>
                    <label htmlFor="localizacao" className="block text-sm font-medium text-gray-700">Localização*</label>
                    <input type="text" name="localizacao" value={formData.localizacao} onChange={handleChange} required
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                 </div>
            </div>


          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors disabled:opacity-50" >
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50" >
              {loading ? 'Salvando...' : 'Salvar Equipamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAdicionarEquipamento;