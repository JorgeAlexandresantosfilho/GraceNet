import { useState } from "react";
import Register from "./components/auth/Register";
import PublicTicketForm from "./components/auth/PublicTicketForm";
import Login from "./components/auth/Login";
import { isUserLoggedIn, logoutUser, getCurrentUser } from "./services/api";
import type { Usuario } from "./types";

import CustomerDetails from "./components/CustomerDetails";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CustumerManagement from "./components/CustomerManagement";
import Plans from "./components/Plans";
import Equipment from "./components/Equipment";
import Support from "./components/Support";
import Reports from "./components/Reports";
import UserManagement from "./components/UserManagement";
import MeuPerfil from "./components/MeuPerfil";

type Pagina = 
  "dashboard" | "clientes" | "planos" | "equipamentos" | 
  "suporte" | "relatorios" | "usuarios" | "meuperfil";

type AuthView = 'login' | 'register' | 'publicTicket';

function App() {
  const [authData, setAuthData] = useState(isUserLoggedIn());
  const [abaAtiva, definirAbaAtiva] = useState<Pagina>("dashboard");

  const [barraLateralRecolhida, definirBarraLateralRecolhida] = useState(false);
  const [idClienteSelecionado, definirIdClienteSelecionado] = useState<number | null>(null);
  const [authView, setAuthView] = useState<AuthView>("login");

  const handleLogin = () => {
    const usuario = getCurrentUser();
    setAuthData({ auth: true, user: usuario });
  };

  const handleLogout = () => {
    logoutUser();
    setAuthData({ auth: false, user: null });
    setAuthView("login");
  };

  const renderizarConteudo = () => {
    if (idClienteSelecionado)
      return (
        <CustomerDetails
          idCliente={idClienteSelecionado}
          onBack={() => definirIdClienteSelecionado(null)}
        />
      );

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
      case "usuarios":
        return <UserManagement />;
      case "meuperfil":
        return <MeuPerfil />;
      default:
        return <Dashboard />;
    }
  };

  const renderizarAutenticacao = () => {
    switch (authView) {
      case "login":
        return (
          <Login
            onLogin={handleLogin}
            onNavigateToRegister={() => setAuthView("register")}
            onNavigateToPublicTicket={() => setAuthView("publicTicket")}
          />
        );
      case "register":
        return (
          <Register
            onNavigateToLogin={() => setAuthView("login")}
          />
        );
      case "publicTicket":
        return (
          <PublicTicketForm
            onNavigateToLogin={() => setAuthView("login")}
          />
        );
      default:
        return <div>Erro</div>;
    }
  };

  if (!authData.auth) return renderizarAutenticacao();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        abaAtiva={abaAtiva}
        definirAbaAtiva={(tab: string) => definirAbaAtiva(tab as Pagina)}
        recolhida={barraLateralRecolhida}
        definirRecolhida={definirBarraLateralRecolhida}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          barraLateralRecolhida ? "ml-16" : "ml-64"
        }`}
      >
        <Header
          currentUser={authData.user}
          onLogout={handleLogout}
          onOpenProfile={() => definirAbaAtiva("meuperfil")}
        />

        <main className="flex-1 p-6">{renderizarConteudo()}</main>
      </div>
    </div>
  );
}

export default App;
