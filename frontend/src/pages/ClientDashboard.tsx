import React, { useEffect, useState } from 'react';
import { Wifi, Download, Clock, AlertCircle, CheckCircle2, ArrowRight, Activity, ShieldCheck, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardData {
    client: {
        nome: string;
        plano: string;
        status: number;
        vencimento: string;
    };
    invoices: Array<{
        id_fatura: number;
        data_vencimento: string;
        valor: string;
        status: string;
        link_boleto: string;
    }>;
    tickets: any[];
}

const ClientDashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('authToken');
                if (!token) {
                    navigate('/area-cliente/login');
                    return;
                }

                const response = await fetch('http://localhost:3000/ClientPortal/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const jsonData = await response.json();
                    setData(jsonData);
                } else {
                    setError('Falha ao carregar dados. Por favor, faça login novamente.');
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Erro de conexão com o servidor.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Ops! Algo deu errado.</h2>
                <p className="text-slate-500 mb-6">{error}</p>
                <button
                    onClick={() => navigate('/area-cliente/login')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Voltar para o Login
                </button>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Olá, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{data.client.nome.split(' ')[0]}</span>!
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Bem-vindo ao seu painel de controle.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
                    <div className={`w-2.5 h-2.5 rounded-full ${data.client.status === 1 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-sm font-semibold text-slate-700">
                        {data.client.status === 1 ? 'Sistema Operacional' : 'Serviço Suspenso'}
                    </span>
                </div>
            </header>

            {/* Hero Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-8 md:p-10 text-white shadow-2xl shadow-blue-900/20 group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full -ml-10 -mb-10 blur-2xl" />

                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-sm font-medium mb-4">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Plano Ativo</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black mb-2 tracking-tight">{data.client.plano}</h2>
                        <p className="text-blue-100 text-lg font-medium opacity-90">Fibra Óptica de Alta Performance</p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                                <Wifi className="w-6 h-6 text-blue-200" />
                                <div>
                                    <p className="text-xs text-blue-200 uppercase tracking-wider font-bold">Status</p>
                                    <p className="font-bold text-lg">Conectado</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                                <Activity className="w-6 h-6 text-green-300" />
                                <div>
                                    <p className="text-xs text-blue-200 uppercase tracking-wider font-bold">Latência</p>
                                    <p className="font-bold text-lg">4ms</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex justify-end">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full animate-pulse" />
                            <Wifi className="w-48 h-48 text-white/20 relative z-10" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Invoices Section */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Faturas Recentes</h3>
                            <p className="text-sm text-slate-500 mt-1">Gerencie seus pagamentos</p>
                        </div>
                        <button
                            onClick={() => navigate('/area-cliente/faturas')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 hover:gap-2 transition-all"
                        >
                            Ver histórico <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.invoices.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-slate-500">Nenhuma fatura encontrada.</p>
                            </div>
                        ) : (
                            data.invoices.map((invoice) => (
                                <div key={invoice.id_fatura} className="group flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${invoice.status === 'Pago'
                                            ? 'bg-green-100 text-green-600 group-hover:bg-green-200'
                                            : invoice.status === 'Atrasado' ? 'bg-red-100 text-red-600 group-hover:bg-red-200' : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200'
                                            }`}>
                                            {invoice.status === 'Pago' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-lg">Fatura #{invoice.id_fatura}</p>
                                            <p className="text-sm text-slate-500 font-medium">Vence em {new Date(invoice.data_vencimento).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-slate-900 text-lg">
                                            {Number(invoice.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </p>
                                        {invoice.status !== 'Pago' && (
                                            <a
                                                href={invoice.link_boleto}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs font-bold text-blue-600 hover:text-blue-700 mt-1 flex items-center justify-end gap-1.5 bg-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                Baixar PDF
                                            </a>
                                        )}
                                        {invoice.status === 'Pago' && (
                                            <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-lg mt-1 inline-block">
                                                Paga
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-full">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Acesso Rápido</h3>

                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/area-cliente/suporte')}
                                className="w-full p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Abrir Chamado</p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Relatar problema técnico</p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/area-cliente/speedtest')}
                                className="w-full p-4 rounded-2xl border border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all group text-left flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                    <Wifi className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Teste de Velocidade</p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Verificar sua conexão</p>
                                </div>
                            </button>
                        </div>

                        <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                            <p className="text-sm text-slate-500 font-medium mb-2">Precisa de ajuda urgente?</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">0800 123 4567</p>
                            <p className="text-xs text-slate-400 mt-2">Disponível 24h por dia</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
