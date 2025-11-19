import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit, UserCog } from 'lucide-react';
import { getTecnicos, createTecnico, updateTecnico, deleteTecnico } from '../services/api';
import type { Tecnico } from '../types';

const TechnicianManagement = () => {
    const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [busca, setBusca] = useState("");

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTecnico, setEditingTecnico] = useState<Tecnico | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        nome: "",
        matricula: "",
        equipe: "",
        status: "Ativo"
    });

    useEffect(() => {
        carregarTecnicos();
    }, []);

    const carregarTecnicos = async () => {
        try {
            setLoading(true);
            const data = await getTecnicos();
            setTecnicos(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (tecnico?: Tecnico) => {
        if (tecnico) {
            setEditingTecnico(tecnico);
            setFormData({
                nome: tecnico.nome,
                matricula: tecnico.matricula,
                equipe: tecnico.equipe,
                status: tecnico.status
            });
        } else {
            setEditingTecnico(null);
            setFormData({ nome: "", matricula: "", equipe: "", status: "Ativo" });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTecnico(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTecnico) {
                await updateTecnico(editingTecnico.id_tecnico, formData as any);
            } else {
                await createTecnico(formData as any);
            }
            await carregarTecnicos();
            handleCloseModal();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Tem certeza que deseja excluir este técnico?")) {
            try {
                await deleteTecnico(id);
                await carregarTecnicos();
            } catch (err: any) {
                alert(err.message);
            }
        }
    };

    const tecnicosFiltrados = tecnicos.filter(t =>
        t.nome.toLowerCase().includes(busca.toLowerCase()) ||
        t.matricula.toLowerCase().includes(busca.toLowerCase()) ||
        t.equipe.toLowerCase().includes(busca.toLowerCase())
    );

    if (loading) return <div className="p-6">Carregando técnicos...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestão de Funcionários</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie técnicos e equipes de campo</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Novo Funcionário</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, matrícula ou equipe..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-white"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Matrícula</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Equipe</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {tecnicosFiltrados.map((tecnico) => (
                            <tr key={tecnico.id_tecnico} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                            <UserCog className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{tecnico.nome}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{tecnico.matricula}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{tecnico.equipe}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${tecnico.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                                            tecnico.status === 'Férias' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                        {tecnico.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleOpenModal(tecnico)} className="text-blue-600 hover:text-blue-900 mr-4">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(tecnico.id_tecnico)} className="text-red-600 hover:text-red-900">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {editingTecnico ? 'Editar Funcionário' : 'Novo Funcionário'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                                <input type="text" name="nome" value={formData.nome} onChange={handleChange} required
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 dark:bg-gray-700 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Matrícula</label>
                                <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} required
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 dark:bg-gray-700 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Equipe</label>
                                <input type="text" name="equipe" value={formData.equipe} onChange={handleChange} required
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 dark:bg-gray-700 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 dark:bg-gray-700 dark:text-white">
                                    <option value="Ativo">Ativo</option>
                                    <option value="Férias">Férias</option>
                                    <option value="Inativo">Inativo</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={handleCloseModal}
                                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-4 py-2 rounded-lg">
                                    Cancelar
                                </button>
                                <button type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TechnicianManagement;
