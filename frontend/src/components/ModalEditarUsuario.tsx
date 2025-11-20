import { useState, useEffect } from 'react';
import type { Usuario, PerfilAcesso } from '../types';
import { getUserById, updateUser, getPerfisAcesso } from '../services/api';

interface ModalEditarUsuarioProps {
  usuarioId: number;
  onClose: () => void;
  onSave: (usuarioAtualizado: Usuario) => void;
}

const ModalEditarUsuario: React.FC<ModalEditarUsuarioProps> = ({ usuarioId, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Usuario>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const [perfis, setPerfis] = useState<PerfilAcesso[]>([]);
  const [loadingPerfis, setLoadingPerfis] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      setLoadingPerfis(true);
      setError(null);
      try {
        // Busca o usuário e os perfis em paralelo
        const [dataUsuario, dataPerfis] = await Promise.all([
          getUserById(usuarioId),
          getPerfisAcesso()
        ]);

        setFormData(dataUsuario);
        setPerfis(dataPerfis);

      } catch (err: any) {
        setError(err.message || "Falha ao carregar dados do usuário.");
      } finally {
        setLoading(false);
        setLoadingPerfis(false);
      }
    };
    carregarDados();
  }, [usuarioId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const valorFinal = name === 'perfil_id' ? (value ? parseInt(value) : null) : value;

    setFormData(prev => ({
      ...prev,
      [name]: valorFinal,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError(null);

    try {
      await updateUser(usuarioId, formData);

      // Precisamos recarregar o usuário para ter certeza que os dados estão atualizados
      const usuarioAtualizado = await getUserById(usuarioId);
      onSave(usuarioAtualizado); // Envia o usuário completo

    } catch (err: any) {
      setError(err.message || "Falha ao salvar. Verifique se o Login ou Matrícula já existem.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-gray-900 dark:text-white">Carregando usuário...</div>
      </div>
    );
  }

  if (error && !formData.usuario_id) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={onClose} className="mt-4 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded">Fechar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Editar Usuário: {formData.nome_completo}</h2>

        {error && <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg mb-4 border border-red-200 dark:border-red-800">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label htmlFor="nome_completo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo*</label>
            <input type="text" name="nome_completo" value={formData.nome_completo || ''} onChange={handleChange} required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matrícula*</label>
              <input type="text" name="matricula" value={formData.matricula || ''} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
            </div>
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Login*</label>
              <input type="text" name="login" value={formData.login || ''} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="perfil_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Perfil*</label>
              <select
                name="perfil_id"
                value={formData.perfil_id || 0}
                onChange={handleChange}
                required
                disabled={loadingPerfis}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value={0} disabled>
                  {loadingPerfis ? 'Carregando...' : 'Selecione...'}
                </option>
                {perfis.map(perfil => (
                  <option key={perfil.perfil_id} value={perfil.perfil_id}>
                    {perfil.nome_perfil}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status_usuario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status*</label>
              <select name="status_usuario" value={formData.status_usuario || 'Ativo'} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Bloqueado">Bloqueado</option>
              </select>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
            Nota: A redefinição de senha deve ser feita por um sistema de "Esqueci minha senha".
          </p>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={onClose} disabled={saveLoading}
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 font-medium" >
              Cancelar
            </button>
            <button type="submit" disabled={saveLoading || loadingPerfis}
              className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium shadow-lg shadow-blue-600/20" >
              {saveLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarUsuario;