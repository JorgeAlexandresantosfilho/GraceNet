import { useState } from "react";
// Importa as novas telas
import Register from "./components/auth/Register";
import PublicTicketForm from "./components/auth/PublicTicketForm";
import CustomerDetails from "./components/CustomerDetails";
import Login from "./components/auth/Login";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CustumerManagement from "./components/CustomerManagement";
import Plans from "./components/Plans";
import Equipment from "./components/Equipment";
import Support from "./components/Support";
import Reports from "./components/Reports";

// Adiciona o novo tipo de página
type Pagina = "dashboard" | "clientes" | "planos" | "equipamentos" | "suporte" | "relatorios";
// Adiciona a nova visualização de autenticação
type AuthView = 'login' | 'register' | 'publicTicket';

function App() {
  const [isAutenticado, setIsAutenticado] = useState(false);
  const [abaAtiva, definirAbaAtiva] = useState<Pagina>("dashboard");
  const [barraLateralRecolhida, definirBarraLateralRecolhida] = useState(false);
  const [idClienteSelecionado, definirIdClienteSelecionado] = useState<
    number | null
  >(null);
  
  const [authView, setAuthView] = useState<AuthView>('login');

  const renderizarConteudo = () => {
    if (idClienteSelecionado) {
      return (
        <CustomerDetails 
          idCliente={idClienteSelecionado}
          onBack={() => definirIdClienteSelecionado(null)}
        />
      );
    }

    switch (abaAtiva) {
      case "dashboard":
        return <Dashboard />;
      case "clientes":
        return <CustumerManagement onSelecionarCliente={definirIdClienteSelecionado} />;
      case "planos":
        return <Plans />;
      case "equipamentos":
        return <Equipment />;
      case "suporte":
        return <Support />;
      case "relatorios":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  const renderizarAutenticacao = () => {
    switch (authView) {
      case 'login':
        return (
          <Login 
            onLogin={() => {setIsAutenticado(true)}}
            onNavigateToRegister={() => setAuthView('register')}
            onNavigateToPublicTicket={() => setAuthView('publicTicket')} 
          />
        );
      case 'register':
         return (
           <Register
             onNavigateToLogin={() => setAuthView('login')}
           />
         );
      case 'publicTicket':
          return (
            <PublicTicketForm
              onNavigateToLogin={() => setAuthView('login')}
            />
          );
      default:
        return <div>Erro de navegação</div>;
    }
  };

  if (!isAutenticado) {
    return renderizarAutenticacao();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        abaAtiva={abaAtiva}
        // <<< --- CORREÇÃO AQUI --- >>>
        // Passa uma função que aceita 'string' (como o Sidebar espera)
        definirAbaAtiva={(tab: string) => definirAbaAtiva(tab as Pagina)}
        recolhida={barraLateralRecolhida}
        definirRecolhida={definirBarraLateralRecolhida}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          barraLateralRecolhida ? "ml-16" : "ml-64"
        }`}
      >
        {/* <<< --- CORREÇÃO AQUI --- >>> */}
        {/* Removemos a prop 'onLogout' por enquanto, já que o Header não a aceita */}
        <Header /> 
        <main className="flex-1 p-6 overflow-auto">{renderizarConteudo()}</main>
      </div>
    </div>
  );
}

export default App;