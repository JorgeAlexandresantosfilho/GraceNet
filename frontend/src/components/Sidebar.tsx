import React from "react";
import { BarChart3, Headphones, Home, Menu, Users, Wifi, Router, FileText, Map, UserCog } from "lucide-react";

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
    { id: "planos", rotulo: "Plano", icone: Wifi },
    { id: "equipamentos", rotulo: "Equipamentos", icone: Router },
    { id: "suporte", rotulo: "Suporte", icone: Headphones },
    { id: "relatorios", rotulo: "Relatórios", icone: FileText },
    // <<< --- ADICIONE ESTA LINHA --- >>>
    { id: "usuarios", rotulo: "Usuários", icone: Users },
    { id: "tecnicos", rotulo: "Funcionários", icone: UserCog },
    { id: "mapa", rotulo: "Mapa", icone: Map },
  ];

  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-lg h-screen fixed left-0 top-0 z-40 transition-all duration-300 border-r border-gray-200 dark:border-gray-700 ${recolhida ? "w-16" : "w-64"
        }`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!recolhida && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-800 dark:text-white">GraceNet</span>
            </div>
          )}
          <button
            type="button"
            title="Menu"
            onClick={() => definirRecolhida(!recolhida)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
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
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${estaAtivo
                ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300'
                }`}
            >
              <Icon className={`w-5 h-5 ${estaAtivo ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
              {!recolhida && (
                <span className={`ml-3 font-medium ${estaAtivo ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
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