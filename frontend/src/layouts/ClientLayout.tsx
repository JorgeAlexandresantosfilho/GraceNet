import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, FileText, LifeBuoy, Wifi } from 'lucide-react';

const ClientLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const clientUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');

    React.useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            navigate('/area-cliente/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('currentUser');
        navigate('/area-cliente/login');
    };

    const navItems = [
        { icon: Home, label: 'Início', path: '/area-cliente/dashboard' },
        { icon: FileText, label: 'Faturas', path: '/area-cliente/faturas' },
        { icon: LifeBuoy, label: 'Suporte', path: '/area-cliente/suporte' },
        { icon: Wifi, label: 'Speedtest', path: '/area-cliente/speedtest' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-blue-500 selection:text-white">
            {/* Sidebar */}
            <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 fixed h-full hidden md:flex flex-col z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                <div className="p-8 border-b border-slate-100/60">
                    <h1 className="text-3xl font-black bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                        GraceNet
                    </h1>
                    <p className="text-xs font-medium text-slate-400 mt-2 tracking-wide uppercase">Área do Cliente</p>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden ${isActive
                                    ? 'text-blue-600 shadow-lg shadow-blue-500/10'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-100" />
                                )}
                                <item.icon className={`w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                <span className="relative z-10">{item.label}</span>
                                {isActive && (
                                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-600" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-slate-100/60 bg-gradient-to-b from-transparent to-slate-50/50">
                    <div className="flex items-center gap-4 px-4 py-4 mb-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                            {clientUser.nome ? clientUser.nome.charAt(0) : 'C'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{clientUser.nome || 'Cliente'}</p>
                            <p className="text-xs text-slate-500 truncate font-medium">CPF: {clientUser.cpf}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 border border-transparent hover:border-red-100"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair da conta
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 p-8 md:p-12 transition-all duration-300">
                <div className="max-w-7xl mx-auto animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ClientLayout;
