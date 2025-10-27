import React from "react";
import { BarChart3, Headphones, Home, Menu, Users, Wifi, Router, FileText } from "lucide-react";

interface SidebarProps {
  abaAtiva: string;
  definirAbaAtiva: (tab: string) => void;
  recolhida: boolean;
  definirRecolhida: (recolhida: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  abaAtiva,
  definirAbaAtiva,
  recolhida,
  definirRecolhida,
}) => {
  const itensMenu = [
    { id: "dashboard", rotulo: "Dashboard", icone: BarChart3 },
    { id: "clientes", rotulo: "Clientes", icone: Users },
    { id: "planos", rotulo: "Planos", icone: Wifi },
    { id: "equipamentos", rotulo: "Equipamentos", icone: Router },
    { id: "suporte", rotulo: "Suporte", icone: Headphones },
    { id: "relatorios", rotulo: "Relatórios", icone: FileText },
  ];

  return (
    <div
      className={`bg-white shadow-lg h-screen fixed left-0 top-0 z-40 transition-all duration-300 ${
        recolhida ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!recolhida && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-800">GraceNet</span>
            </div>
          )}
          <button
            type="button"
            title="Menu"
            onClick={() => definirRecolhida(!recolhida)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <nav className="mt-6">
        {itensMenu.map((item) => {
          const Icon = item.icone;
          const estaAtivo = abaAtiva === item.id;

          return (
            <button
              key={item.id}
              onClick={() => definirAbaAtiva(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                estaAtivo ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-600' : 'text-gray-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${estaAtivo ? 'text-blue-600' : 'text-gray-500'}`} />
              {!recolhida && (
                <span className={`ml-3 font-medium ${estaAtivo ? 'text-blue-600' : 'text-gray-700'}`}>
                  {item.rotulo}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
