import { useState, useEffect } from "react";
// Importa as novas telas e funções de auth
import Register from "./components/auth/Register";
import PublicTicketForm from "./components/auth/PublicTicketForm";
import Login from "./components/auth/Login";
// --- FUNÇÕES DE AUTH ATUALIZADAS ---
import { isUserLoggedIn, logoutUser, getCurrentUser } from "./services/api"; 
import type { Usuario } from "./types"; // Importa o tipo Usuario

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

type Pagina = "dashboard" | "clientes" | "planos" | "equipamentos" | "suporte" | "relatorios" | "usuarios";
type AuthView = 'login' | 'register' | 'publicTicket';

function App() {
  // --- ESTADOS GLOBAIS ---
  // Inicia checando se o usuário já está logado
  const [authData, setAuthData] = useState(isUserLoggedIn()); 
  const [abaAtiva, definirAbaAtiva] = useState<Pagina>("dashboard");
  
  // Estados de UI
  const [barraLateralRecolhida, definirBarraLateralRecolhida] = useState(false);
  const [idClienteSelecionado, definirIdClienteSelecionado] = useState<number | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');
  
  // --- FUNÇÕES DE NAVEGAÇÃO E AUTENTICAÇÃO ---
  const handleLogin = () => {
    const usuarioLogado = getCurrentUser(); // Pega os dados que o loginUser salvou
    setAuthData({ auth: true, user: usuarioLogado });
    setAuthView('login'); // Reseta a tela de auth para o padrão
  };
  
  const handleLogout = () => {
    logoutUser(); // Limpa o sessionStorage
    setAuthData({ auth: false, user: null });
    setAuthView('login'); // Volta para a tela de login
  };

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
      case "usuarios":
        return <UserManagement />;
      default:
        return <Dashboard />;
    }
  };

  const renderizarAutenticacao = () => {
    switch (authView) {
      case 'login':
        return (
          <Login 
            onLogin={handleLogin} // Passa a função de login
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

  // --- RENDERIZAÇÃO PRINCIPAL ---
  if (!authData.auth) { // Se 'auth' for false
    return renderizarAutenticacao();
  }

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
        {/* --- CORREÇÃO AQUI --- */}
        {/* Agora passamos os dados do usuário e a função de logout para o Header */}
        <Header 
          currentUser={authData.user} // Passa o objeto do usuário
          onLogout={handleLogout}      // Passa a função de logout
        />
        <main className="flex-1 p-6 overflow-auto">{renderizarConteudo()}</main>
      </div>
    </div>
  );
}

export default App;