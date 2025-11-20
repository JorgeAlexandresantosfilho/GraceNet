import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, FileText, LifeBuoy } from 'lucide-react';

const ClientLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const clientUser = JSON.parse(localStorage.getItem('clientUser') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('clientToken');
        localStorage.removeItem('clientUser');
        navigate('/area-cliente/login');
    };

    const navItems = [
        { icon: Home, label: 'Início', path: '/area-cliente/dashboard' },
        { icon: FileText, label: 'Faturas', path: '/area-cliente/faturas' },
        { icon: LifeBuoy, label: 'Suporte', path: '/area-cliente/suporte' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 fixed h-full hidden md:flex flex-col z-10">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        GraceNet
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Área do Cliente</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {clientUser.nome ? clientUser.nome.charAt(0) : 'C'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{clientUser.nome || 'Cliente'}</p>
                            <p className="text-xs text-slate-500 truncate">CPF: {clientUser.cpf}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default ClientLayout;
