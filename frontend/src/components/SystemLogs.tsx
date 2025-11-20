import React, { useEffect, useState } from "react";
import { getSystemLogs } from "../services/api";
import type { Log } from "../types";
import { FileText, Search, AlertCircle } from "lucide-react";

const SystemLogs: React.FC = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        carregarLogs();
    }, []);

    const carregarLogs = async () => {
        try {
            setLoading(true);
            const dados = await getSystemLogs();
            setLogs(dados);
            setErro(null);
        } catch (err) {
            setErro("Falha ao carregar logs do sistema.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const logsFiltrados = logs.filter((log) =>
        log.descricao_acao.toLowerCase().includes(filtro.toLowerCase()) ||
        log.tabela_afetada.toLowerCase().includes(filtro.toLowerCase()) ||
        log.usuario_responsavel.toLowerCase().includes(filtro.toLowerCase())
    );

    const getCorAcao = (acao: string) => {
        switch (acao) {
            case "INSERÇÃO": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "ATUALIZAÇÃO": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "EXCLUSÃO": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <FileText className="w-8 h-8 text-blue-600" />
                        Logs do Sistema
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Histórico de atividades e alterações no banco de dados
                    </p>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por descrição, tabela ou usuário..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Tabela */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        Carregando logs...
                    </div>
                ) : erro ? (
                    <div className="p-8 text-center text-red-500 flex flex-col items-center gap-2">
                        <AlertCircle className="w-8 h-8" />
                        {erro}
                    </div>
                ) : logsFiltrados.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        Nenhum registro encontrado.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Data/Hora</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Ação</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Tabela</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Descrição</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Usuário (DB)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {logsFiltrados.map((log) => (
                                    <tr key={log.id_log} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                            {new Date(log.data_acao).toLocaleString('pt-BR')}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCorAcao(log.tipo_acao)}`}>
                                                {log.tipo_acao}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-700 dark:text-gray-200 font-medium">
                                            {log.tabela_afetada}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                                            {log.descricao_acao}
                                        </td>
                                        <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                                            {log.usuario_responsavel}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SystemLogs;
