import React, { useEffect, useState } from 'react';
import { Wifi, Download, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DashboardData {
    client: {
        nome: string;
        plano: string;
        status: number;
        vencimento: string;
    };
    invoices: Array<{
        id: number;
        vencimento: string;
        valor: number;
        status: string;
    }>;
    tickets: any[];
}

const ClientDashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('clientToken');
                const response = await fetch('http://localhost:3000/ClientPortal/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const jsonData = await response.json();
                    setData(jsonData);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Olá, {data.client.nome.split(' ')[0]}!</h1>
                <p className="text-slate-500 mt-1">Bem-vindo à sua área do cliente.</p>
            </header>

            {/* Status Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-sm">
                                {data.client.status === 1 ? 'Ativo' : 'Inativo'}
                            </span>
                            <span className="text-blue-100 text-sm">Vencimento dia {data.client.vencimento}</span>
                        </div>
                        <h2 className="text-4xl font-bold mb-1">{data.client.plano}</h2>
                        <p className="text-blue-100">Sua internet está funcionando perfeitamente</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <Wifi className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-blue-100">Status da Conexão</p>
                            <p className="font-semibold text-lg">Online</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Invoices */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Últimas Faturas</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Ver todas</button>
                    </div>

                    <div className="space-y-4">
                        {data.invoices.map((invoice) => (
                            <div key={invoice.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${invoice.status === 'Pago' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                        {invoice.status === 'Pago' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">Fatura #{invoice.id}</p>
                                        <p className="text-sm text-slate-500">Vence em {new Date(invoice.vencimento).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">R$ {invoice.valor.toFixed(2)}</p>
                                    {invoice.status !== 'Pago' && (
                                        <button className="text-xs text-blue-600 hover:underline mt-1 flex items-center justify-end gap-1">
                                            <Download className="w-3 h-3" />
                                            2ª Via
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions / Support */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Precisa de Ajuda?</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <p className="font-medium text-slate-900">Abrir Chamado</p>
                            <p className="text-xs text-slate-500 mt-1">Relatar problema técnico</p>
                        </button>

                        <button className="p-4 rounded-xl border border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all group text-left">
                            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Wifi className="w-6 h-6" />
                            </div>
                            <p className="font-medium text-slate-900">Teste de Velocidade</p>
                            <p className="text-xs text-slate-500 mt-1">Verificar conexão</p>
                        </button>
                    </div>

                    <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                        <p className="text-sm text-slate-600 text-center">
                            Atendimento telefônico: <span className="font-bold text-slate-900">0800 123 4567</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
