import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Shield, Zap, Phone, ArrowRight, Users, Globe } from 'lucide-react';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <Wifi className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                GraceNet
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#planos" className="text-slate-300 hover:text-white transition-colors">Planos</a>
                            <a href="#beneficios" className="text-slate-300 hover:text-white transition-colors">Benefícios</a>
                            <a href="#contato" className="text-slate-300 hover:text-white transition-colors">Contato</a>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/area-cliente/login')}
                                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                            >
                                <Users className="w-4 h-4" />
                                <span>Área do Cliente</span>
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold shadow-lg shadow-blue-600/20 transition-all"
                            >
                                Sou Colaborador
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-sm font-medium text-blue-300">Internet Fibra Óptica de Última Geração</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                            Conecte-se ao futuro com a <span className="text-blue-500">GraceNet</span>
                        </h1>

                        <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                            Experimente a verdadeira velocidade da fibra óptica. Jogos sem lag, streaming em 4K e downloads instantâneos.
                            Sua conexão nunca mais será a mesma.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="#planos"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-lg font-semibold shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                            >
                                Ver Planos
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <button
                                onClick={() => navigate('/area-cliente/login')}
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-lg font-semibold backdrop-blur-sm transition-all"
                            >
                                Já sou Cliente
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="beneficios" className="py-20 bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors group">
                            <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Ultra Velocidade</h3>
                            <p className="text-slate-400">Tecnologia de ponta para garantir a máxima velocidade em seus downloads e uploads.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors group">
                            <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-7 h-7 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Segurança Total</h3>
                            <p className="text-slate-400">Navegue com tranquilidade. Nossa rede possui proteção avançada contra ameaças.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-colors group">
                            <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Globe className="w-7 h-7 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Estabilidade 24/7</h3>
                            <p className="text-slate-400">Rede redundante e monitoramento constante para você nunca ficar desconectado.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Plans Section */}
            <section id="planos" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Escolha o plano ideal para você</h2>
                        <p className="text-slate-400">Sem fidelidade, sem taxas escondidas. Apenas internet de qualidade.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Plan 1 */}
                        <div className="p-8 rounded-2xl bg-slate-800 border border-white/10 hover:border-blue-500/50 transition-all relative group">
                            <h3 className="text-xl font-medium text-slate-300 mb-2">Básico</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold">300</span>
                                <span className="text-xl text-blue-400 font-bold">MEGA</span>
                            </div>
                            <div className="mb-8">
                                <span className="text-sm text-slate-400">R$</span>
                                <span className="text-4xl font-bold text-white">89</span>
                                <span className="text-sm text-slate-400">,90/mês</span>
                            </div>
                            <ul className="space-y-4 mb-8 text-slate-300">
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center"><ArrowRight className="w-3 h-3 text-blue-400" /></div>
                                    Instalação Grátis
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center"><ArrowRight className="w-3 h-3 text-blue-400" /></div>
                                    Wi-Fi 5 Dual Band
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center"><ArrowRight className="w-3 h-3 text-blue-400" /></div>
                                    Suporte Prioritário
                                </li>
                            </ul>
                            <button
                                onClick={() => navigate('/assinar?plano=Básico 300 MEGA')}
                                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-colors"
                            >
                                Assinar Agora
                            </button>
                        </div>

                        {/* Plan 2 (Featured) */}
                        <div className="p-8 rounded-2xl bg-blue-600 border border-blue-500 transform md:-translate-y-4 shadow-2xl shadow-blue-600/20 relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                MAIS VENDIDO
                            </div>
                            <h3 className="text-xl font-medium text-blue-100 mb-2">Gamer</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-bold text-white">600</span>
                                <span className="text-2xl text-blue-200 font-bold">MEGA</span>
                            </div>
                            <div className="mb-8">
                                <span className="text-sm text-blue-200">R$</span>
                                <span className="text-5xl font-bold text-white">119</span>
                                <span className="text-sm text-blue-200">,90/mês</span>
                            </div>
                            <ul className="space-y-4 mb-8 text-blue-50">
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"><ArrowRight className="w-3 h-3 text-white" /></div>
                                    Instalação Grátis
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"><ArrowRight className="w-3 h-3 text-white" /></div>
                                    Wi-Fi 6 de Alta Performance
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"><ArrowRight className="w-3 h-3 text-white" /></div>
                                    IP Fixo Opcional
                                </li>
                            </ul>
                            <button
                                onClick={() => navigate('/assinar?plano=Gamer 600 MEGA')}
                                className="w-full py-4 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-colors shadow-lg"
                            >
                                Assinar Agora
                            </button>
                        </div>

                        {/* Plan 3 */}
                        <div className="p-8 rounded-2xl bg-slate-800 border border-white/10 hover:border-blue-500/50 transition-all relative group">
                            <h3 className="text-xl font-medium text-slate-300 mb-2">Ultra</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold">1</span>
                                <span className="text-xl text-blue-400 font-bold">GIGA</span>
                            </div>
                            <div className="mb-8">
                                <span className="text-sm text-slate-400">R$</span>
                                <span className="text-4xl font-bold text-white">199</span>
                                <span className="text-sm text-slate-400">,90/mês</span>
                            </div>
                            <ul className="space-y-4 mb-8 text-slate-300">
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center"><ArrowRight className="w-3 h-3 text-blue-400" /></div>
                                    Instalação Premium
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center"><ArrowRight className="w-3 h-3 text-blue-400" /></div>
                                    Wi-Fi 6 Mesh (2 pontos)
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center"><ArrowRight className="w-3 h-3 text-blue-400" /></div>
                                    Atendimento VIP
                                </li>
                            </ul>
                            <button
                                onClick={() => navigate('/assinar?plano=Ultra 1 GIGA')}
                                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-colors"
                            >
                                Assinar Agora
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contato" className="bg-slate-950 py-12 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Wifi className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">GraceNet</span>
                            </div>
                            <p className="text-slate-400 max-w-sm">
                                Levando a melhor conexão até você. Tecnologia, velocidade e compromisso com a qualidade.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Links Rápidos</h4>
                            <ul className="space-y-2 text-slate-400">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Sobre Nós</a></li>
                                <li><a href="#planos" className="hover:text-blue-400 transition-colors">Planos</a></li>
                                <li><a href="/area-cliente/login" className="hover:text-blue-400 transition-colors">Área do Cliente</a></li>
                                <li><a href="/login" className="hover:text-blue-400 transition-colors">Área do Colaborador</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Contato</h4>
                            <ul className="space-y-2 text-slate-400">
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    0800 123 4567
                                </li>
                                <li>suporte@gracenet.com.br</li>
                                <li>Rua da Tecnologia, 1000</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/10 text-center text-slate-500 text-sm">
                        © 2024 GraceNet Provedor de Internet. Todos os direitos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
