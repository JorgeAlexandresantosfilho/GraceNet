import { useState, useEffect } from 'react';
import { FileText, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface Invoice {
    id_fatura: number;
    valor: string; // Comes as string from decimal
    data_vencimento: string;
    status: 'Pendente' | 'Pago' | 'Atrasado' | 'Cancelado';
    link_boleto: string;
}

export default function ClientInvoices() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await api.get('/client/invoices');
            setInvoices(response.data);
        } catch (error) {
            console.error('Erro ao buscar faturas:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pago': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pendente': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Atrasado': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Pago': return <CheckCircle className="w-4 h-4" />;
            case 'Pendente': return <Clock className="w-4 h-4" />;
            case 'Atrasado': return <AlertCircle className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const filteredInvoices = invoices.filter(invoice => {
        if (filter === 'all') return true;
        if (filter === 'pending') return invoice.status === 'Pendente' || invoice.status === 'Atrasado';
        if (filter === 'paid') return invoice.status === 'Pago';
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Minhas Faturas</h1>
                    <p className="text-slate-500">Gerencie seus pagamentos e 2ª via de boletos</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'all'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'pending'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        Pendentes
                    </button>
                    <button
                        onClick={() => setFilter('paid')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'paid'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        Pagas
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredInvoices.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">Nenhuma fatura encontrada</h3>
                            <p className="text-slate-500">Você não possui faturas com este filtro.</p>
                        </div>
                    ) : (
                        filteredInvoices.map((invoice) => (
                            <div
                                key={invoice.id_fatura}
                                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] hover:shadow-lg transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${invoice.status === 'Pago' ? 'bg-green-50 text-green-600' :
                                            invoice.status === 'Atrasado' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-slate-900">Fatura #{invoice.id_fatura.toString().padStart(6, '0')}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(invoice.status)}`}>
                                                    {getStatusIcon(invoice.status)}
                                                    {invoice.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                Vencimento: {new Date(invoice.data_vencimento).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm text-slate-500 mb-1">Valor Total</p>
                                            <p className="text-xl font-bold text-slate-900">
                                                {Number(invoice.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </p>
                                        </div>

                                        {invoice.status !== 'Pago' && (
                                            <a
                                                href={invoice.link_boleto}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-colors"
                                                title="Baixar Boleto"
                                            >
                                                <Download className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
