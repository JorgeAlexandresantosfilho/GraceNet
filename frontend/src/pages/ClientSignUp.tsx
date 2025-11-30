import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Wifi } from 'lucide-react';

const ClientSignUp: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        nome_completo: '',
        cpf: '',
        rg: '',
        data_nascimento: '',
        telefone: '',
        email: '',
        cep: '',
        rua: '',
        numero: '',
        plano: searchParams.get('plano') || '',
        password: '',
        confirmPassword: ''
    });

    const plans = [
        { id: 'basico', name: 'Básico 300 MEGA', price: '89,90' },
        { id: 'gamer', name: 'Gamer 600 MEGA', price: '119,90' },
        { id: 'ultra', name: 'Ultra 1 GIGA', price: '199,90' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/ClientPortal/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    // Ensure date format matches backend expectation if needed
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStep(3); // Success
            } else {
                setError(data.message || 'Erro ao realizar cadastro.');
            }
        } catch (err) {
            setError('Erro de conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-6 shadow-lg shadow-blue-600/20">
                        <Wifi className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Assine GraceNet</h1>
                    <p className="text-lg text-slate-600">Você está a poucos passos da melhor conexão.</p>
                </div>

                {step === 3 ? (
                    <div className="bg-white rounded-2xl p-12 shadow-xl text-center max-w-lg mx-auto">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Cadastro Realizado!</h2>
                        <p className="text-slate-600 mb-8">
                            Seja bem-vindo à GraceNet. Sua conta foi criada com sucesso.
                            Nossa equipe entrará em contato em breve para agendar a instalação.
                        </p>
                        <button
                            onClick={() => navigate('/area-cliente/login')}
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Acessar Área do Cliente
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Progress Bar */}
                        <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</span>
                                <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-900' : 'text-slate-400'}`}>Plano</span>
                            </div>
                            <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                            <div className="flex items-center gap-2">
                                <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</span>
                                <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-900' : 'text-slate-400'}`}>Dados</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 md:p-12">
                            {error && (
                                <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-red-500" />
                                    {error}
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Escolha seu Plano</h2>
                                    <div className="grid gap-4">
                                        {plans.map((plan) => (
                                            <label key={plan.id} className={`relative flex items-center p-6 rounded-xl border-2 cursor-pointer transition-all ${formData.plano === plan.name ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-blue-200'}`}>
                                                <input
                                                    type="radio"
                                                    name="plano"
                                                    value={plan.name}
                                                    checked={formData.plano === plan.name}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-slate-900">{plan.name}</h3>
                                                    <p className="text-sm text-slate-500">Fibra Óptica</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm text-slate-400">R$</span>
                                                    <span className="text-xl font-bold text-slate-900">{plan.price}</span>
                                                    <span className="text-sm text-slate-400">/mês</span>
                                                </div>
                                                {formData.plano === plan.name && (
                                                    <div className="absolute top-4 right-4 w-4 h-4 bg-blue-600 rounded-full" />
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => formData.plano ? setStep(2) : setError('Selecione um plano para continuar.')}
                                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors mt-8 flex items-center justify-center gap-2"
                                    >
                                        Continuar
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Seus Dados Pessoais</h2>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                                                <input type="text" name="nome_completo" value={formData.nome_completo} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900" required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                                                <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900" placeholder="000.000.000-00" required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">RG</label>
                                                <input type="text" name="rg" value={formData.rg} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900" required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Data de Nascimento</label>
                                                <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900" required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                                                <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900" required />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900" required />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Endereço de Instalação</h2>
                                        <div className="grid md:grid-cols-4 gap-6">
                                            <div className="md:col-span-1">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">CEP</label>
                                                <input type="text" name="cep" value={formData.cep} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900" required />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Rua</label>
                                                <input type="text" name="rua" value={formData.rua} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900" required />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Número</label>
                                                <input type="text" name="numero" value={formData.numero} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900" required />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Segurança</h2>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Senha de Acesso</label>
                                                <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900" required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Senha</label>
                                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900" required />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="w-1/3 bg-slate-100 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors"
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-2/3 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                                        >
                                            {loading ? 'Processando...' : 'Finalizar Cadastro'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientSignUp;
