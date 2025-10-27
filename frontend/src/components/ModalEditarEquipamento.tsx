import { useState, useEffect } from 'react';
import type { Equipamento } from '../types';
// Importa funções get by serial e update
import { getEquipamentoBySerial, updateEquipamento } from '../services/api';

interface ModalEditarEquipamentoProps {
  serialNumber: string; // Recebe o serial number
  onClose: () => void;
  onSave: (equipAtualizado: Equipamento) => void;
}

const ModalEditarEquipamento: React.FC<ModalEditarEquipamentoProps> = ({ serialNumber, onClose, onSave }) => {
  // Estado para os dados do formulário
  const [formData, setFormData] = useState<Partial<Equipamento> & { fabricante?: string, mac_adress?: string, ip_gerenciado?: string, firmware?: string }>({});
  const [loading, setLoading] = useState(true); // Começa carregando
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false); // Loading para o botão salvar

  // Busca os dados do equipamento ao abrir o modal
  useEffect(() => {
    const carregarEquipamento = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getEquipamentoBySerial(serialNumber);
        // Preenche o formulário com os dados recebidos
        // Inclui os campos extras que podem ter vindo da API
        setFormData({
            type: data.type,
            model: data.model,
            fabricante: (data as any).fabricante || '', // Acessa campo extra
            serialNumber: data.serialNumber,
            mac_adress: (data as any).mac_adress || '', // Acessa campo extra
            ip_gerenciado: (data as any).ip_gerenciado || '', // Acessa campo extra
            firmware: (data as any).firmware || '', // Acessa campo extra
            status: data.status,
            location: data.location,
        });
      } catch (err: any) {
        setError(err.message || "Falha ao carregar dados do equipamento.");
      } finally {
        setLoading(false);
      }
    };
    carregarEquipamento();
  }, [serialNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true); // Usa o loading de salvar
    setError(null);

     // Validação simples
     if (!formData.type || !formData.model || !formData.status || !formData.location) {
        setError("Campos Tipo, Modelo, Status e Localização são obrigatórios.");
        setSaveLoading(false);
        return;
     }

    try {
      // Envia apenas os dados do formulário (que são parciais) para a API
      const dadosParaApi = { ...formData };
      await updateEquipamento(serialNumber, dadosParaApi);

      // Constrói o objeto Equipamento completo para retornar (melhor seria buscar novamente, mas simplificamos)
      const equipamentoAtualizado: Equipamento = {
        id: formData.serialNumber || serialNumber, // Usa o serial como ID
        name: formData.fabricante ? `${formData.fabricante} ${formData.model}` : formData.model || '',
        type: formData.type || '',
        model: formData.model || '',
        serialNumber: formData.serialNumber || serialNumber,
        status: formData.status || 'Desconhecido',
        location: formData.location || '',
        customer: null, // Ainda não temos essa info
        installDate: null,
        lastMaintenance: null,
      };

      onSave(equipamentoAtualizado); // Envia o objeto atualizado para a lista
    } catch (err: any) {
      setError(err.message || "Falha ao salvar. Tente novamente.");
    } finally {
      setSaveLoading(false); // Desativa o loading de salvar
    }
  };

  // Renderização enquanto carrega os dados
   if (loading) {
     return (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white p-6 rounded-lg shadow-xl">Carregando dados...</div>
       </div>
     );
   }

   // Renderização se der erro ao carregar
   if (error && !formData.serialNumber) { // Se deu erro e não carregou nada
     return (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white p-6 rounded-lg shadow-xl">
           <p className="text-red-500 mb-4">{error}</p>
           <button onClick={onClose} className="mt-4 bg-gray-300 px-4 py-2 rounded">Fechar</button>
         </div>
       </div>
     );
   }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Editar Equipamento (S/N: {serialNumber})</h2>

        {/* Mostra erro de salvamento */}
        {error && !loading && <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">

           {/* Linha 1: Tipo, Modelo, Fabricante */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                 <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo*</label>
                 <input type="text" name="type" value={formData.type || ''} onChange={handleChange} required
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modelo*</label>
                <input type="text" name="model" value={formData.model || ''} onChange={handleChange} required
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                 <label htmlFor="fabricante" className="block text-sm font-medium text-gray-700">Fabricante</label>
                 <input type="text" name="fabricante" value={formData.fabricante || ''} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
           </div>

            {/* Linha 2: Número Série (Read Only), MAC Address, IP Gerenciado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                 <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">Número de Série</label>
                 <input type="text" name="serialNumber" value={formData.serialNumber || ''} readOnly disabled
                   className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 bg-gray-100 text-gray-500" />
               </div>
               <div>
                 <label htmlFor="mac_adress" className="block text-sm font-medium text-gray-700">MAC Address</label>
                 <input type="text" name="mac_adress" value={formData.mac_adress || ''} onChange={handleChange}
                   className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
               </div>
               <div>
                 <label htmlFor="ip_gerenciado" className="block text-sm font-medium text-gray-700">IP Gerenciado</label>
                 <input type="text" name="ip_gerenciado" value={formData.ip_gerenciado || ''} onChange={handleChange}
                   className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
               </div>
            </div>

            {/* Linha 3: Firmware, Status, Localização */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                     <label htmlFor="firmware" className="block text-sm font-medium text-gray-700">Firmware</label>
                     <input type="text" name="firmware" value={formData.firmware || ''} onChange={handleChange}
                     className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status*</label>
                    <select name="status" value={formData.status || 'Disponível'} onChange={handleChange} required
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" >
                      <option value="Disponível">Disponível</option>
                      <option value="Em uso">Em uso</option>
                      <option value="Manutenção">Manutenção</option>
                      <option value="Defeito">Defeito</option>
                    </select>
                  </div>
                   <div>
                     <label htmlFor="location" className="block text-sm font-medium text-gray-700">Localização*</label>
                     <input type="text" name="location" value={formData.location || ''} onChange={handleChange} required
                     className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
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

export default ModalEditarEquipamento;